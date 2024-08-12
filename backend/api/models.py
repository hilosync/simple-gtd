from django.db import models

class API(models.Model):
    def __str__(self):
        return self.title