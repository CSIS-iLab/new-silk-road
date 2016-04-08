# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-08 13:32
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0006_auto_20160407_1313'),
    ]

    operations = [
        migrations.CreateModel(
            name='GeometryStore',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.UUIDField(default=uuid.uuid4, editable=False)),
                ('attributes', django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=dict)),
                ('lines', models.ManyToManyField(to='locations.LineStringGeometry')),
                ('points', models.ManyToManyField(to='locations.PointGeometry')),
                ('polygons', models.ManyToManyField(to='locations.PolygonGeometry')),
            ],
        ),
    ]
