from dotenv import load_dotenv
import openai
from openai import OpenAI
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
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

    @action(detail=False, methods=['post'])
    def generate_tips(self, request):
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        todos = Todo.objects.filter(user=self.request.user, completed=False)

        todo_titles = [todo.title for todo in todos]

        if not todo_titles:
            return Response({"detail": "No incomplete todos found."}, status=400)

        try:
            prompt = f"Here are some todos: {', '.join(todo_titles)}. Could you give helpful tips and order them by importance or urgency?"

            response = client.completions.create(model="text-davinci-003",
            prompt=prompt,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7)

            generated_tips = response.choices[0].text.strip().split('\n')

            for idx, todo in enumerate(todos):
                if idx < len(generated_tips):
                    todo.extra = generated_tips[idx].strip()
                todo.save()

            return Response({"detail": "Tips generated and todos updated successfully."})

        except openai.OpenAIError as e:
            return Response({"detail": str(e)}, status=500)


BASEDIR = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '../..'))
load_dotenv(os.path.join(BASEDIR, '.env'))