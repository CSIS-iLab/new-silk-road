# -*- coding: utf-8 -*-
# Generated by Django 1.9.3 on 2016-03-22 20:51
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import mptt.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('locations', '0002_geocollection'),
        ('sources', '0001_initial'),
        ('infrastructure', '0001_initial'),
        ('facts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='initiatives',
            field=models.ManyToManyField(blank=True, to='infrastructure.Initiative'),
        ),
        migrations.AddField(
            model_name='organization',
            name='leaders',
            field=models.ManyToManyField(blank=True, related_name='organizations_led', to='facts.Person'),
        ),
        migrations.AddField(
            model_name='organization',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='facts.Organization', verbose_name='parent organization'),
        ),
        migrations.AddField(
            model_name='organization',
            name='related_events',
            field=models.ManyToManyField(blank=True, to='facts.Event'),
        ),
        migrations.AddField(
            model_name='organization',
            name='related_organizations',
            field=models.ManyToManyField(blank=True, related_name='_organization_related_organizations_+', to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='ngotype',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='facts.NGOType'),
        ),
        migrations.AddField(
            model_name='ngodetails',
            name='geographic_scope',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='locations.Region'),
        ),
        migrations.AddField(
            model_name='ngodetails',
            name='members',
            field=models.ManyToManyField(related_name='ngo_memberships', to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='ngodetails',
            name='org_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='facts.NGOType', verbose_name='type'),
        ),
        migrations.AddField(
            model_name='ngodetails',
            name='organization',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='multilateraltype',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='facts.MultilateralType'),
        ),
        migrations.AddField(
            model_name='multilateraldetails',
            name='members',
            field=models.ManyToManyField(related_name='multilateral_memberships', to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='multilateraldetails',
            name='org_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='facts.MultilateralType', verbose_name='type'),
        ),
        migrations.AddField(
            model_name='multilateraldetails',
            name='organization',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='militarydetails',
            name='organization',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='governmentdetails',
            name='organization',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='financingtype',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='facts.FinancingType'),
        ),
        migrations.AddField(
            model_name='financingorganizationdetails',
            name='org_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='facts.FinancingType', verbose_name='type'),
        ),
        migrations.AddField(
            model_name='financingorganizationdetails',
            name='organization',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='financingorganizationdetails',
            name='shareholder_organizations',
            field=models.ManyToManyField(related_name='holds_shares_of', through='facts.OrganizationShareholder', to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='financingorganizationdetails',
            name='shareholder_people',
            field=models.ManyToManyField(related_name='holds_shares_of', through='facts.PersonShareholder', to='facts.Person'),
        ),
        migrations.AddField(
            model_name='eventtype',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='facts.EventType'),
        ),
        migrations.AddField(
            model_name='event',
            name='documents',
            field=models.ManyToManyField(blank=True, to='sources.Document'),
        ),
        migrations.AddField(
            model_name='event',
            name='event_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='facts.EventType', verbose_name='type'),
        ),
        migrations.AddField(
            model_name='event',
            name='places',
            field=models.ManyToManyField(blank=True, to='locations.Place'),
        ),
        migrations.AddField(
            model_name='companytype',
            name='parent',
            field=mptt.fields.TreeForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='facts.CompanyType'),
        ),
        migrations.AddField(
            model_name='companydetails',
            name='org_type',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='facts.CompanyType', verbose_name='type'),
        ),
        migrations.AddField(
            model_name='companydetails',
            name='organization',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='facts.Organization'),
        ),
        migrations.AddField(
            model_name='companydetails',
            name='structure',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='facts.CompanyStructure'),
        ),
    ]
