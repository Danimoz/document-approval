from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from users.models import GeneralManager
from .serializers import (
    NewsSerializer,
    EventSerializer,
    AttendanceSerializer,
    TaskSerializer
)
from .models import News, Event, Task, Attendance
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwner, IsAssigner

# Create your views here.
class ListCreateNewsView(ListCreateAPIView):
    serializer_class = NewsSerializer
    permission_classes = [IsAuthenticated]
    queryset = News.objects.all().order_by('-id')[:5]

    def perform_create(self, serializer):
        serializer.save(author = self.request.user)


class TakeAttendance(CreateAPIView):
    serializer_class = AttendanceSerializer
    queryset = Attendance.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NewsUpdateView(RetrieveUpdateDestroyAPIView):
    serializer_class = NewsSerializer
    queryset = News.objects.all()
    permission_classes = [IsAuthenticated, IsOwner, ]


class ListCreateEventView(ListCreateAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated, ]

    def perform_create(self, serializer):
        serializer.save(posted_by = self.request.user)


class EventUpdateView(RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated, ]



class TaskListCreateView(ListCreateAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated, ]

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(assigned_by=self.request.user)


class TaskUpdateView(RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated, IsAssigner, ]