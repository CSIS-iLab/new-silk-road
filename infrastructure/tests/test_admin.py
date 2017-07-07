from unittest.mock import Mock

from django.test import TestCase

from locations.models import GeometryStore
from ..admin import HasGeoListFilter
from ..models import Project
from . import factories


class HasGeoFilterTestCase(TestCase):
    """Filter projects which are associated with geographies."""

    @classmethod
    def setUpTestData(cls):  # noqa
        super().setUpTestData()
        geo = GeometryStore.objects.create(label='New Store')
        cls.geo_project = factories.ProjectFactory(geo=geo)
        cls.no_geo_project = factories.ProjectFactory(geo=None)

    def test_empty_filter(self):
        """User filter with no selection."""

        request = Mock()
        model_admin = Mock()
        params = {}
        instance = HasGeoListFilter(request, params, Project, model_admin)
        queryset = instance.queryset(request, Project.objects.order_by('pk'))
        self.assertQuerysetEqual(
            queryset, [self.geo_project.pk, self.no_geo_project.pk, ],
            lambda x: x.pk)

    def test_has_geo(self):
        """Only include project with an associated geo store."""

        request = Mock()
        model_admin = Mock()
        params = {'geo': 'true'}
        instance = HasGeoListFilter(request, params, Project, model_admin)
        queryset = instance.queryset(request, Project.objects.order_by('pk'))
        self.assertQuerysetEqual(
            queryset, [self.geo_project.pk, ],
            lambda x: x.pk)

    def test_no_geo(self):
        """Only include project without an associated geo store."""

        request = Mock()
        model_admin = Mock()
        params = {'geo': 'false'}
        instance = HasGeoListFilter(request, params, Project, model_admin)
        queryset = instance.queryset(request, Project.objects.order_by('pk'))
        self.assertQuerysetEqual(
            queryset, [self.no_geo_project.pk, ],
            lambda x: x.pk)
