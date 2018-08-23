# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2018-08-17 12:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('infrastructure', '0022_auto_20180418_1006'),
    ]

    operations = [
        migrations.CreateModel(
            name='CuratedProject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=256)),
                ('projects', models.ManyToManyField(to='infrastructure.Project')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
