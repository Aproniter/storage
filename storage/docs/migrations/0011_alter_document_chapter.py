# Generated by Django 4.1 on 2022-08-17 13:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('docs', '0010_note_author_note_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='chapter',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='documents', to='docs.chapter', verbose_name='Раздел'),
        ),
    ]
