import os
from django.contrib.auth import get_user_model
import jwt
from jwt.algorithms import RSAAlgorithm
import requests
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

User = get_user_model()

class ClerkAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            user_id, validated_token = validate_token(request.headers['Authorization'])
            user, created = User.objects.get_or_create(username=user_id)
            return (user, validated_token)
        except InvalidToken:
            return None
        
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
    return user_id, payload