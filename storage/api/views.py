from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import permissions
from django.http import FileResponse
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login

from knox.views import LoginView as KnoxLoginView

from .serializers import (
    ChapterSerializer, ProjectSerializer, NoteSerializer, 
    DocfileSerializer, LoginSerializer)
from rest_framework.permissions import AllowAny, IsAuthenticated
from docs.models import Chapter, Project, Note, Document
from .services import get_images_from_pdf
from users.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chapters(request):
    queryset = Chapter.objects.none()
    project_id = request.query_params.get('project')
    if project_id is not None:
        queryset = Chapter.objects.filter(
            projects__id=project_id
        )
    serializer = ChapterSerializer(
        queryset,
        partial=True,
        many=True
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notes(request):
    queryset = Note.objects.none()
    notes_id = request.query_params.get('ids')
    if notes_id is not None:
        queryset = Note.objects.filter(
            id__in=notes_id.split(',')
        )
    serializer = NoteSerializer(
        queryset,
        partial=True,
        many=True
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_docfiles(request):
    queryset = Document.objects.none()
    documents_id = request.query_params.get('ids')
    if documents_id is not None:
        queryset = Document.objects.filter(
            id__in=documents_id.split(',')
        )
    serializer = DocfileSerializer(
        queryset,
        partial=True,
        many=True
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_file(request, pk):
    document = get_object_or_404(
        Document,
        id=pk
    )
    send_file = open(document.docfile,'rb')
    response = FileResponse(send_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{document.title}";'
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_preview(request, pk):
    document = get_object_or_404(
        Document,
        id=pk
    )
    files = get_images_from_pdf(document)
    return Response(files, status=status.HTTP_200_OK)


class ProjectViewSet(ModelViewSet):
    pagination_class = LimitOffsetPagination
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    queryset = Project.objects.all()


class LoginView(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(
            User, 
            email=serializer.validated_data.get('email'),
        )
        if not check_password(
            serializer.validated_data.get('password'), user.password
        ):
            return Response(
                {'errors': 'Неверный пароль.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        login(request, user)
        return super(LoginView, self).post(request, format=None)
