from rest_framework import serializers
from .models import News, Event, Task, Attendance
from users.serializers import UserDetailSerializer

class NewsSerializer(serializers.ModelSerializer):
  author = UserDetailSerializer()
  
  class Meta:
    model = News
    fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
  class Meta:
    model = Event
    fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
  class Meta:
    model = Task
    fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
  class Meta:
    model = Attendance
    fields = '__all__'
