from django.test import TestCase
from django.urls import reverse
from django.contrib.gis.geos import Point
from django.contrib.auth.models import User

import json

from infrastructure.models import ProjectStatus, ProjectFunding
from infrastructure.tests.factories import ProjectFactory, InitiativeFactory, CuratedProjectCollectionFactory
from locations.models import GeometryStore, PointGeometry
from locations.tests.factories import PointGeometryFactory, CountryFactory
from facts.tests.organization_factories import OrganizationFactory
from facts.tests.person_factories import PersonFactory


class TestProjectStatusListView(TestCase):
    def test_that_all_project_statuses_are_returned(self):
        url = reverse('api:project-status-list')
        response = self.client.get(url)
        self.assertEqual(len(json.loads(response.content.decode())), len(ProjectStatus.STATUSES))


class TestGeometryStoreDetailView(TestCase):

    def setUp(self):
        self.geometry_store = GeometryStore()
        self.geometry_store.save()
        point = PointGeometryFactory()
        self.geometry_store.points.add(point)
        self.url = reverse('api:geometrystore-detail', args=[self.geometry_store.identifier])
        # View ignores GeometryStores without projects, so add one
        self.project = ProjectFactory(countries=[CountryFactory(), CountryFactory()])
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
                response_locations = [proj['locations'] for proj in response.data['projects']][0]
                self.assertEqual(
                    set(response_locations),
                    set(self.project.countries.values_list('name', flat=True))
                )

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED'):
                self.client.logout()
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)
                response_locations = [proj['locations'] for proj in response.data['projects']][0]
                self.assertEqual(
                    set(response_locations),
                    set(self.project.countries.values_list('name', flat=True))
                )

        with self.settings(PUBLISH_FILTER_ENABLED=False):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED == False'):
                self.client.force_login(self.user)
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)
                response_locations = [proj['locations'] for proj in response.data['projects']][0]
                self.assertEqual(
                    set(response_locations),
                    set(self.project.countries.values_list('name', flat=True))
                )

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED == False'):
                self.client.logout()
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)
                response_locations = [proj['locations'] for proj in response.data['projects']][0]
                self.assertEqual(
                    set(response_locations),
                    set(self.project.countries.values_list('name', flat=True))
                )

    def test_unpublished_project(self):
        self.project.published = False
        self.project.save()

        with self.settings(PUBLISH_FILTER_ENABLED=True):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED'):
                self.client.force_login(self.user)
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)
                response_locations = [proj['locations'] for proj in response.data['projects']][0]
                self.assertEqual(
                    set(response_locations),
                    set(self.project.countries.values_list('name', flat=True))
                )

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED'):
                self.client.logout()
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 404)

        with self.settings(PUBLISH_FILTER_ENABLED=False):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED == False'):
                self.client.force_login(self.user)
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)
                response_locations = [proj['locations'] for proj in response.data['projects']][0]
                self.assertEqual(
                    set(response_locations),
                    set(self.project.countries.values_list('name', flat=True))
                )

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED == False'):
                self.client.logout()
                response = self.client.get(self.url)
                self.assertEqual(response.status_code, 200)
                response_locations = [proj['locations'] for proj in response.data['projects']][0]
                self.assertEqual(
                    set(response_locations),
                    set(self.project.countries.values_list('name', flat=True))
                )


class TestGeometryStoreCentroidViewSet(TestCase):

    def setUp(self):
        self.geom_with_published_project = GeometryStore()
        self.geom_with_published_project.save()
        point = PointGeometry(geom=Point(20, 30))
        point.save()
        self.geom_with_published_project.points.add(point)
        self.published_project = ProjectFactory(
            published=True,
            countries=[CountryFactory(), CountryFactory()],
            total_cost=1200000
        )
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

        # Make a GeometryStore object without points/lines/polygons/centroid
        # This should not appear in list
        unlocated = GeometryStore()
        unlocated.save()
        # Single point store which doesn't have an associcated project
        # This should not appear in list
        random_point = GeometryStore()
        random_point.save()
        point = PointGeometry(geom=Point(20, 30))
        point.save()
        random_point.points.add(point)

        with self.settings(PUBLISH_FILTER_ENABLED=True):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED'):
                self.client.force_login(self.user)
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
                # Both geometries from setUp should be in the list, but not the one without a centroid.
                data = json.loads(response.content.decode())
                self.assertEqual(len(data['features']), 2)

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED'):
                self.client.logout()
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
                # Only the geometry with a published project should be included.
                data = json.loads(response.content.decode())
                self.assertEqual(len(data['features']), 1)

        with self.settings(PUBLISH_FILTER_ENABLED=False):
            with self.subTest('Authenticated and PUBLISH_FILTER_ENABLED == False'):
                self.client.force_login(self.user)
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
                # Both geometries from setUp should be in the list, but not the one without a centroid.
                data = json.loads(response.content.decode())
                self.assertEqual(len(data['features']), 2)

            with self.subTest('Not authenticated, PUBLISH_FILTER_ENABLED == False'):
                self.client.logout()
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
                # Both geometries from setUp should be in the list, but not the one without a centroid.
                data = json.loads(response.content.decode())
                self.assertEqual(len(data['features']), 2)

    def test_response_format(self):
        """Centroids should include related project information in their properties."""

        with self.settings(PUBLISH_FILTER_ENABLED=True):
            self.client.logout()
            response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, 200)
        # Only the geometry with a published project should be included.
        data = json.loads(response.content.decode())
        self.assertEqual(len(data['features']), 1)
        feature = data['features'][0]
        self.assertEqual(feature, {
            'id': str(self.geom_with_published_project.identifier),
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    self.geom_with_published_project.centroid.x,
                    self.geom_with_published_project.centroid.y,
                ],
            },
            'properties': {
                'label': self.published_project.name,
                'geostore': str(self.geom_with_published_project.identifier),
                'icon-image': 'dot',
                'infrastructureType': self.published_project.infrastructure_type.name,
                "locations": ','.join(
                    self.geom_with_published_project.projects.values_list(
                        'countries__name',
                        flat=True
                    )
                ),
                "total_cost": self.geom_with_published_project.projects.all()[0].total_cost,
                "currency": self.geom_with_published_project.projects.all()[0].total_cost_currency,
            }
        })

    def test_performance(self):
        """Count the number of queries required to fetch the centroids."""

        # Make a GeometryStore object without points/lines/polygons/centroid
        # This should not appear in list
        unlocated = GeometryStore()
        unlocated.save()
        # Single point store which doesn't have an associcated project
        # This should not appear in list
        random_point = GeometryStore()
        random_point.save()
        point = PointGeometry(geom=Point(20, 30))
        point.save()
        random_point.points.add(point)
        # Create 9 more (for a total of 10) random point projects for the map
        for i in range(9):
            geo = GeometryStore()
            geo.save()
            point = PointGeometry(geom=Point(20, 30))
            point.save()
            geo.points.add(point)
            project = ProjectFactory(published=True)
            project.geo = geo
            project.save()

        with self.settings(PUBLISH_FILTER_ENABLED=True):
            self.client.logout()
            with self.assertNumQueries(1):
                # All response data should be fetched in a single query
                response = self.client.get(self.list_url)
                self.assertEqual(response.status_code, 200)
            data = json.loads(response.content.decode())
            self.assertEqual(len(data['features']), 10)

    def test_centroid_list_filters(self):
        """
        Test that one can filter by the related project's infrastructure type name,
        which is set as an annoation
        """
        project_type = self.geom_with_published_project.projects.first().infrastructure_type.name
        with self.subTest('project type match'):
            response = self.client.get(
                self.list_url, {'project_type': project_type}
            )
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.content.decode())
            self.assertEqual(len(data['features']), 1)

        with self.subTest('project type not match'):
            response = self.client.get(
                self.list_url, {'project_type': "FOO"}
            )
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.content.decode())
            self.assertEqual(len(data['features']), 0)



class TestOrganizationViewSet(TestCase):
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
            returned_orgs = [result['name'] for result in json.loads(response.content.decode())['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertIn(excluded_org.name, returned_orgs)

        with self.subTest('filter by leader'):
            leader = PersonFactory()
            included_org.leaders.add(leader)
            params = {
                'leaders': leader.id
            }
            response = self.client.get(self.url, params)
            returned_orgs = [result['name'] for result in json.loads(response.content.decode())['results']]
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
            returned_orgs = [result['name'] for result in json.loads(response.content.decode())['results']]
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
            returned_orgs = [result['name'] for result in json.loads(response.content.decode())['results']]
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
            returned_orgs = [result['name'] for result in json.loads(response.content.decode())['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertIn(extra_included_org.name, returned_orgs)
            self.assertNotIn(excluded_org.name, returned_orgs)

        with self.subTest('filter by principal initiative'):
            principal_initiative = InitiativeFactory(principal_agent=included_org)
            params = {
                'principal_initiatives': principal_initiative.id
            }
            response = self.client.get(self.url, params)
            returned_orgs = [result['name'] for result in json.loads(response.content.decode())['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertNotIn(excluded_org.name, returned_orgs)

        with self.subTest('filter by principal initiative existance'):
            params = {
                'principal_initiatives__isnull': 'False'
            }
            response = self.client.get(self.url, params)
            returned_orgs = [result['name'] for result in json.loads(response.content.decode())['results']]
            self.assertIn(included_org.name, returned_orgs)
            self.assertNotIn(excluded_org.name, returned_orgs)


class TestProjectViewSet(TestCase):
    def setUp(self):
        self.url = reverse('api:project-list')

    def test_that_view_loads(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_filters(self):
        included_project = ProjectFactory(published=True)
        included_project.save()
        excluded_project = ProjectFactory(published=True)
        excluded_project.save()

        with self.subTest('no filters'):
            response = self.client.get(self.url)
            returned_projects = [result['name'] for result in json.loads(response.content.decode())['results']]
            self.assertIn(included_project.name, returned_projects)
            self.assertIn(excluded_project.name, returned_projects)

        with self.subTest('filter by funding'):
            funding = ProjectFunding(project=included_project, amount=5)
            funding.save()
            params = {
                'funding__amount__gte': '4'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in json.loads(response.content.decode())['results']]
            self.assertIn(included_project.name, returned_projects)
            self.assertNotIn(excluded_project.name, returned_projects)

        with self.subTest('filter by funding - currency amount'):
            funding = ProjectFunding(project=included_project, amount=5)
            funding.save()
            params = {
                'funding__currency_amount__gte': '4 USD'
            }
            response = self.client.get(self.url, params)
            returned_projects = [result['name'] for result in json.loads(response.content.decode())['results']]
            self.assertIn(included_project.name, returned_projects)
            self.assertNotIn(excluded_project.name, returned_projects)


class TestInitiativeViewSet(TestCase):
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
        data = json.loads(response.content.decode())
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


class CuratedProjectCollectionListViewTestCase(TestCase):
    """List curated projects from the database."""

    def setUp(self):
        super().setUp()
        self.project = ProjectFactory(published=True)
        self.other_project = ProjectFactory(published=True)
        self.curated_project_collection = CuratedProjectCollectionFactory(
            published=True,
        )
        self.curated_project_collection.projects.add(self.project, self.other_project)
        self.url = reverse('api:curated-projects-list')

    def test_get_listing(self):
        """Render the list of curated project collectionss."""

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.curated_project_collection.name)

    def test_unpublished_curated_project_collection(self):
        """Unpublished curated project collections shouldn't be listed."""

        self.curated_project_collection.published = False
        self.curated_project_collection.save()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, self.curated_project_collection.name)

    def test_unpublished_projects_in_project_collection(self):
        """
        Curated project collections shouldn't be listed if they are only related to unpublished projects
        """
        with self.settings(PUBLISH_FILTER_ENABLED=True):
            self.client.logout()

            for project in [self.project, self.other_project]:
                project.published = False
                project.save()

            response = self.client.get(self.url)
            self.assertEqual(response.status_code, 200)
            self.assertNotContains(response, self.curated_project_collection.name)
