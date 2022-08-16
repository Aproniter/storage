# Generated by Django 4.1 on 2022-08-15 12:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('docs', '0007_alter_project_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chapter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=1000, verbose_name='Название')),
            ],
            options={
                'verbose_name': 'Раздел',
                'verbose_name_plural': 'Разделы',
            },
        ),
        migrations.AddField(
            model_name='project',
            name='chapters',
            field=models.ManyToManyField(blank=True, related_name='projects', to='docs.chapter', verbose_name='Разделы'),
        ),
        migrations.AlterField(
            model_name='document',
            name='chapter',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='docs.chapter', verbose_name='Раздел'),
        ),
    ]
