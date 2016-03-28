# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-28 18:33
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facts', '0003_auto_20160328_1152'),
    ]

    operations = [
        migrations.CreateModel(
            name='Data',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('values', django.contrib.postgres.fields.jsonb.JSONField()),
                ('url', models.URLField(blank=True, max_length=500)),
                ('label', models.CharField(blank=True, max_length=100)),
            ],
        ),
    ]
