# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-08 16:49
from __future__ import unicode_literals

from django.db import migrations, models
from django.core import management


def load_countries_from_fixture(apps, schema_editor):
    management.call_command('loaddata', 'countries.json', app='locations', verbosity=0)


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0007_geometrystore'),
    ]

    operations = [
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Display name')),
                ('numeric', models.PositiveSmallIntegerField(help_text='ISO 3166 numeric', unique=True)),
                ('alpha_3', models.CharField(help_text='ISO 3166 alpha-3 name', max_length=3, unique=True)),
            ],
            options={'ordering': ('name',), 'verbose_name_plural': 'countries'},
        ),
        migrations.RunPython(load_countries_from_fixture, migrations.RunPython.noop),
    ]
