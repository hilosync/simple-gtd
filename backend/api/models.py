from django.db import models
from django_clerk import get_clerk_user_model

User = get_clerk_user_model()

class API(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title