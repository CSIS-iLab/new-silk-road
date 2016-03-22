from django.db import models
from django.contrib.postgres.fields import ArrayField
from publish.models import Publishable
from markymark.fields import MarkdownField
from mptt.models import MPTTModel, TreeForeignKey
from locations.models import COUNTRY_CHOICES
from finance.credit import (MOODYS_LONG_TERM,
                            STANDARD_POORS_LONG_TERM,
                            FITCH_LONG_TERM)


class Organization(MPTTModel, Publishable):
    """Abstract base model for organizations"""

    TYPE_GENERIC = 1
    TYPE_COMPANY = 2
    TYPE_FINANCING = 3
    TYPE_GOVERNMENT = 4
    TYPE_MILITARY = 5
    TYPE_MULTILATERAL = 6
    TYPE_NGO = 7
    TYPE_POLITICAL = 8

    ORGANIZATION_TYPES = (
        (TYPE_GENERIC, "Generic/Unknown"),
        (TYPE_COMPANY, "Company"),
        (TYPE_FINANCING, "Financing Organization"),
        (TYPE_GOVERNMENT, "Government"),
        (TYPE_MILITARY, "Military"),
        (TYPE_MULTILATERAL, "Multilateral"),
        (TYPE_NGO, "NGO"),
        (TYPE_POLITICAL, "Political Entity"),
    )

    name = models.CharField(max_length=100)
    organization_type = models.PositiveSmallIntegerField(
        choices=ORGANIZATION_TYPES,
        default=TYPE_GENERIC
    )
    leaders = models.ManyToManyField('Person', blank=True,
                                     related_name='organizations_led')
    initiatives = models.ManyToManyField('infrastructure.Initiative', blank=True)
    headquarters = models.ForeignKey('locations.Place', models.SET_NULL, blank=True, null=True)
    notes = MarkdownField(blank=True)
    related_events = models.ManyToManyField('Event', blank=True)
    founding_date = models.DateField(blank=True, null=True)
    dissolution_date = models.DateField(blank=True, null=True)
    parent = TreeForeignKey('self', null=True, blank=True,
                            verbose_name='parent organization',
                            related_name='children', db_index=True)
    staff_size = models.PositiveSmallIntegerField("Staff/Personnel count",
                                                  blank=True, null=True)
    mission = MarkdownField("Mandate/Mission Statement", blank=True)
    related_organizations = models.ManyToManyField('self', blank=True)

    class MPTTMeta:
            order_insertion_by = ['name']

    def __str__(self):
        return self.name


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


class CompanyStructure(models.Model):
    """Describes structure of a company"""
    name = models.CharField("Structure", max_length=100)


# Details
class OrganizationDetails(models.Model):
    organization = models.OneToOneField(
        'Organization',
        models.CASCADE
    )

    class Meta:
        abstract = True

    def __str__(self):
        return "Details for {}".format(self.organization.name)


class CompanyDetails(OrganizationDetails):
    """Details of an company"""

    SECTOR_PRIMARY = 1
    SECTOR_SECONDARY = 2
    SECTOR_TERTIARY = 3

    SECTOR_CHOICES = (
        (SECTOR_PRIMARY, "Primary (raw materials)"),
        (SECTOR_SECONDARY, "Secondary (manufacturing)"),
        (SECTOR_TERTIARY, "Tertiary (sales and services)"),
    )
    structure = models.ForeignKey('CompanyStructure', models.SET_NULL, blank=True, null=True)
    sector = models.PositiveSmallIntegerField(blank=True, null=True, choices=SECTOR_CHOICES)
    org_type = models.ForeignKey('CompanyType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')

    class Meta:
        verbose_name_plural = "company details"


class FinancingOrganizationDetails(OrganizationDetails):
    """Details of a financing organization"""

    MOODYS_RATING_CHOICES = tuple(x for x in enumerate(MOODYS_LONG_TERM, start=1))
    FITCH_RATING_CHOICES = tuple(x for x in enumerate(FITCH_LONG_TERM, start=101))
    STANDARD_POORS_RATING_CHOICES = tuple(x for x in enumerate(STANDARD_POORS_LONG_TERM, start=201))

    # Financials
    approved_capital = models.DecimalField(blank=True, null=True,
                                           max_digits=17, decimal_places=2)
    moodys_credit_rating = models.PositiveSmallIntegerField(
        choices=MOODYS_RATING_CHOICES, blank=True, null=True
    )
    fitch_credit_rating = models.PositiveSmallIntegerField(
        choices=FITCH_RATING_CHOICES, blank=True, null=True
    )
    sp_credit_rating = models.PositiveSmallIntegerField(
        "Standard & Poors Credit Rating",
        choices=STANDARD_POORS_RATING_CHOICES, blank=True, null=True
    )
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

    def get_credit_ratings_display(self):
        return (
            self.get_moodys_credit_rating_display(),
            self.get_fitch_credit_rating_display(),
            self.get_sp_credit_rating_display()
        )

    class Meta:
        verbose_name_plural = "financing organization details"


class GovernmentDetails(OrganizationDetails):
    """Details of a government"""
    country = models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True)

    class Meta:
        verbose_name_plural = "government details"


class MilitaryDetails(OrganizationDetails):
    """Details of a military variable"""
    country = models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES, blank=True, null=True)
    ruling_party = models.BooleanField(default=True)
    budget = models.DecimalField(blank=True, null=True,
                                 max_digits=17, decimal_places=2)

    class Meta:
        verbose_name_plural = "military details"


class MultilateralDetails(OrganizationDetails):
    """Details of a multilateral organization"""
    members = models.ManyToManyField('Organization',
                                     related_name='multilateral_memberships'
                                     )
    org_type = models.ForeignKey('MultilateralType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')

    class Meta:
        verbose_name_plural = "multilateral details"


class NGODetails(OrganizationDetails):
    """Details of an NGO (Non-governmental Organization)"""
    members = models.ManyToManyField('Organization',
                                     related_name='ngo_memberships'
                                     )
    geographic_scope = models.ForeignKey('locations.Region',
                                         models.SET_NULL, blank=True, null=True)
    endowment = models.DecimalField(blank=True, null=True,
                                    max_digits=17, decimal_places=2)
    org_type = models.ForeignKey('NGOType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')

    class Meta:
        verbose_name_plural = "NGO details"


class PoliticalDetails(OrganizationDetails):
    """Details of a Political Entity"""
    countries = ArrayField(
        models.PositiveSmallIntegerField(choices=COUNTRY_CHOICES),
        blank=True, null=True, default=list)
    org_type = models.ForeignKey('PoliticalType',
                                 models.SET_NULL, blank=True, null=True,
                                 verbose_name='type')
    ruling_party = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "poltitical details"


# Shareholders

class ShareholderBase(models.Model):
    right = models.ForeignKey('FinancingOrganizationDetails',
                              verbose_name="to", on_delete=models.CASCADE,
                              related_name='+')
    value = models.DecimalField('% Share', max_digits=5, decimal_places=2)

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
