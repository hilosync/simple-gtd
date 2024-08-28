from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

class Todo(models.Model):
    title = models.TextField(blank=True)
    extra = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    priority = models.IntegerField(default=0, validators=[MaxValueValidator(10), MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']