import json
from dotenv import load_dotenv
import requests
from urllib.request import urlopen
from django.http import JsonResponse
import jwt
import os
from jwt.algorithms import RSAAlgorithm
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import API
from .serializers import APISerializer

BASEDIR = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '../..'))
load_dotenv(os.path.join(BASEDIR, '.env'))

class APIViewSet(viewsets.ModelViewSet):
    queryset = API.objects.all()
    serializer_class = APISerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


def todos(request):
    print('1')
    userid = validate_token(request.headers['Authorization'])
    print(userid)
    # Strip the "Bearer " prefix from the header
    # token = request.headers['Authorization'][7:]
    # print('2')

    # # Update this to 'https://{clerk_frontend_api}/.well-known/jwks.json'
    # # Note: The content of this endpoint will never change, so it should
    # # be cached on the server instead of requested with each API call
    # url = 'https://artistic-haddock-36.clerk.accounts.dev/.well-known/jwks.json'
    # response = urlopen(url)
    # print('3')
    # data_json = json.loads(response.read())
    # print(data_json['keys'][0])

    # decoded = jwt.decode(token, data_json['keys'][0], algorithms=['RS256'])

    # print('5')
    data = {
        'userId': userid,
    }
    print(data)
    return JsonResponse(data)


def validate_token(auth_header: str) -> str:
    """
    returns user_id if valid
    raises AuthenticationException otherwise
    """
    try:
        token = auth_header.split(" ")[1]
    except (AttributeError, KeyError):
        raise print("No authentication token provided")

    jwks = requests.get(
        "https://api.clerk.com/v1/jwks",
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {os.getenv('CLERK_SECRET_KEY')}",
        },
    ).json()
    public_key = RSAAlgorithm.from_jwk(jwks["keys"][0])
    try:
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            options={"verify_signature": True},
        )
    except jwt.ExpiredSignatureError:
        raise print("Token has expired.")
    except jwt.DecodeError:
        raise print("Token decode error.")
    except jwt.InvalidTokenError:
        raise print("Invalid token.")
    user_id = payload.get("sub")
    return user_id