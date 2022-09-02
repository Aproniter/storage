import re

from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from docs.models import Chapter, Project, Note, Document
from users.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        fields = (
            'id', 'email', 'username',
            'first_name', 'last_name', 'role'
        )
        model = User


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField(
        max_length=254
    )
    username = serializers.CharField(
        max_length=150
    )
    password = serializers.CharField(
        max_length=150
    )
    first_name = serializers.CharField(
        max_length=150
    )
    last_name = serializers.CharField(
        max_length=150
    )

    class Meta:
        fields = (
            'email', 'username', 'password', 
            'first_name', 'last_name'
        )

    def validate_username(self, data):
        if re.match(r'^[\\w.@+-]+\\z', data):
            raise serializers.ValidationError(
                'Недопустимые символы в username.'
            )
        if data == 'me':
            raise serializers.ValidationError(
                'Использовать имя "me" в качестве username запрещено.'
            )
        return data


class NoteSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False)

    class Meta:
        fields = '__all__'
        model = Note


class DocfileSerializer(serializers.ModelSerializer):

    class Meta:
        fields = '__all__'
        model = Document


class ChapterSerializer(serializers.ModelSerializer):
    docfiles = serializers.SerializerMethodField()

    class Meta:
        fields = '__all__'
        model = Chapter

    def get_docfiles(self, obj):
        docfiles = Document.objects.filter(
            project__id=obj.projects.first().id,
            chapter__id=obj.id
        )
        return [i.id for i in docfiles]


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(many=False)

    class Meta:
        exclude = ('chapters',)
        model = Project


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(
        max_length=255
    )
    password = serializers.CharField(
        max_length=150,
        trim_whitespace=False,
    )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )

    class Meta:
        fields = ('token', 'email', 'password')
