# -*- coding: utf-8 -*-
# Generated by Django 1.10.7 on 2018-04-12 20:18
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0013_auto_20160914_1729'),
    ]

    operations = [
        migrations.AlterField(
            model_name='place',
            name='location',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='locations.PointGeometry', verbose_name='geographic location'),
        ),
        migrations.AlterField(
            model_name='region',
            name='geography',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='locations.PolygonGeometry'),
        ),
    ]