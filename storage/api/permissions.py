from rest_framework import permissions

class AdminOwnerEditorOrViewerReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        return (
            request.method in permissions.SAFE_METHODS
            and request.user.is_authenticated
            or request.user.is_admin
            or request.user.is_staff
        )

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            and request.method in permissions.SAFE_METHODS
            or request.user.is_admin
            or request.user.is_staff
            or request.user == obj.owner
            or request.user in obj.editors.all()
        )


class AllSendNotes(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return (
            request.user.is_authenticated
            
            # or request.user.is_admin
            # or request.user.is_staff
            # or request.user == obj.owner
            # or request.user in obj.editors.all()
        )
