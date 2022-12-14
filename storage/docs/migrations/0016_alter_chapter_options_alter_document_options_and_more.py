# Generated by Django 4.0.7 on 2022-09-01 11:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('docs', '0015_alter_document_project'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='chapter',
            options={'ordering': ['title'], 'verbose_name': 'Раздел', 'verbose_name_plural': 'Разделы'},
        ),
        migrations.AlterModelOptions(
            name='document',
            options={'ordering': ['title'], 'verbose_name': 'Документ', 'verbose_name_plural': 'Документы'},
        ),
        migrations.AlterModelOptions(
            name='note',
            options={'ordering': ['title'], 'verbose_name': 'Заметка', 'verbose_name_plural': 'Заметки'},
        ),
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ['title'], 'verbose_name': 'Проект', 'verbose_name_plural': 'Проекты'},
        ),
    ]
