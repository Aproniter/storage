import os
import fitz

from django.conf import settings

from docs.models import Preview


def get_list_files(dir_images):
    files = [{
        'id': int(value.split('/')[-1].replace('.jpg','')), 
        'path': f'{dir_images.replace(settings.MEDIA_ROOT + "/", "")}/{value}'
    } for value in os.listdir(dir_images)]
    return files


def create_image(dir_images, page):
    pix = page.get_pixmap(dpi=50)
    pix.save(f'{dir_images}/{page.number}.jpg')


def get_images_from_pdf(document):
    if document.title.split('.')[-1] != 'pdf':
        return []
    if document.preview_folder:
        document.preview_folder.call_rating += 1
        document.preview_folder.save()
        list_files = os.listdir(document.preview_folder.path)
        return get_list_files(document.preview_folder.path)
    dir_images = os.path.join(
        settings.MEDIA_ROOT,
        document.project.title,
        document.chapter.title,
        document.title.replace('.pdf', '')
    )
    os.makedirs(dir_images, exist_ok=True)
    
    doc = fitz.open(document.docfile)

    for page in doc:
        create_image(dir_images, page)

    preview, status = Preview.objects.get_or_create(
        path=dir_images
    )
    document.preview_folder = preview
    document.save()

    return get_list_files(dir_images)
