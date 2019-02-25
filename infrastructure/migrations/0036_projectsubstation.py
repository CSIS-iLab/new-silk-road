# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2019-02-07 22:02
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('infrastructure', '0035_project_linear_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectSubstation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, help_text='Substation Name (Location)', max_length=1024)),
                ('capacity', models.BigIntegerField(blank=True, help_text='Substation Capacity (MW)', null=True)),
                ('voltage', models.BigIntegerField(blank=True, help_text='Substation Voltage (kV)', null=True)),
                ('project', models.ForeignKey(help_text='Substation Project', on_delete=django.db.models.deletion.CASCADE, to='infrastructure.Project')),
            ],
        ),
    ]