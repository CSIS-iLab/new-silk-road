from django.test import TestCase
from django.urls import reverse
from django.contrib.gis.geos import Point
from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from infrastructure.models import ProjectStatus, ProjectFunding
from infrastructure.tests.factories import ProjectFactory, InitiativeFactory
from locations.models import GeometryStore, PointGeometry
from locations.tests.factories import PointGeometryFactory, CountryFactory
from facts.tests.organization_factories import OrganizationFactory
from facts.tests.person_factories import PersonFactory


class TestProjectStatusListView(APITestCase):
    def test_that_all_project_statuses_are_returned(self):
        url = reverse('api:project-status-list')
        response = self.client.get(url)
        self.assertEqual(len(response.data), len(ProjectStatus.STATUSES))


class TestGeometryStoreDetailView(TestCase):

    def setUp(self):
        self.geometry_store = GeometryStore()
        self.geometry_store.save()
        point = PointGeometryFactory()
        self.geometry_store.points.add(point)
        self.url = reverse('api:geometrystore-detail', args=[self.geometry_store.identifier])
        # View ignores GeometryStores without projects, so add one
        self.project = ProjectFactory()
        self.project.geo = self.geometry_store
        self.project.save()

        self.user = User(username='test', password='test')
        self.user.save()

    def test_geometrystore_with_no_project(self):
        """
        Without a project, the GeometryStoreDetailView should return a 404
        """
        geometry_store = GeometryStore()
        geometry_store.save()
        point = PointGeometryFactory()
        geometry_store.points.add(point)
        url = reverse('api:geometrystore-detail', args=[geometry_store.identifier])

        with self.subTest('Authenticated'):
            self.client.force_login(self.user)
            response = self.client.get(url)
            self.assertEqual(response.status_code, 404)

        with self.subTest('Anonymous'):
            self.client.logout()
            response = self.client.get(url)
            self.assertEqual(response.status_code, 404)

    def test_published_project(self):
        self.project.published = True
        self.project.save()

        with self.settings(PUBLISH_FILTER_ENABLED=True):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED'):
                self.client.force_login(self.user)
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED'):
                self.client.logout()
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)

        with self.settings(PUBLISH_FILTER_ENABLED=False):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED == False'):
                self.client.force_login(self.user)
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED == False'):
                self.client.logout()
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)

    def test_unpublished_project(self):
        self.project.published = False
        self.project.save()

        with self.settings(PUBLISH_FILTER_ENABLED=True):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED'):
                self.client.force_login(self.user)
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED'):
                self.client.logout()
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 404)

        with self.settings(PUBLISH_FILTER_ENABLED=False):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED == False'):
                self.client.force_login(self.user)
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED == False'):
                self.client.logout()
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)


class TestGeometryStoreCentroidViewSet(APITestCase):

    def setUp(self):
        self.geom_with_published_project = GeometryStore()
        self.geom_with_published_project.save()
        point = PointGeometry(geom=Point(20, 30))
        point.save()
        self.geom_with_published_project.points.add(point)
        self.published_project = ProjectFactory(published=True)
        self.published_project.geo = self.geom_with_published_project
        self.published_project.save()

        self.geom_with_unpublished_project = GeometryStore()
        self.geom_with_unpublished_project.save()
        point = PointGeometry(geom=Point(40, 50))
        point.save()
        self.geom_with_unpublished_project.points.add(point)
        self.unpublished_project = ProjectFactory(published=False)
        self.unpublished_project.geo = self.geom_with_unpublished_project
        self.unpublished_project.save()

        self.list_url = reverse('api:geostore-centroids-list')

        self.user = User(username='test', password='test')
        self.user.save()

    def test_centroid_list(self):

        # Make a GeometryStore object without points/lines/polygons/centroid; should not appear in list
        unlocated = GeometryStore()
        unlocated.save()

        with self.settings(PUBLISH_FILTER_ENABLED=True):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED'):
                self.client.force_login(self.user)
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
                # Both geometries from setUp should be in the list, but not the one without a centroid.
                data = response.data
                self.assertEqual(len(data['features']), 2)

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED'):
                self.client.logout()
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
                # Only the geometry with a published project should be included.
                data = response.data
                self.assertEqual(len(data['features']), 1)

        with self.settings(PUBLISH_FILTER_ENABLED=False):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED == False'):
                self.client.force_login(self.user)
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
                # Both geometries from setUp should be in the list, but not the one without a centroid.
                data = response.data
                self.assertEqual(len(data['features']), 2)

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED == False'):
                self.client.logout()
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
                # Both geometries from setUp should be in the list, but not the one without a centroid.
                data = response.data
                self.assertEqual(len(data['features']), 2)


class TestOrganizationViewSet(APITestCase):
    def setUp(self):
        self.url = reverse('api:organization-list')

    def test_that_view_loads(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_filters(self):
        included_org = OrganizationFactory()
        excluded_org = OrganizationFactory()

        with self.subTest('no filters'):
            response = self.client.get(self.url)
            returned_orgs = [result['name'] for result in response.data['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertIn(excluded_org.name, returned_orgs)

        with self.subTest('filter by leader'):
            leader = PersonFactory()
            included_org.leaders.add(leader)
            params = {
                'leaders': leader.id
            }
            response = self.client.get(self.url, params)
            returned_orgs = [result['name'] for result in response.data['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertNotIn(excluded_org.name, returned_orgs)

        with self.subTest('filter by parent'):
            parent = OrganizationFactory()
            included_org.parent = parent
            included_org.save()
            params = {
                'parent': parent.id
            }
            response = self.client.get(self.url, params)
            returned_orgs = [result['name'] for result in response.data['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertNotIn(excluded_org.name, returned_orgs)

        with self.subTest('filter by country (single)'):
            country = CountryFactory()
            country.save()
            included_org.countries.add(country)
            params = {
                'country': country.id
            }
            response = self.client.get(self.url, params)
            returned_orgs = [result['name'] for result in response.data['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertNotIn(excluded_org.name, returned_orgs)

        with self.subTest('filter by countries (multiple)'):
            country1 = CountryFactory()
            country2 = CountryFactory()
            included_org.countries.add(country1)
            extra_included_org = OrganizationFactory()
            extra_included_org.countries.add(country2)
            params = {
                'countries': [country1.id, country2.id]
            }
            response = self.client.get(self.url, params)
            returned_orgs = [result['name'] for result in response.data['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertIn(extra_included_org.name, returned_orgs)
            self.assertNotIn(excluded_org.name, returned_orgs)

        with self.subTest('filter by principal initiative'):
            principal_initiative = InitiativeFactory(principal_agent=included_org)
            params = {
                'principal_initiatives': principal_initiative.id
            }
            response = self.client.get(self.url, params)
            returned_orgs = [result['name'] for result in response.data['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertNotIn(excluded_org.name, returned_orgs)


class TestProjectViewSet(APITestCase):
    def setUp(self):
        self.url = reverse('api:project-list')

    def test_that_view_loads(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_basic_filters(self):
        included_project = ProjectFactory(published=True)
        included_project.save()
        excluded_project = ProjectFactory(published=True)
        excluded_project.save()

        with self.subTest('no filters'):
            response = self.client.get(self.url)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(included_project.name, returned_projects)
            self.assertIn(excluded_project.name, returned_projects)

        with self.subTest('name'):
            params = {
                'name__iexact': included_project.name.lower(),
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(included_project.name, returned_projects)
            self.assertNotIn(excluded_project.name, returned_projects)

    def test_funding_filters(self):
        expensive_project = ProjectFactory(published=True)
        expensive_project.save()
        ProjectFunding.objects.create(project=expensive_project, amount=10000000)
        cheap_project = ProjectFactory(published=True)
        cheap_project.save()
        ProjectFunding.objects.create(project=cheap_project, amount=1000)

        with self.subTest('amount'):
            params = {
                'funding__amount__gte': '10000'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)

        with self.subTest('currency amount >='):
            params = {
                'funding__currency_amount__gte': '1000000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)

        with self.subTest('currency amount >'):
            params = {
                'funding__currency_amount__gt': '1000000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)

        with self.subTest('currency amount <='):
            params = {
                'funding__currency_amount__lte': '1000000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(expensive_project.name, returned_projects)
            self.assertIn(cheap_project.name, returned_projects)

        with self.subTest('currency amount <'):
            params = {
                'funding__currency_amount__lt': '1000000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(expensive_project.name, returned_projects)
            self.assertIn(cheap_project.name, returned_projects)

        with self.subTest('missing currency'):
            params = {
                'funding__currency_amount': '10000000'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)

        with self.subTest('missing amount'):
            params = {
                'funding__currency_amount': 'USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)

    def test_initiatives_count_filters(self):
        no_initiative_project = ProjectFactory(published=True)
        single_initiative_project = ProjectFactory(published=True)
        single_initiative_project.initiatives.add(InitiativeFactory())
        multi_initiative_project = ProjectFactory(published=True)
        multi_initiative_project.initiatives.add(InitiativeFactory())
        multi_initiative_project.initiatives.add(InitiativeFactory())

        with self.subTest('count exact'):
            params = {
                'initiatives__count': '1'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(no_initiative_project.name, returned_projects)
            self.assertIn(single_initiative_project.name, returned_projects)
            self.assertNotIn(multi_initiative_project.name, returned_projects)

        with self.subTest('>='):
            params = {
                'initiatives__count__gte': '1'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(no_initiative_project.name, returned_projects)
            self.assertIn(single_initiative_project.name, returned_projects)
            self.assertIn(multi_initiative_project.name, returned_projects)

        with self.subTest('>'):
            params = {
                'initiatives__count__gt': '1'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(no_initiative_project.name, returned_projects)
            self.assertNotIn(single_initiative_project.name, returned_projects)
            self.assertIn(multi_initiative_project.name, returned_projects)

        with self.subTest('<='):
            params = {
                'initiatives__count__lte': '1'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(no_initiative_project.name, returned_projects)
            self.assertIn(single_initiative_project.name, returned_projects)
            self.assertNotIn(multi_initiative_project.name, returned_projects)

        with self.subTest('<'):
            params = {
                'initiatives__count__lt': '1'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(no_initiative_project.name, returned_projects)
            self.assertNotIn(single_initiative_project.name, returned_projects)
            self.assertNotIn(multi_initiative_project.name, returned_projects)

    def test_total_count_filters(self):
        expensive_project = ProjectFactory(published=True, total_cost=10000000)
        cheap_project = ProjectFactory(published=True, total_cost=1000)
        free_project = ProjectFactory(published=True, total_cost=0)

        with self.subTest('exact amount'):
            params = {
                'total_cost_amount': '10000000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)
            self.assertNotIn(free_project.name, returned_projects)

        with self.subTest('>='):
            params = {
                'total_cost_amount__gte': '1000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(expensive_project.name, returned_projects)
            self.assertIn(cheap_project.name, returned_projects)
            self.assertNotIn(free_project.name, returned_projects)

        with self.subTest('>'):
            params = {
                'total_cost_amount__gt': '1000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)
            self.assertNotIn(free_project.name, returned_projects)

        with self.subTest('<='):
            params = {
                'total_cost_amount__lte': '1000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(expensive_project.name, returned_projects)
            self.assertIn(cheap_project.name, returned_projects)
            self.assertIn(free_project.name, returned_projects)

        with self.subTest('<'):
            params = {
                'total_cost_amount__lt': '1000 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)
            self.assertIn(free_project.name, returned_projects)

        with self.subTest('missing currency'):
            params = {
                'total_cost_amount': '10000000'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)
            self.assertNotIn(free_project.name, returned_projects)

        with self.subTest('missing amount'):
            params = {
                'total_cost_amount': 'USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in response.data['results']]
            self.assertNotIn(expensive_project.name, returned_projects)
            self.assertNotIn(cheap_project.name, returned_projects)
            self.assertNotIn(free_project.name, returned_projects)


class TestInitiativeViewSet(APITestCase):
    def setUp(self):
        self.url = reverse('api:initiative-list')

    def test_that_view_loads(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_dynamic_fields_view(self):
        InitiativeFactory(published=True)
        params = {
            'fields': 'name,initiative_type,founding_month'
        }
        response = self.client.get(self.url, params)
        data = response.data
        self.assertIn('name', data['results'][0])
        self.assertIn('initiative_type', data['results'][0])
        self.assertIn('founding_month', data['results'][0])
        self.assertNotIn('founding_year', data['results'][0])
        self.assertNotIn('geographic_scope', data['results'][0])


class TestLineViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:linestringgeometry-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestPointViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:pointgeometry-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestPolygonViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:polygongeometry-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestRegionListView(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:region-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestCountryListView(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:country-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestInfrastructureTypeList(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:infrastructure-type-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
