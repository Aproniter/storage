from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import (
    ProjectViewSet, get_chapters, get_notes, get_file, 
    get_preview
)

app_name = 'api'

router = SimpleRouter()
router.register('^projects', ProjectViewSet, basename='projects')

urlpatterns = [
    path('', include(router.urls)),
    path(
        'chapters/',
        get_chapters,
        name='get_chapters'
    ),
    path(
        'notes/',
        get_notes,
        name='get_notes'
    ),
    path(
        'get_file/<int:project_pk>/<int:chapter_pk>/',
        get_file,
        name='get_file'
    ),
    path(
        'get_preview/<int:project_pk>/<int:chapter_pk>/',
        get_preview,
        name='get_preview'
    )
]
