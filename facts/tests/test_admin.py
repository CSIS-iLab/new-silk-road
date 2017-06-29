from unittest.mock import Mock

from django.test import TestCase

from ..admin.organizations import CompanySectorListFilter
from ..models import CompanyDetails, CompanySector
from .organization_factories import CompanyDetailsFactory


class CompanySectorFilterTestCase(TestCase):
    """Filter companies by sector."""

    @classmethod
    def setUpTestData(cls):  # noqa
        super().setUpTestData()
        cls.no_sectors = CompanyDetailsFactory(sectors=[])
        cls.primary_sector = CompanyDetailsFactory(sectors=[CompanySector.SECTOR_PRIMARY, ])
        cls.secondary_sector = CompanyDetailsFactory(sectors=[CompanySector.SECTOR_SECONDARY, ])
        cls.tertiary_sector = CompanyDetailsFactory(sectors=[CompanySector.SECTOR_TERTIARY, ])
        cls.all_sectors = CompanyDetailsFactory(sectors=[
            CompanySector.SECTOR_PRIMARY,
            CompanySector.SECTOR_SECONDARY,
            CompanySector.SECTOR_TERTIARY, ])

    def test_empty_filter(self):
        """Use filter with no selection."""

        request = Mock()
        model_admin = Mock()
        params = {}
        instance = CompanySectorListFilter(request, params, CompanyDetails, model_admin)
        queryset = instance.queryset(request, CompanyDetails.objects.all())
        self.assertIsNone(queryset)

    def test_filter_single_sector(self):
        """Filter companies into a single sector."""

        request = Mock()
        model_admin = Mock()
        params = {
            'sector': str(CompanySector.SECTOR_PRIMARY),
        }
        instance = CompanySectorListFilter(request, params, CompanyDetails, model_admin)
        queryset = instance.queryset(request, CompanyDetails.objects.order_by('pk'))
        self.assertQuerysetEqual(
            queryset, [self.primary_sector.pk, self.all_sectors.pk, ],
            lambda x: x.pk)
