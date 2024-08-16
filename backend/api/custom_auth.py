from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

User = get_user_model()

class ClerkAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            validated_token = self.get_validated_token(request)
            user_id = validated_token['sub']
            user, created = User.objects.get_or_create(username=user_id)
            return (user, validated_token)
        except InvalidToken:
            return None