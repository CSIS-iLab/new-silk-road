from unittest.mock import Mock

from django.test import TestCase

from facts.models import Data
from locations.models import GeometryStore
from ..admin import HasGeoListFilter, ProjectAdmin
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


class ProjectAdminTestCase(TestCase):
    """Admin customizations for projects."""

    def setUp(self):
        super().setUp()
        self.admin = ProjectAdmin(Project, admin_site=Mock())

    @classmethod
    def setUpTestData(cls):  # noqa
        super().setUpTestData()
        cls.project = factories.ProjectFactory(name='Mine')
        cls.other = factories.ProjectFactory(name='Other', sources=['http://google.com', ])
        empty = Data.objects.create(dictionary={})
        cls.other.extra_data.add(empty)
        cls.fieldbook = factories.ProjectFactory(name='Fieldbook')
        data = Data.objects.create(dictionary={'project_id': 'Project X'})
        cls.fieldbook.extra_data.add(data)

    def test_search(self):
        """Find projects in the admin."""

        qs = Project.objects.order_by('pk')
        request = Mock()

        tests = (
            # Label, Term, Expected Results
            ('No Term', '', [self.project.pk, self.other.pk, self.fieldbook.pk, ]),
            ('Project Name', 'Mine', [self.project.pk, ]),
            ('Project ID', str(self.other.pk), [self.other.pk, ]),
            ('Fieldbook ID', 'Project X', [self.fieldbook.pk, ]),
        )

        for label, term, expected in tests:
            with self.subTest(label):
                results, _use_distinct = self.admin.get_search_results(request, qs, term)
                self.assertQuerysetEqual(results, expected, lambda x: x.pk)

    def test_display_fieldbook_id(self):
        """Show fieldbook id for a project if it has one."""

        tests = (
            # Project, Fieldbook ID
            (self.project, None),
            (self.other, None),
            (self.fieldbook, 'Project X'),
        )

        for project, expected in tests:
            with self.subTest('Fieldbook ID for {}'.format(project)):
                self.assertEqual(self.admin.fieldbook_id(project), expected)

    def test_display_sources(self):
        """Display list of sources associated with the project."""

        tests = (
            # Project, Sources
            (self.project, None),
            (self.other, '<ul><li>http://google.com</li></ul>'),
            (self.fieldbook, None),
        )

        for project, expected in tests:
            with self.subTest('Sources for {}'.format(project)):
                result = self.admin.sources_display(project)
                if expected is not None:
                    self.assertHTMLEqual(result, expected)
                else:
                    self.assertIsNone(result)
