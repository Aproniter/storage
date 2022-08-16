from django.shortcuts import render

from .models import Project, Note, Document


def index(request):
    projects = Project.objects.all()
    context = {'projects': projects}
    return render(request, 'docs/index.html', context)