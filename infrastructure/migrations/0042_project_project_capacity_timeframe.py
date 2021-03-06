# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-02-21 16:52
from __future__ import unicode_literals
import sys

from django.db import migrations, models
from infrastructure.models import ProjectTimeFrameUnits


def update_powerplant_project_capacity_timeframe_unit(apps, schema_editor):
    if 'test' in sys.argv:
        return
    Project = apps.get_model('infrastructure', "Project")
    projects = Project.objects.filter(
        infrastructure_type__name='Powerplant'
    ).filter(
        project_capacity__isnull=False
    )

    projects.update(project_capacity_timeframe=ProjectTimeFrameUnits.PER_YEAR)


def reverse_migration(apps, schema_editor):
    if 'test' in sys.argv:
        return
    Project = apps.get_model('infrastructure', "Project")
    projects = Project.objects.filter(
        infrastructure_type__name='Powerplant'
    ).filter(
        project_capacity__isnull=False
    )

    projects.update(project_capacity_timeframe=None)


class Migration(migrations.Migration):

    dependencies = [
        ('infrastructure', '0041_auto_20190225_1047'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='project_capacity_timeframe',
            field=models.CharField(blank=True, choices=[('per-hour', 'per hour'), ('per-day', 'per day'), ('per-month', 'per month'), ('per-year', 'per year')], max_length=10),
        ),
        migrations.RunPython(
            update_powerplant_project_capacity_timeframe_unit,
            reverse_code=reverse_migration
        )
    ]
