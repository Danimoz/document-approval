from django.contrib import admin
from .models import News, Event, Task, Attendance

# Register your models here.
admin.site.register(News)
admin.site.register(Event)
admin.site.register(Attendance)
admin.site.register(Task)