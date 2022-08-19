import logging
import shutil
 
from django.urls import reverse
from django.contrib.auth import get_user_model

from storage.celery import app
import docs.models as models



@app.task
def test():
    previews = models.Preview.objects.all()
    for preview in previews:
        preview.call_rating -= 1
        preview.save()
    previews = previews.filter(
        call_rating__lte=0
    )
    for preview in previews:
        shutil.rmtree(preview.path)
    previews.delete()