from django.urls import path
from .views import (
    ListCreateEventView,
    ListCreateNewsView,
    NewsUpdateView,
    EventUpdateView,
    TaskListCreateView,
    TaskUpdateView,
    TakeAttendance,
)

urlpatterns = [
    path('news/', ListCreateNewsView.as_view(), name='news'),
    path('news-update/<int:pk>/', NewsUpdateView.as_view(), name='news-update'),
    path('events/', ListCreateEventView.as_view(), name='events'),
    path('events-update/<int:pk>/', EventUpdateView.as_view(), name='events-update'),
    path('task/', TaskListCreateView.as_view(), name='task'),
    path('task-update/<int:pk>/', TaskUpdateView.as_view(), name='task-update'),
    path('take-attendance/', TakeAttendance.as_view(), name='take-attendance')
]