from django.contrib.gis.geos import Point, LineString, Polygon
from django.contrib.gis.geos import MultiPoint, MultiLineString, MultiPolygon
from django.test import TestCase

from .. import models


class PointGeometryTestCase(TestCase):

    def test_point_coordinates(self):
        x_coord = -79.033333
        y_coord = 35.933333
        obj = models.PointGeometry(label='Test Point', geom=Point(x_coord, y_coord))

        self.assertIsNotNone(obj.latitude)
        self.assertEqual(obj.latitude, y_coord)

        self.assertIsNotNone(obj.longitude)
        self.assertEqual(obj.longitude, x_coord)

    def test_str(self):
        point = models.PointGeometry(geom=Point(-79.033333, 35.933333))

        with self.subTest('Use Label'):
            point.label = 'Test Point'
            self.assertEqual(str(point), 'Test Point')

        with self.subTest('Use Source'):
            point.label = ''
            point.attributes = {'source': 'Test Source'}
            self.assertEqual(str(point), 'Test Source')

        with self.subTest('Use WKT'):
            point.label = ''
            point.attributes = {}
            self.assertEqual(str(point), 'POINT (-79.033333 35.933333)')


class GeometryStoreTestCase(TestCase):

    def setUp(self):
        super().setUp()
        self.store = models.GeometryStore.objects.create()

    def test_str(self):

        with self.subTest('Use Label'):
            self.store.label = 'Test Geo Store'
            self.assertEqual(str(self.store), 'Test Geo Store')

        with self.subTest('Use UUID'):
            self.store.label = ''
            self.assertEqual(str(self.store), str(self.store.identifier))

    def test_overall_extent(self):
        """Calculate the bounding box of a geometry collection."""

        with self.subTest('Single Point'):
            point = models.PointGeometry.objects.create(geom=Point(0.5, 0.5))
            self.store.points.add(point)
            extent = self.store.calculate_overall_extent()
            self.assertEqual(extent, (0.5, 0.5, 0.5, 0.5))
            self.store.points.clear()

        with self.subTest('Single Line'):
            line = models.LineStringGeometry.objects.create(geom=LineString((1.0, 0.0), (0.0, 1.0)))
            self.store.lines.add(line)
            extent = self.store.calculate_overall_extent()
            self.assertEqual(extent, (0.0, 0.0, 1.0, 1.0))
            self.store.lines.clear()

        with self.subTest('Single Polygon'):
            polygon = models.PolygonGeometry.objects.create(
                geom=Polygon(((0.0, 0.0), (0.0, -1.0), (-1.0, -1.0), (-1.0, 0.0), (0.0, 0.0)), ))
            self.store.polygons.add(polygon)
            extent = self.store.calculate_overall_extent()
            self.assertEqual(extent, (-1.0, -1.0, 0.0, 0.0))
            self.store.polygons.clear()

    def test_multiline(self):
        """Union all of the related lines for this store."""

        line = models.LineStringGeometry.objects.create(geom=LineString((1.0, 0.0), (0.0, 1.0)))
        other = models.LineStringGeometry.objects.create(geom=LineString((-1.0, 0.0), (0.0, -1.0)))
        self.store.lines.add(line)
        self.store.lines.add(other)

        result = self.store.multiline()
        self.assertTrue(isinstance(result, MultiLineString))
        self.assertIn(line.geom, result)
        self.assertIn(other.geom, result)

    def test_multipoint(self):
        """Union all of the related points for this store."""

        point = models.PointGeometry.objects.create(geom=Point(0.5, 0.5))
        other = models.PointGeometry.objects.create(geom=Point(-0.5, -0.5))
        self.store.points.add(point)
        self.store.points.add(other)

        result = self.store.multipoint()
        self.assertTrue(isinstance(result, MultiPoint))
        self.assertIn(point.geom, result)
        self.assertIn(other.geom, result)

    def test_mulipolygon(self):
        """Union all of the related polygons for this store."""

        polygon = models.PolygonGeometry.objects.create(
            geom=Polygon(((0.0, 0.0), (0.0, -1.0), (-1.0, -1.0), (-1.0, 0.0), (0.0, 0.0)), ))
        other = models.PolygonGeometry.objects.create(
            geom=Polygon(((0.0, 0.0), (0.0, 1.0), (1.0, 1.0), (1.0, 0.0), (0.0, 0.0)), ))
        self.store.polygons.add(polygon)
        self.store.polygons.add(other)

        result = self.store.multipolygon()
        self.assertTrue(isinstance(result, MultiPolygon))
        self.assertIn(polygon.geom, result)
        self.assertIn(other.geom, result)

    def test_setting_centroid(self):
        """Adding/removing related geometries should update the centroid of the store."""

        self.assertIsNone(self.store.centroid)

        with self.subTest('Adding Point'):
            point = models.PointGeometry.objects.create(geom=Point(1, 1))
            other = models.PointGeometry.objects.create(geom=Point(0, 0))
            self.store.points.add(point)
            self.store.points.add(other)
            self.store.refresh_from_db()
            self.assertEqual(self.store.centroid, Point(0.5, 0.5))

        with self.subTest('Removing Point'):
            self.store.points.remove(other)
            self.store.refresh_from_db()
            self.assertEqual(self.store.centroid, Point(1, 1))
            self.store.points.remove(point)

        with self.subTest('Adding Line'):
            line = models.LineStringGeometry.objects.create(
                geom=LineString((1.0, 0.0), (0.0, 1.0)))
            other = models.LineStringGeometry.objects.create(
                geom=LineString((0.0, 2.0), (2.0, 0.0)))
            self.store.lines.add(line)
            self.store.lines.add(other)
            self.store.refresh_from_db()
            self.assertEqual(self.store.centroid, Point(0.8333333333333333, 0.8333333333333333))

        with self.subTest('Removing Line'):
            self.store.lines.remove(other)
            self.store.refresh_from_db()
            self.assertEqual(self.store.centroid, Point(0.5, 0.5))
            self.store.lines.remove(line)

        with self.subTest('Adding Polygon'):
            polygon = models.PolygonGeometry.objects.create(
                geom=Polygon(((0.0, 0.0), (0.0, -1.0), (-1.0, -1.0), (-1.0, 0.0), (0.0, 0.0)), ))
            other = models.PolygonGeometry.objects.create(
                geom=Polygon(((0.0, 0.0), (0.0, 1.0), (1.0, 1.0), (1.0, 0.0), (0.0, 0.0)), ))
            self.store.polygons.add(polygon)
            self.store.polygons.add(other)
            self.store.refresh_from_db()
            self.assertEqual(self.store.centroid, Point(0, 0))

        with self.subTest('Removing Polygon'):
            self.store.polygons.remove(other)
            self.store.refresh_from_db()
            self.assertEqual(self.store.centroid, Point(-0.5, -0.5))


class PlaceTestCase(TestCase):

    def setUp(self):
        super().setUp()
        self.country = models.Country.objects.create(
            name='China', slug='china', numeric=156, alpha_3='CHN')
        self.place = models.Place.objects.create(
            label='Olympic Green', city='Beijing', country=self.country)

    def test_str(self):
        """String representation of a place uses the assigned label."""

        self.assertEqual(str(self.place), 'Olympic Green')

    def test_location_display(self):
        """Show the city/country name."""

        self.assertEqual(self.place.get_location_display(), 'Beijing, China')
