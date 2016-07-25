# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-07-25 16:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sources', '0004_auto_20160425_1251'),
        ('infrastructure', '0015_initiative_related_initiatives'),
    ]

    operations = [
        migrations.AddField(
            model_name='initiative',
            name='documents',
            field=models.ManyToManyField(blank=True, to='sources.Document'),
        ),
    ]
