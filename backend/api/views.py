from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import API
from .serializers import APISerializer
from django_clerk import ClerkAuth

class APIViewSet(viewsets.ModelViewSet):
    queryset = API.objects.all()
    serializer_class = APISerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [ClerkAuth]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
