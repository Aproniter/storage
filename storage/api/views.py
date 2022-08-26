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
    DocfileSerializer, LoginSerializer, RegistrationSerializer)
from rest_framework.permissions import AllowAny, IsAuthenticated
from docs.models import Chapter, Project, Note, Document
from .services import get_images_from_pdf
from users.models import User
from .permissions import (
    AdminOwnerEditorOrViewerReadOnly
)


@api_view(['POST'])
@permission_classes([AllowAny])
def registration(request):
    serializer = RegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        user, created = User.objects.get_or_create(
            username=request.data['username'],
            email=request.data['email'],
            first_name=request.data['first_name'],
            last_name=request.data['last_name'],
        )
        user.set_password(request.data['password'])
        user.save()
    except IntegrityError:
        raise ValidationError(
            'Некорректные username или email.'
        )
    message = account_activation_token.make_token(user)
    with open('1.txt', 'w') as f:
        f.write(message)
    send_mail(
        'Код подтверждения', message,
        settings.EMAIL_HOST_USER,
        [request.data.get('email')],
        fail_silently=False
    )
    return Response(request.data, status=status.HTTP_200_OK)


class ProjectViewSet(ModelViewSet):
    pagination_class = LimitOffsetPagination
    serializer_class = ProjectSerializer
    permission_classes = [AdminOwnerEditorOrViewerReadOnly]
    queryset = Project.objects.all()

    def get_queryset(self):
        return self.request.user.projects_viewer.all()

    @action(
        detail=True,
        methods=['get'],
        url_name='get_chapters',
        permission_classes=[AdminOwnerEditorOrViewerReadOnly]
    )
    def get_chapters(self, request, pk):
        obj = get_object_or_404(
            self.get_queryset(), pk=pk
        )
        self.check_object_permissions(self.request, obj)
        serializer = ChapterSerializer(
            obj.chapters,
            partial=True,
            many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_notes',
        permission_classes=[AdminOwnerEditorOrViewerReadOnly]
    )
    def get_notes(self, request, pk):
        obj = get_object_or_404(
            self.get_queryset(), pk=pk
        )
        self.check_object_permissions(self.request, obj)
        chapter_id = request.GET.get('chapter', None)
        docfile_id = request.GET.get('docfile', None)
        params = chapter_id or docfile_id
        if chapter_id:
            notes_queryset = get_object_or_404(
                Chapter, id=chapter_id
            ).notes.all()
        elif docfile_id:
            notes_queryset = get_object_or_404(
                Document, id=docfile_id
            ).notes.all()
        else:
            notes_queryset = obj.notes.all()
        serializer = NoteSerializer(
            notes_queryset,
            partial=True,
            many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_docfiles',
        permission_classes=[AdminOwnerEditorOrViewerReadOnly]
    )
    def get_docfiles(self, request, pk):
        obj = get_object_or_404(
            self.get_queryset(), pk=pk
        )
        self.check_object_permissions(self.request, obj)
        chapter = request.GET.get('chapter', None)
        serializer = DocfileSerializer(
            obj.documents.filter(chapter__id=chapter),
            partial=True,
            many=True
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_preview',
        permission_classes=[AdminOwnerEditorOrViewerReadOnly]
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
        return Response(files, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=['get'],
        url_name='get_file',
        permission_classes=[AdminOwnerEditorOrViewerReadOnly]
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
        send_file = open(document.docfile,'rb')
        response = FileResponse(send_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{document.title}";'
        return response


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
