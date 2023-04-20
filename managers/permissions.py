from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


class IsAssigner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.assigned_by == request.user