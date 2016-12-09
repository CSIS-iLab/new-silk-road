from unittest.mock import patch
from django.test import SimpleTestCase, override_settings
from search.searches import SiteSearch
from .settings import TEST_SEARCH


@override_settings(SEARCH=TEST_SEARCH)
class SiteSearchTestCase(SimpleTestCase):
    """Test SiteSearch creates valid searches for ElasticSearch"""
    # NOTE: SiteSearch is a specific search implementation. Should eventually be derived from a reusable base class

    def test_constructor_builds_search(self):
        """SiteSearch should call build_search when a Search instance is created."""
        with patch.object(SiteSearch, 'build_search') as mock_method:
            SiteSearch()
            mock_method.assert_called_once_with()

    def test_configures_base_search_with_index(self):
        """SiteSearch should create a Search instance is limited to a particular index."""
        s = SiteSearch()

        self.assertTrue(hasattr(s, '_s'))
        self.assertIsNotNone(s._s.index)

    def test_configures_base_search_with_doc_types(self):
        """SiteSearch should create a Search instance that is aware of doc_types."""
        s = SiteSearch()

        self.assertTrue(hasattr(s, '_s'))
        self.assertIsNotNone(s._s._doc_type)

    def test_creates_project_location_nested_aggregation(self):
        """SiteSearch should have a nested terms aggregation 'project_location', on countries.name"""
        s = SiteSearch()
        aggs_dict = s._s.aggs.to_dict()
        self.assertIsNotNone(aggs_dict)

        agg_label = 'project_location'
        filter_label = '_filter_{}'.format(agg_label)

        agg = aggs_dict['aggs'].get(filter_label, None)
        self.assertIsNotNone(agg)

        self.assertIn('aggs', agg)
        self.assertIn('filter', agg)
        self.assertIn(agg_label, agg['aggs'])
        self.assertIn('nested', agg['aggs'][agg_label])
        self.assertIn('aggs', agg['aggs'][agg_label])

    def test_creates_kind_terms_aggregation(self):
        """SiteSearch should have a non-nested terms aggregation on _meta.model"""
        s = SiteSearch()
        aggs_dict = s._s.aggs.to_dict()
        self.assertIsNotNone(aggs_dict)

        agg_label = '_category'
        filter_label = '_filter_{}'.format(agg_label)

        agg = aggs_dict['aggs'].get(filter_label, None)
        self.assertIsNotNone(agg)

        self.assertIn('aggs', agg)
        self.assertIn('filter', agg)
        self.assertIn(agg_label, agg['aggs'])
        self.assertNotIn('nested', agg['aggs'][agg_label])  # This should not be a nested agg
        self.assertIn('terms', agg['aggs'][agg_label])
        self.assertIn('field', agg['aggs'][agg_label]['terms'])
        self.assertEqual('_meta.model.raw', agg['aggs'][agg_label]['terms']['field'])

    def test_creates_infrastructure_type_nested_aggregation(self):
        """SiteSearch should have a nested terms aggregation on infrastructure_type.name"""
        s = SiteSearch()
        aggs_dict = s._s.aggs.to_dict()
        self.assertIsNotNone(aggs_dict)

        agg_label = 'infrastructure_type'
        filter_label = '_filter_{}'.format(agg_label)

        agg = aggs_dict['aggs'].get(filter_label, None)
        self.assertIsNotNone(agg)

        self.assertIn('aggs', agg)
        self.assertIn('filter', agg)
        self.assertIn(agg_label, agg['aggs'])

    def test_has_highlights(self):
        """SiteSearch should have highlights for matches"""
        s = SiteSearch()

        self.assertIsNotNone(s._s._highlight)
        self.assertIn('*name', s._s._highlight)
        self.assertIn('*.name', s._s._highlight)
        self.assertNotIn('*.name^0.5', s._s._highlight)
        self.assertIn('*_type?', s._s._highlight)
        self.assertIn('title', s._s._highlight)
        self.assertIn('description', s._s._highlight)
        self.assertIn('content', s._s._highlight)

    def test_can_filter_on_kind_aggregation(self):
        """SiteSearch should let us filter on the 'kind' aggregation"""
        s = SiteSearch()
        self.fail()

    def test_can_filter_on_infrastructure_type_aggregation(self):
        """SiteSearch should let us filter on the 'infrastructure_type' aggregation"""
        # FIXME: Since infrastructure_type.name is nested, we'd need to create nested queries for post_filter
        self.fail()

    def test_can_filter_on_countries_aggregation(self):
        """SiteSearch should let us filter on the 'countries' aggregation"""
        self.fail()
