from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import status
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.http import FileResponse
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login
from django.db import IntegrityError
from django.contrib.auth.tokens import PasswordResetTokenGenerator

from six import text_type

from knox.views import LoginView as KnoxLoginView

from .serializers import (
    ChapterSerializer, ProjectSerializer, NoteSerializer, 
    DocfileSerializer, LoginSerializer, RegistrationSerializer)
from docs.models import Chapter, Project, Note, Document
from .services import get_images_from_pdf
from users.models import User
from .permissions import (
    AdminOwnerEditorOrViewerReadOnly, AllSendNotes
)

from .pagination import CustomPageNumberPagination

from logger import logger

logger = logger.get_logger(__name__)

class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            text_type(user.username) + text_type(timestamp)
        )


account_activation_token = AccountActivationTokenGenerator()


@api_view(['POST'])
@permission_classes([AllowAny])
def registration(request):
    serializer = RegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    activation_code = ''
    try:
        user, created = User.objects.get_or_create(
            username=request.data['username'],
            email=request.data['email'],
            first_name=request.data['first_name'],
            last_name=request.data['last_name'],
        )
        if not created:
            raise ValidationError(
            'Пользователь с такими данными уже существует.'
            )
        activation_code = account_activation_token.make_token(user)
        user.code = activation_code
        user.set_password(request.data['password'])
        user.save()
    except IntegrityError:
        raise ValidationError(
            'Некорректные username или email.'
        )
    message = f'http://localhost:3000/activate/?activation_code={activation_code}'
    with open('1.txt', 'w') as f:
        f.write(message)
    # send_mail(
    #     'Код подтверждения', message,
    #     settings.EMAIL_HOST_USER,
    #     [request.data.get('email')],
    #     fail_silently=False
    # )
    return Response(request.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def activate(request):
    activation_code = request.data['active_code']
    user = get_object_or_404(
        User, code=activation_code
    )
    user.code = ''
    user.is_active = True
    user.save()
    return Response(request.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllSendNotes])
def send_note(request):
    note, created = Note.objects.get_or_create(
        title=request.data.get('title'),
        text=request.data.get('text'),
        author=request.user,
        note_type=str(request.user.groups.first().id)
    )
    if 'project_id' in request.data:
        try:
            project = Project.objects.get(
                pk=request.data.get('project_id')
            )
            project.notes.add(note)
        except:
            return Response(
                {'detail': 'Проект не найден.'},
                status=status.HTTP_404_NOT_FOUND
            )
    if 'chapter_id' in request.data:
        try:
            chapter = Chapter.objects.get(
                pk=request.data.get('chapter_id')
            )
            chapter.notes.add(note)
        except:
            return Response(
                {'detail': 'Раздел не найден.'},
                status=status.HTTP_404_NOT_FOUND
            )
    if 'docfile_id' in request.data:
        try:
            docfile = Document.objects.get(
                pk=request.data.get('docfile_id')
            )
            docfile.notes.add(note)
        except:
            return Response(
                {'detail': 'Документ не найден.'},
                status=status.HTTP_404_NOT_FOUND
            )
    return Response(request.data, status=status.HTTP_201_CREATED)


class ProjectViewSet(ReadOnlyModelViewSet):
    pagination_class = CustomPageNumberPagination
    serializer_class = ProjectSerializer
    # permission_classes = [IsAuthenticated, AdminOwnerEditorOrViewerReadOnly]
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.request.user.projects_viewer.all()
        return Project.objects.all()

    def list(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        serializer = ProjectSerializer(
            queryset if page is None else page,
            partial=True,
            many=True
        )
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_chapters',
        # permission_classes=[AdminOwnerEditorOrViewerReadOnly],
        permission_classes=[AllowAny],
    )
    def get_chapters(self, request, pk):
        obj = get_object_or_404(
            self.get_queryset(), pk=pk
        )
        self.check_object_permissions(self.request, obj)
        queryset = obj.chapters.all()
        page = self.paginate_queryset(queryset)
        serializer = ChapterSerializer(
            queryset if page is None else page,
            partial=True,
            many=True
        )
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_notes',
        # permission_classes=[AdminOwnerEditorOrViewerReadOnly],
        permission_classes=[AllowAny],
    )
    def get_notes(self, request, pk):
        obj = get_object_or_404(
            self.get_queryset(), pk=pk
        )
        self.check_object_permissions(self.request, obj)
        chapter_id = request.GET.get('chapter', None)
        docfile_id = request.GET.get('docfile', None)
        if chapter_id:
            queryset = get_object_or_404(
                Chapter, id=chapter_id
            ).notes.all()
        elif docfile_id:
            queryset = get_object_or_404(
                Document, id=docfile_id
            ).notes.all()
        else:
            queryset = obj.notes.all()
        serializer = NoteSerializer(
            queryset,
            partial=True,
            many=True
        )
        data_count = queryset.count()
        response = {
            'total_count': data_count,
            'results':{
                'items': serializer.data,
                'count': data_count
            }
        }
        return Response(response, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_docfiles',
        # permission_classes=[AdminOwnerEditorOrViewerReadOnly],
        permission_classes=[AllowAny],
    )
    def get_docfiles(self, request, pk):
        obj = get_object_or_404(
            self.get_queryset(), pk=pk
        )
        self.check_object_permissions(self.request, obj)
        chapter = request.GET.get('chapter', None)
        queryset = obj.documents.filter(chapter__id=chapter)
        serializer = DocfileSerializer(
            queryset,
            partial=True,
            many=True
        )
        data_count = queryset.count()
        response = {
            'total_count': data_count,
            'results':{
                'items': serializer.data,
                'count': data_count
            }
            
        }
        return Response(response, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_preview',
        # permission_classes=[AdminOwnerEditorOrViewerReadOnly],
        permission_classes=[AllowAny],
    )
    def get_preview(self, request, pk):
        obj = get_object_or_404(
            self.get_queryset(), pk=pk
        )
        self.check_object_permissions(self.request, obj)
        document = get_object_or_404(
            obj.documents.all(),
            id=request.GET.get('docfile', None)
        )
        files = get_images_from_pdf(document)
        data_count = len(files)
        response = {
            'total_count': data_count,
            'results':{
                'items': files,
                'count': data_count
            }
            
        }
        return Response(response, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_file',
        # permission_classes=[AdminOwnerEditorOrViewerReadOnly],
        permission_classes=[AllowAny],
    )
    def get_file(self, request, pk):
        obj = get_object_or_404(
            self.get_queryset(), pk=pk
        )
        self.check_object_permissions(self.request, obj)
        document = get_object_or_404(
            obj.documents.all(),
            id=request.GET.get('docfile', None)
        )
        try:
            send_file = open(document.docfile,'rb')
            response = FileResponse(send_file, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{document.title}";'
            return response
        except FileNotFoundError:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(
        detail=True,
        methods=['DELETE'],
        url_name='delete_note',
        # permission_classes=[AdminOwnerEditorOrViewerReadOnly],
        permission_classes=[AllowAny],
    )
    def delete_note(self, request, pk):
        logger.debug('delete note')
        project = get_object_or_404(
            Project,
            id=pk
        )
        self.check_object_permissions(request, project)
        note = get_object_or_404(
            Note,
            id=request.data.get('note_id')
        )
        project.notes.remove(note)
        if note.projects.count() == 0:
            note.delete()
        return Response(request.data, status=status.HTTP_204_NO_CONTENT)


class LoginView(KnoxLoginView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(
            email=serializer.validated_data.get('email')
        )
        try:
            user = user.first()
        except:
            return Response(
                {'detail': 'Пользователь не найден.'},
                status=status.HTTP_404_NOT_FOUND
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
