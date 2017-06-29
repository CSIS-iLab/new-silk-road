from django.test import TestCase
from django.urls import reverse
from django.contrib.gis.geos import Point
from django.contrib.auth.models import User

import json

from infrastructure.models import ProjectStatus
from infrastructure.factories import ProjectFactory
from locations.models import GeometryStore, PointGeometry
from locations.factories import PointGeometryFactory


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
        point.save()
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
        point.save()
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


class TestGeometryStoreCentroidViewSet(TestCase):

    def setUp(self):
        self.geom_with_published_project = GeometryStore()
        self.geom_with_published_project.save()
        point = PointGeometry(geom=Point(20, 30))
        point.save()
        self.geom_with_published_project.points.add(point)
        self.geom_with_published_project.save()
        self.published_project = ProjectFactory()
        self.published_project.published = True
        self.published_project.geo = self.geom_with_published_project
        self.published_project.save()

        self.geom_with_unpublished_project = GeometryStore()
        self.geom_with_unpublished_project.save()
        point = PointGeometry(geom=Point(40, 50))
        point.save()
        self.geom_with_unpublished_project.points.add(point)
        self.geom_with_unpublished_project.save()
        self.unpublished_project = ProjectFactory()
        self.unpublished_project.published = False
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


class TestOrganizationViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:organizations-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestProjectViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:projects-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestInitiativeViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:initiatives-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestLineViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:lines-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestPointViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:points-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)


class TestPolygonViewSet(TestCase):
    def test_that_view_loads(self):
        url = reverse('api:polygons-list')
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
