# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-20 15:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('infrastructure', '0012_project_alternate_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='geo',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='locations.GeometryStore'),
        ),
    ]