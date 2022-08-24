from django.urls import path, include
from rest_framework.routers import SimpleRouter

from knox import views as knox_views

from .views import (
    ProjectViewSet, get_chapters, get_notes, get_file, 
    get_preview, get_docfiles, LoginView
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
        'docfiles/',
        get_docfiles,
        name='get_docfiles'
    ),
    path(
        'get_file/<int:pk>/',
        get_file,
        name='get_file'
    ),
    path(
        'get_preview/<int:pk>/',
        get_preview,
        name='get_preview'
    ),
    path('login/', LoginView.as_view(), name='knox_login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]
