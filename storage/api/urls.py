from django.urls import path, include
from rest_framework.routers import SimpleRouter

from knox import views as knox_views

from .views import (
    ProjectViewSet, LoginView, registration, 
    activate, send_note,
)

app_name = 'api'

router = SimpleRouter()
router.register('^projects', ProjectViewSet, basename='projects')

urlpatterns = [
    path('', include(router.urls)),
    path(
        'signup/',
        registration,
        name='registration'
    ),
    path('login/', LoginView.as_view(), name='knox_login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path(
        'logoutall/', 
        knox_views.LogoutAllView.as_view(), 
        name='knox_logoutall'
    ),
    path(
        'activate/',
        activate,
        name='activate'
    ),
    path(
        'notes/',
        send_note,
        name='send_note'
    ),
    # path(
    #     'notes/<int:pk>',
    #     delete_note,
    #     name='delete_note'
    # )
]
