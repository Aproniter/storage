from rest_framework import serializers

from docs.models import Chapter, Project, Note
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


class ChapterSerializer(serializers.ModelSerializer):

    class Meta:
        fields = '__all__'
        model = Chapter



class ProjectSerializer(serializers.ModelSerializer):    
    owner = UserSerializer(many=False)    

    class Meta:
        exclude = ('chapters',)
        model = Project