from django.db import models
from django.db.models import signals
import docs.tasks as tasks

from users.models import User


# def test_celery(sender, instance, signal, *args, **kwargs):
#     tasks.test.delay(instance.pk)


class Project(models.Model):
    STATUS = (
        ('1', 'a'),
        ('2', 'b'),
        ('3', 'c'),
    )
    title = models.CharField(
        verbose_name='Название',
        max_length=1000
    )
    address = models.CharField(
        verbose_name='Адрес',
        max_length=1000
    )
    owner = models.ForeignKey(
        User,
        verbose_name='Главный',
        on_delete=models.SET_NULL,
        related_name='project_owner',
        null=True,
        blank=True,
    )
    editors = models.ManyToManyField(
        User,
        verbose_name='Редакторы',
        related_name='projects_editor',
        blank=True
    )
    viewers = models.ManyToManyField(
        User,
        verbose_name='Наблюдатели',
        related_name='projects_viewer',
        blank=True
    )
    status = models.CharField(
        max_length=255,
        choices=STATUS,
        verbose_name='Статус',
        default='1',
    )
    notes = models.ManyToManyField(
        'Note',
        verbose_name='Особые отметки',
        related_name='projects',
        blank=True
    )
    active = models.BooleanField(
        verbose_name='В работе',
        default=True
    )
    chapters = models.ManyToManyField(
        'Chapter',
        verbose_name='Разделы',
        related_name='projects',
        blank=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания',
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления',
    )

    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['title']

    def __str__(self):
        return self.title


class Chapter(models.Model):
    title = models.CharField(
        verbose_name='Название',
        max_length=1000
    )
    notes = models.ManyToManyField(
        'Note',
        verbose_name='Особые отметки',
        related_name='chapters',
        blank=True
    )

    class Meta:
        verbose_name = 'Раздел'
        verbose_name_plural = 'Разделы'
        ordering = ['title']

    def __str__(self):
        return self.title


class Note(models.Model):
    NOTE_TYPES = (
        ('1', 'От заказчика'),
        ('2', 'От исполнителя'),
        ('3', 'От ...'),
    )
    title = models.CharField(
        verbose_name='Название',
        max_length=1000
    )
    text = models.TextField(
        verbose_name='Текст',
        blank=True
    )
    note_type = models.CharField(
        max_length=255,
        verbose_name='Источник заметки',
        choices=NOTE_TYPES,
        default='1',
    )
    author = models.ForeignKey(
        User,
        verbose_name='Автор',
        on_delete=models.SET_NULL,
        related_name='notes',
        null=True,
        blank=True,
    )
    color = models.CharField(
        verbose_name='Цвет',
        max_length=255
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания',
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления',
    )
    docfile = models.FileField(
        upload_to='notes/%Y/%m/%d',
        verbose_name='Документ',
        blank=True
    )

    class Meta:
        verbose_name = 'Заметка'
        verbose_name_plural = 'Заметки'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Document(models.Model):
    STAGES = (
        ('0', 'Вне стадии'),
        ('1', 'Стадия П'),
        ('2', 'Стадия Р'),
        ('3', 'c'),
    )
    title = models.CharField(
        verbose_name='Название',
        max_length=1000
    )
    project = models.ForeignKey(
        Project,
        verbose_name='Проект',
        related_name='documents',
        on_delete=models.SET_NULL,
        null=True
    )
    stage = models.CharField(
        verbose_name='Стадия',
        max_length=255,
        choices=STAGES,
        default='0',
        null=True
    )
    chapter = models.ForeignKey(
        Chapter,
        verbose_name='Раздел',
        related_name='documents',
        on_delete=models.SET_NULL,
        null=True
    )
    subchapter = models.CharField(
        verbose_name='Подраздел',
        max_length=1000,
        blank=True,
        null=True
    )
    part = models.CharField(
        verbose_name='Часть',
        max_length=1000,
        blank=True,
        null=True
    )
    book = models.FloatField(
        verbose_name='Том',
        blank=True,
        null=True
    )
    code = models.CharField(
        verbose_name='Шифр',
        max_length=1000,
        blank=True,
        null=True
    )
    docfile = models.TextField(
        verbose_name='Путь до файла',
    )
    version = models.IntegerField(
        verbose_name='Версия',
        default=1
    )
    notes = models.ManyToManyField(
        'Note',
        verbose_name='Особые отметки',
        related_name='documents',
        blank=True
    )
    preview_folder = models.ForeignKey(
        'Preview',
        verbose_name='Файлы предпросмотра',
        related_name='document',
        on_delete=models.SET_NULL,
        default=None,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания',
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления',
    )

    class Meta:
        verbose_name = 'Документ'
        verbose_name_plural = 'Документы'
        ordering = ['title']

    def __str__(self):
        return f'{self.project} - {self.title}'


class Preview(models.Model):
    path = models.TextField(
        verbose_name='Путь до папки',
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания',
    )
    call_rating = models.IntegerField(
        verbose_name='Рейтинг обращений',
        default=5,
    )

    class Meta:
        verbose_name = 'Файлы предпросмотра'
        verbose_name_plural = 'Файлы предпросмотра'

    def __str__(self):
        return self.path


# signals.post_save.connect(test_celery, sender=Preview)