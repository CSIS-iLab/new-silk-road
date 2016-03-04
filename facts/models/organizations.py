from django.db import models
from django.contrib.postgres.fields import ArrayField
from publish.models import Publishable
from markymark.fields import MarkdownField
from mptt.models import MPTTModel, TreeForeignKey
from locations.models import COUNTRY_CHOICES


class OrganizationTypeBase(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        abstract = True


class CompanyType(MPTTModel, OrganizationTypeBase):
    parent = TreeForeignKey('self', null=True, blank=True,
                            related_name='children', db_index=True)


class FinancingType(MPTTModel, OrganizationTypeBase):
    parent = TreeForeignKey('self', null=True, blank=True,
                            related_name='children', db_index=True)


class MultilateralType(MPTTModel, OrganizationTypeBase):
    parent = TreeForeignKey('self', null=True, blank=True,
                            related_name='children', db_index=True)


class NGOType(MPTTModel, OrganizationTypeBase):
    parent = TreeForeignKey('self', null=True, blank=True,
                            related_name='children', db_index=True)

    class Meta:
        verbose_name = "NGO type"


class PoliticalType(MPTTModel, OrganizationTypeBase):
    parent = TreeForeignKey('self', null=True, blank=True,
                            related_name='children', db_index=True)


class Organization(MPTTModel, Publishable):
    """Abstract base model for organizations"""
    name = models.CharField(max_length=100)
    leaders = models.ManyToManyField('Person', blank=True,
                                     related_name='organizations_led')
    initiatives = models.ManyToManyField('Initiative', blank=True)
    headquarters = models.ForeignKey('locations.Place', models.SET_NULL, blank=True, null=True)
    notes = MarkdownField(blank=True)
    related_events = models.ManyToManyField('Event', blank=True)
    founding_date = models.DateField(blank=True, null=True)
    dissolution_date = models.DateField(blank=True, null=True)
    parent = TreeForeignKey('self', null=True, blank=True,
                            verbose_name='parent organization',
                            related_name='children', db_index=True)
    staff_size = models.PositiveSmallIntegerField("Staff/Personel count",
                                                  blank=True, null=True)
    mission = MarkdownField("Mandate/Mission Statement", blank=True)

    class MPTTMeta:
            order_insertion_by = ['name']

    def __str__(self):
        return self.name


class CompanyStructure(models.Model):
    """Describes structure of a company"""
    name = models.CharField("Structure", max_length=100)


class Company(Organization):
    """Describes an company"""

    SECTOR_PRIMARY = 1
    SECTOR_SECONDARY = 2
    SECTOR_TERTIARY = 3

    SECTOR_CHOICES = (
        (SECTOR_PRIMARY, "Primary"),
        (SECTOR_SECONDARY, "Secondary"),
        (SECTOR_TERTIARY, "Tertiary"),
    )

    structure = models.ForeignKey('CompanyStructure', models.SET_NULL, blank=True, null=True)
    sector = models.PositiveSmallIntegerField(blank=True, null=True, choices=SECTOR_CHOICES)
    org_type = models.ForeignKey('CompanyType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')
    related_organizations = models.ManyToManyField('Organization',
                                                   related_name='related_companies',
                                                   through='CompanyRelation')

    class Meta:
        verbose_name_plural = "companies"


class FinancingOrganization(Organization):
    """Describes a financing organization"""
    # Financials
    approved_capital = models.DecimalField(blank=True, null=True,
                                           max_digits=17, decimal_places=2)
    credit_rating = models.CharField(blank=True, max_length=100)
    shareholder_organizations = models.ManyToManyField('Organization',
                                                       related_name='holds_shares_of',
                                                       through='OrganizationShareholder')
    shareholder_people = models.ManyToManyField('Person',
                                                related_name='holds_shares_of',
                                                through='PersonShareholder')
    scope_of_operations = models.CharField(blank=True, max_length=100)
    procurement = models.CharField(blank=True, max_length=100)
    org_type = models.ForeignKey('FinancingType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')
    related_organizations = models.ManyToManyField('Organization',
                                                   related_name='related_financers',
                                                   through='FinancingRelation')


class Government(Organization):
    """Describes a government"""
    country = models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True)
    related_organizations = models.ManyToManyField('Organization',
                                                   related_name='related_governments',
                                                   through='GovernmentRelation')


class Military(Organization):
    """Describes a military variable"""
    country = models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True)
    ruling_party = models.BooleanField(default=True)
    budget = models.DecimalField(blank=True, null=True,
                                 max_digits=17, decimal_places=2)
    related_organizations = models.ManyToManyField('Organization',
                                                   related_name='related_militaries',
                                                   through='MilitaryRelation')

    class Meta:
        verbose_name_plural = "militaries"


class Multilateral(Organization):
    """Describes a multilateral organization"""
    members = models.ManyToManyField('Organization',
                                     related_name='multilateral_memberships',
                                     through='MultilateralMemberRelation')
    org_type = models.ForeignKey('MultilateralType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')
    related_organizations = models.ManyToManyField('Organization',
                                                   related_name='related_multilaterals',
                                                   through='MultilateralRelation')


class NGO(Organization):
    """Describes an NGO (Non-governmental Organization)"""
    members = models.ManyToManyField('Organization',
                                     related_name='ngo_memberships',
                                     through='NGOMemberRelation')
    # geographic_scope = ???
    endowment = models.DecimalField(blank=True, null=True,
                                    max_digits=17, decimal_places=2)
    org_type = models.ForeignKey('NGOType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')
    related_organizations = models.ManyToManyField('Organization',
                                                   related_name='related_ngos',
                                                   through='NGORelation')

    class Meta:
        verbose_name = "NGO"


class Political(Organization):
    """Describes a Political Entity"""
    countries = ArrayField(
        models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES),
        blank=True, null=True, default=list)
    org_type = models.ForeignKey('PoliticalType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')
    ruling_party = models.BooleanField(default=True)
    related_organizations = models.ManyToManyField('Organization',
                                                   related_name='related_politicalentities',
                                                   through='PoliticalRelation')

    class Meta:
        verbose_name = "political entity"
        verbose_name_plural = "political entities"


# Shareholders

class ShareholderBase(models.Model):
    right = models.ForeignKey('FinancingOrganization',
                              verbose_name="to", on_delete=models.CASCADE,
                              related_name='+')
    value = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        abstract = True


class OrganizationShareholder(ShareholderBase):
    left = models.ForeignKey('Organization',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')

    def __str__(self):
        return "{}: {}%".format(self.left, self.value)


class PersonShareholder(ShareholderBase):
    left = models.ForeignKey('Person',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')

    def __str__(self):
        return "{}: {}%".format(self.left, self.value)


#  Relations

class OrganizationRelationBase(models.Model):
    # You must define the left = part of the relation
    right = models.ForeignKey('Organization',
                              verbose_name="to", on_delete=models.CASCADE,
                              related_name='+')

    class Meta:
        abstract = True


class CompanyRelation(OrganizationRelationBase):
    left = models.ForeignKey('Company',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')


class FinancingRelation(OrganizationRelationBase):
    left = models.ForeignKey('FinancingOrganization',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')


class GovernmentRelation(OrganizationRelationBase):
    left = models.ForeignKey('Government',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')


class MilitaryRelation(OrganizationRelationBase):
    left = models.ForeignKey('Military',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')


class MultilateralRelation(OrganizationRelationBase):
    left = models.ForeignKey('Multilateral',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')


class NGORelation(OrganizationRelationBase):
    left = models.ForeignKey('NGO',
                             on_delete=models.CASCADE, related_name='+')


class PoliticalRelation(OrganizationRelationBase):
    left = models.ForeignKey('Political',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')


class NGOMemberRelation(OrganizationRelationBase):
    left = models.ForeignKey('NGO',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')


class MultilateralMemberRelation(OrganizationRelationBase):
    left = models.ForeignKey('Multilateral',
                             verbose_name="from", on_delete=models.CASCADE,
                             related_name='+')
