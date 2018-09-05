# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-08-28 19:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('infrastructure', '0023_auto_20180723_1056'),
    ]

    operations = [
        migrations.CreateModel(
            name='CuratedProjectCollection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('published', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=256)),
                ('projects', models.ManyToManyField(to='infrastructure.Project')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]