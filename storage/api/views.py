from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import LimitOffsetPagination
from django.http import FileResponse
from django.conf import settings

from .serializers import ChapterSerializer, ProjectSerializer, NoteSerializer
from rest_framework.permissions import AllowAny
from docs.models import Chapter, Project, Note, Document
from .services import get_images_from_pdf


@api_view(['GET'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
def get_file(request, project_pk, chapter_pk):
    document = get_object_or_404(
        Document,
        project__id=project_pk,
        chapter__id=chapter_pk
    )
    send_file = open(document.docfile,'rb')
    response = FileResponse(send_file, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{document.title}";'
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def get_preview(request, project_pk, chapter_pk):
    document = get_object_or_404(
        Document,
        project__id=project_pk,
        chapter__id=chapter_pk
    )
    files = get_images_from_pdf(document)
    return Response({'files': files}, status=status.HTTP_200_OK)


class ProjectViewSet(ModelViewSet):
    pagination_class = LimitOffsetPagination
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    queryset = Project.objects.all()
