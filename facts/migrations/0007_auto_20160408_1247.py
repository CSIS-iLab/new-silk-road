# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-08 16:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facts', '0006_auto_20160330_1809'),
    ]

    operations = [
        migrations.AlterField(
            model_name='companystructure',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
        migrations.AlterField(
            model_name='companytype',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
        migrations.AlterField(
            model_name='event',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
        migrations.AlterField(
            model_name='eventtype',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
        migrations.AlterField(
            model_name='financingtype',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
        migrations.AlterField(
            model_name='multilateraltype',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
        migrations.AlterField(
            model_name='ngotype',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
        migrations.AlterField(
            model_name='organization',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
        migrations.AlterField(
            model_name='politicaltype',
            name='slug',
            field=models.SlugField(allow_unicode=True, max_length=110),
        ),
    ]