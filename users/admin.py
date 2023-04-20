from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import NewUser, UserProfile, Department, GeneralManager


# Register your models here.
class UserAdminConfig(UserAdmin):
    search_fields = ('username', 'email', 'first_name', 'last_name',)
    list_filter = ('username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff')
    ordering = ('department', )
    list_display = ('username', 'email', 'first_name', 'last_name', 'department', 'is_active', 'is_staff', 'device_token')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'first_name', 'last_name', 'password', 'department', 'device_token')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser')}),
    )


# Register your models here.
admin.site.register(NewUser, UserAdminConfig)
admin.site.register(UserProfile)
admin.site.register(Department)
admin.site.register(GeneralManager)