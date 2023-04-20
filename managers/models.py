from django.db import models
from django.conf import settings
from users.models import Base


# Create your models here.
class Event(Base):
    title = models.CharField(max_length=100)
    description = models.TextField()
    event_date = models.DateTimeField(auto_now_add=True)
    venue = models.CharField(max_length=255)
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT)

    def __str__(self):
        return self.title

class News(Base):
    headline = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT)

    def __str__(self) -> str:
        return self.headline


class Task(Base):
    title = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.DateTimeField()
    status = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name='assignee')
    assigned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, related_name='assigner')
    completed_date = models.DateTimeField()

    def __str__(self):
        return self.title


class Attendance(Base):
    date = models.DateField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.RESTRICT, null=True, unique_for_date='date')

    def __str__(self):
        return f'Attendance for {self.user} on {self.created_at}'