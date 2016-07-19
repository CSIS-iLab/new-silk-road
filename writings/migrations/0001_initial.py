# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-07-19 20:14
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import filer.fields.image
import markymark.fields
import taggit.managers


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('filer', '0006_auto_20160623_1627'),
        ('taggit', '0002_auto_20150616_2121'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=40)),
                ('slug', models.SlugField(allow_unicode=True, unique=True)),
            ],
            options={
                'verbose_name': 'category',
                'verbose_name_plural': 'categories',
            },
        ),
        migrations.CreateModel(
            name='Entry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('published', models.BooleanField(default=False)),
                ('title', models.CharField(max_length=100)),
                ('slug', models.SlugField(allow_unicode=True, max_length=110, unique=True)),
                ('content', markymark.fields.MarkdownField(blank=True)),
                ('content_rendered', models.TextField(blank=True, editable=False)),
                ('description', markymark.fields.MarkdownField(blank=True, help_text='Short text to be used where post might be promoted/referenced')),
                ('description_rendered', models.TextField(blank=True, editable=False)),
                ('share_text', models.CharField(blank=True, max_length=140)),
                ('published_at', models.DateTimeField(blank=True, null=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='writings.Category')),
                ('featured_image', filer.fields.image.FilerImageField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='filer.Image')),
                ('tags', taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags')),
            ],
            options={
                'verbose_name': 'entry',
                'verbose_name_plural': 'entries',
                'get_latest_by': 'published_at',
                'ordering': ('-published_at', '-created_at'),
            },
        ),
    ]
