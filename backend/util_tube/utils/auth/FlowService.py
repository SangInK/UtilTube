import json
import os

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured

import google_auth_oauthlib.flow


class FlowService:
    API_URI = "auth/redirect"

    GOOGLE_CLIENT_TYPE = "web"

    SCOPES = [
        "https://www.googleapis.com/auth/youtube",
        "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
        "https://www.googleapis.com/auth/youtube.readonly",
    ]

    def __init__(self):
        self._set__client_data()
        self._set_config()

    def _set__client_data():
        file_path = os.path.join(os.path.dirname(__file__), "client_secret.json")

        with open(file_path, "r") as file:
            data = json.load(file)

        data = data.get(GOOGLE_CLIENT_TYPE, {})

        if not data.get("client_id"):
            raise ImproperlyConfigured("GOOGLE_OAUTH2_CLIENT_ID missing in settings.")

        if not data.get("client_secret"):
            raise ImproperlyConfigured(
                "GOOGLE_OAUTH2_CLIENT_SECRET missing in settings."
            )

        if not data.get("project_id"):
            raise ImproperlyConfigured("GOOGLE_OAUTH2_PROJECT_ID missing in settings.")

        self.json_data

    def _set_config(self):
        self.config = {
            self.GOOGLE_CLIENT_TYPE: {
                "client_id": self.json_data.get("client_id", ""),
                "client_secret": self.json_data.get("client_secret", ""),
                "project_id": self.json_data.get("project_id", ""),
                "auth_uri": self.json_data.get("auth_uri", ""),
                "token_uri": self.json_data.get("token_uri", ""),
                "auth_provider_x509_cert_url": self.json_data.get(
                    "auth_provider_x509_cert_url", ""
                ),
                "redirect_uris": [f"{settings.BASE_BACKEND_URL}{self.API_URI}"],
                "javascript_origins": [],
            }
        }

    def set_flow(self, data):
        flow = google_auth_oauthlib.flow.Flow.from_client_config(**data)
        flow.redirect_uri = self.config["web"]["redirect_uris"][0]

        self._flow = flow

    def get_authorization_url(self):
        authorization_url, state = self._flow.authorization_url(
            access_type="offline", include_granted_scopes="true", prompt="consent"
        )

        return authorization_url, state

    def set_token(self, code):
        self._flow.fetch_token(code=code)

    def get_credentials(self):
        credentials = self._flow.credentials

        return self._credentials_to_dict(credentials)

    def _credentials_to_dict(self, credentials):
        return {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
        }
