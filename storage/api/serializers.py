from django.shortcuts import get_object_or_404
from rest_framework import serializers

from docs.models import Chapter, Project, Note, Document
from users.models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        fields = (
            'id', 'email', 'username',
            'first_name', 'last_name',
        )
        model = User


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
