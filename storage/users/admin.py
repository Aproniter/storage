from django.contrib import admin

from .models import User


class UserAdmin(admin.ModelAdmin):
    search_fields = ('username', 'email')
    # exclude = ('code',)


admin.site.register(User, UserAdmin)