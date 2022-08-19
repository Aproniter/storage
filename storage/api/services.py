import os
import fitz

from django.conf import settings

from docs.models import Preview


def get_list_files(dir_images):
    files = [{
        'id': value.split('/')[-1].replace('.jpg',''), 
        'data': f'{dir_images}/{value}'
    } for value in os.listdir(dir_images)]
    return files


def get_images_from_pdf(document):
    if document.preview_folder:
        document.preview_folder.call_rating += 1
        document.preview_folder.save()
        list_files = os.listdir(document.preview_folder.path)
        return get_list_files(document.preview_folder.path)
    dir_images = os.path.join(
        settings.MEDIA_URL,
        os.getenv('IMAGES'),
        document.project.title,
        document.chapter.title,
        document.title.replace('.pdf', '')
    )
    os.makedirs(dir_images)
    preview, status = Preview.objects.get_or_create(
        path=dir_images
    )
    document.preview_folder = preview
    document.save()
    doc = fitz.open(document.docfile)
    for page in doc:
        pix = page.get_pixmap(dpi=50)
        pix.save(f'{dir_images}/{page.number}.jpg')
    return get_list_files(dir_images)
