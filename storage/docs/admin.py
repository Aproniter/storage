from django.contrib import admin

from .models import (
    Project, Note, Document, Chapter
)


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'status', 'created_at', 'updated_at')
    search_fields = ('title', 'owner__username')


class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'note_type', 'created_at', 'updated_at')
    search_fields = ('title', 'note_type')
    list_filter = ('projects',)


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'created_at', 'updated_at')
    search_fields = ('title', 'project__title', 'code')
    list_filter = ('project__title',)


class ChapterAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title', 'project__title')
    list_filter = ('projects',)


admin.site.register(Project, ProjectAdmin)
admin.site.register(Note, NoteAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(Chapter, ChapterAdmin)
