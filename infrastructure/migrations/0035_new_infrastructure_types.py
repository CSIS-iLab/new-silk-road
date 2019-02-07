# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-02-07 17:03
from __future__ import unicode_literals

from django.db import migrations

NEW_TYPES = ['Transmission', 'Pipeline']


def load_new_infrastructure_types(apps, schema_editor):
    InfrastructureType = apps.get_model("infrastructure", "InfrastructureType")
    for add_type in NEW_TYPES:
        InfrastructureType.objects.create(name=add_type, slug=add_type.lower())


def unload_new_infrastructure_types(apps, schema_editor):
    """NOTE: This will fail if there are any foreign keys depending on these infrastructure types,
    which (I believe) is as it should be.
    """
    for remove_type in NEW_TYPES:
        InfrastructureType.objects.get(name=remove_type).delete()


class Migration(migrations.Migration):

    dependencies = [('infrastructure', '0034_powerplant_sources')]

    operations = [
        migrations.RunPython(
            load_new_infrastructure_types, reverse_code=unload_new_infrastructure_types
        )
    ]
