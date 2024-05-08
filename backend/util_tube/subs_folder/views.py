from django.db.models import Q

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from utils.auth.CredentialsService import CredentialsService

from .models import Folder, Subscription
from .serializers import FolderSerializer, SubscriptionSerializer


class folders(APIView):
    def get(self, request):
        if "credentials" in request.session:
            credentials = _update_credentials(request)
            credentials.set_google_user(credentials.credentials.token)

            folder = Folder.objects.filter(
                google_user=credentials.google_user.data["id"]
            )
            serializer = FolderSerializer(folder, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        if "credentials" in request.session:
            credentials = _update_credentials(request)
            credentials.set_google_user(credentials.credentials.token)

            request.data["google_user"] = credentials.google_user.data["id"]
            serializer = FolderSerializer(data=request.data)

            if serializer.is_valid(raise_exception=True):
                serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class folder(APIView):
    def delete(self, request, pk):
        try:
            folder = Folder.objects.get(id=pk)
            folder.delete()

            return Response({"isOk": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"isOk": False}, status=status.HTTP_400_BAD_REQUEST)


class subscription(APIView):
    def delete(self, request):
        try:
            filter_channel = Q()

            for item in request.data:
                filter_channel |= Q(subs_id=item["subs_id"])

            subs = Subscription.objects.filter(filter_channel)
            subs.delete()

            subs = _get_subscriptions(request, 0)

            return Response({"isOk": True, "data": subs}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class subscriptions(APIView):
    def get(self, request, pk):
        if "credentials" in request.session:
            subs = _get_subscriptions(request, pk)

            return Response(subs, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, pk):
        # 이미 입력된 구독채널이 있으면 삭제
        data = [data for data in request.data if "folder" in data]

        if len(data) > 0:
            filter = Q()

            for item in data:
                filter |= Q(subs_id=item["subs_id"])

            subs = Subscription.objects.filter(filter)
            subs.delete()

        # 이미 입렬된 구독채널 삭제 후 request.data를 사용하여 다시 입력
        data = request.data
        folder = Folder.objects.get(id=pk)
        folder_serializer = FolderSerializer(folder)

        for item in data:
            item["folder"] = folder_serializer.data

        serializer = SubscriptionSerializer(data=data, many=True)

        if serializer.is_valid(raise_exception=True):
            serializer.save()

        subs = _get_subscriptions(request, 0)

        return Response({"isOk": True, "data": subs}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            filter = Q(folder=pk)
            filter_channel_id = Q()

            for subs_channel_id in request.data["subs"]:
                filter_channel_id |= Q(subs_channel_id=subs_channel_id)

            filter &= filter_channel_id

            subs = Subscription.objects.filter(filter)
            subs.delete()

            return Response({"isOk": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


def _update_credentials(request):
    credentials = CredentialsService(request.session["credentials"])
    request.session["credentials"] = credentials.credentials_to_dict()

    return credentials


def _get_subscriptions(request, pk):
    max_result = 25

    credentials = _update_credentials(request)

    youtube = credentials.get_youtube()

    subscriptions = (
        youtube.subscriptions()
        .list(part="id,snippet", maxResults=max_result, mine=True)
        .execute()
    )

    subs = {"page_info": subscriptions}

    if pk == 0:
        subs["items"] = []
        my_subs = Subscription.objects.all()

        serializer = SubscriptionSerializer(my_subs, many=True)
        my_subs = serializer.data

        for item in [
            item["snippet"]
            for item in subscriptions["items"]
            if item["snippet"]["resourceId"]["channelId"]
            not in [item["subs_id"] for item in my_subs]
        ]:
            subs_temp = {
                "subs_id": item["resourceId"]["channelId"],
                "title": item["title"],
                "description": item["description"],
                "thumbnails": item["thumbnails"]["default"]["url"],
            }

            subs["items"].append(subs_temp)

        subs["items"] = my_subs + subs["items"]

    else:
        subs["items"] = Subscription.objects.filter(folder=pk)

        serializer = SubscriptionSerializer(subs["items"], many=True)
        subs["items"] = serializer.data

    return subs
