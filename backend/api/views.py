import json
from dotenv import load_dotenv
import requests
from urllib.request import urlopen
from django.http import JsonResponse
from rest_framework.authentication import SessionAuthentication
import jwt
import os
from jwt.algorithms import RSAAlgorithm
from rest_framework import viewsets
from api.custom_auth import ClerkAuthentication
from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    authentication_classes = [ClerkAuthentication, SessionAuthentication]
    serializer_class = TodoSerializer
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        print("create method called")  # Debug print
        print("Received data:", request.data)  # Debug print
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        print("list method called")  # Debug print
        return super().list(request, *args, **kwargs)

    # Explicitly define allowed methods
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


BASEDIR = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '../..'))
load_dotenv(os.path.join(BASEDIR, '.env'))


# def todos(request):
#     print('1')
#     userid = validate_token(request.headers['Authorization'])
#     print(userid)

#     data = {
#         'userId': userid,
#     }
#     print(data)
#     return JsonResponse(data)


# def validate_token(auth_header: str) -> str:
#     """
#     returns user_id if valid
#     raises AuthenticationException otherwise
#     """
#     try:
#         token = auth_header.split(" ")[1]
#     except (AttributeError, KeyError):
#         raise print("No authentication token provided")

#     jwks = requests.get(
#         "https://api.clerk.com/v1/jwks",
#         headers={
#             "Accept": "application/json",
#             "Authorization": f"Bearer {os.getenv('CLERK_SECRET_KEY')}",
#         },
#     ).json()
#     public_key = RSAAlgorithm.from_jwk(jwks["keys"][0])
#     try:
#         payload = jwt.decode(
#             token,
#             public_key,
#             algorithms=["RS256"],
#             options={"verify_signature": True},
#         )
#     except jwt.ExpiredSignatureError:
#         raise print("Token has expired.")
#     except jwt.DecodeError:
#         raise print("Token decode error.")
#     except jwt.InvalidTokenError:
#         raise print("Invalid token.")
#     user_id = payload.get("sub")
#     return user_id