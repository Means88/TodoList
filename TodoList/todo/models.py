from django.db import models
from django.conf import settings


class Todo(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('-updated_at',)
