# Generated by Django 4.0.7 on 2022-08-24 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('docs', '0013_alter_preview_call_rating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='book',
            field=models.FloatField(blank=True, null=True, verbose_name='Том'),
        ),
    ]
