import logging
import json
from django.shortcuts import get_object_or_404
from dotenv import load_dotenv
from typing import List
import openai
from pydantic import BaseModel, Field
from openai import OpenAI
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
import os
from jwt.algorithms import RSAAlgorithm
from rest_framework import status, viewsets
from api.custom_auth import ClerkAuthentication
from .models import Todo
from .serializers import TodoSerializer
import traceback

logger = logging.getLogger(__name__)

class TodoItem(BaseModel):
    id: int
    title: str
    extra: str = Field(default="")
    priority: int = Field(ge=0, le=10, default=0)
class OpenAIResponse(BaseModel):
    todo: List[TodoItem]

class TodoViewSet(viewsets.ModelViewSet):
    
    queryset = Todo.objects.all()
    authentication_classes = [ClerkAuthentication, SessionAuthentication]
    serializer_class = TodoSerializer
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


    @action(detail=False, methods=['delete'])
    def delete_completed(self, serializer):
        objects = Todo.objects.filter(user=self.request.user, completed=True)
        for todo in objects:
            todo.delete()

        return Response(status=200)


    @action(detail=True, methods=['patch'])
    def toggle_completion(self, request, pk=None):
        todo = self.get_object()
        todo.completed = not todo.completed
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(status=200)

    @action(detail=False, methods=['post'])
    def generate_tips(self, request):
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        todos = Todo.objects.filter(user=request.user, completed=False, extra="")
        todo_items = [{"id": todo.id, "title": todo.title} for todo in todos]

        if not todo_items:
            return Response({"detail": "No incomplete todos found."}, status=200)
        
        functions = [
                {
                    "name": "process_todos",
                    "description": "Process a list of todos, providing tips and priorities for each",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "processed_todos": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {"type": "integer"},
                                        "title": {"type": "string"},
                                        "extra": {"type": "string"},
                                        "priority": {"type": "integer", "minimum": 1, "maximum": 10}
                                    },
                                    "required": ["id", "title", "extra", "priority"]
                                }
                            }
                        },
                        "required": ["processed_todos"],
                    }
                }
            ]

        try:
            prompt = f"""
            Here are some todos for a person with ADHD:
            {todo_items}

            Please provide helpful tips for each todo and assign a priority from 1 to 10 (10 being highest priority), considering the following:
            1. If the todo is nonsensical or short, or no appropriate tips can be given, do not provide any hints or break it down into subtasks, leave the 'extra' field empty.
            2. If or the todo is nonsensical, too short or ambiguous, set the priority to 1.
            3. Assess the importance and urgency of each task to assign the priority, with things like eating or work taking higher priority.
            5. If appropriate, suggest strategies to stay focused and motivated.
            6. If possible and appropriate, provide time management tips.
            7. Do not put the priority in the 'extra' field.
            8. Do not consider the other todos when setting the priority.
            """

            completion = client.beta.chat.completions.parse(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that provides tips for managing tasks, especially for people with ADHD. You also prioritize tasks on a scale of 1-10."},
                    {"role": "user", "content": prompt}
                ],
                functions=functions,
                function_call={"name": "process_todos"},
            )

            response_content = json.loads(completion.choices[0].message.function_call.arguments)
            
            updated_todos = []
            for processed_todo in response_content['processed_todos']:
                todo = get_object_or_404(Todo, id=processed_todo['id'], user=request.user)
                todo.extra = processed_todo['extra']
                todo.priority = processed_todo['priority']
                todo.save()
                updated_todos.append(TodoItem(**processed_todo))

            return Response({
                "detail": "Tips generated, priorities assigned, and todos updated successfully.", 
                "updated_todos": [item.dict() for item in updated_todos]
            })

        except openai.OpenAIError as e:
            return Response({
                "detail": "An error occurred while processing the todos.",
                "error": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


BASEDIR = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '../..'))
load_dotenv(os.path.join(BASEDIR, '.env'))