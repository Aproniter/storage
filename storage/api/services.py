import os
import shutil
import fitz


def get_list_files(dir_images):
    files = [{
        'id': value.split('/')[-1].replace('.jpg',''), 
        'data': f'{dir_images}/{value}'
    } for value in os.listdir(dir_images)]
    return files


def get_images_from_pdf(filepath, filename):
    doc = fitz.open(filepath)
    dir_images = 'images/' + filename.replace('.pdf', '')
    try:
        list_files = os.listdir(dir_images)
        return get_list_files(dir_images)
    except FileNotFoundError:
        os.mkdir(dir_images)
    for page in doc:
        pix = page.get_pixmap(dpi=50)
        pix.save(f'{dir_images}/{page.number}.jpg')
    return get_list_files(dir_images)


def delete_preview_folder(foldername):
    shutil.rmtree(f'images/{foldername}')