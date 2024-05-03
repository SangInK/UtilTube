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

            subs = _get_subscriptions(request, 0)

            return Response({"isOk": True, "subs": subs}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


def _update_credentials(request):
    credentials = CredentialsService(request.session["credentials"])
    request.session["credentials"] = credentials.credentials_to_dict()

    return credentials


def _get_subscriptions(request, pk):
    max_result = 20

    credentials = _update_credentials(request)

    youtube = credentials.get_youtube()

    subscriptions = (
        youtube.subscriptions()
        .list(part="id,snippet", maxResults=max_result, mine=True)
        .execute()
    )

    subs = None

    if pk == 0:
        subs = []
        my_subs = Subscription.objects.all()

        serializer = SubscriptionSerializer(my_subs, many=True)
        my_subs = serializer.data

        for item in [
            item["snippet"]
            for item in subscriptions["items"]
            if item["snippet"]["resourceId"]["channelId"]
            not in [item["subs_channel_id"] for item in my_subs]
        ]:
            subs_temp = {
                "subs_channel_id": item["resourceId"]["channelId"],
                "title": item["title"],
                "description": item["description"],
                "thumbnails": item["thumbnails"]["default"]["url"],
            }

            subs.append(subs_temp)

        subs = my_subs + subs

    else:
        subs = Subscription.objects.filter(folder=pk)

        serializer = SubscriptionSerializer(subs, many=True)
        subs = serializer.data

    return subs
