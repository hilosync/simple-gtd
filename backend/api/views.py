import json
from dotenv import load_dotenv
import requests
from urllib.request import urlopen
from rest_framework.decorators import action
from rest_framework.response import Response
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
    
    @action(detail=True, methods=['patch'])
    def toggle_completion(self, request, pk=None):
        todo = self.get_object()
        todo.completed = not todo.completed
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(serializer.data)

    # Explicitly define allowed methods
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']


BASEDIR = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '../..'))
load_dotenv(os.path.join(BASEDIR, '.env'))