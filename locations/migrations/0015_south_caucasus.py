# -*- coding: utf-8 -*-
# Generated by Django 1.11.12 on 2019-01-30 17:33
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0014_auto_20180412_1618'),
        ('infrastructure', '0033_merge_20190129_1135'),
    ]

    operations = [
        migrations.RunSQL("UPDATE infrastructure_project_regions set region_id=8 WHERE region_id=4;"),
        migrations.RunSQL("UPDATE locations_region set name='Russia, Central Asia and the South Caucasus' where id=8;"),
        migrations.RunSQL("DELETE from locations_region where id=4;")
    ]
