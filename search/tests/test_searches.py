from unittest.mock import Mock
from django.test import SimpleTestCase, override_settings
from search.searches import SiteSearch
from .settings import TEST_SEARCH


@override_settings(SEARCH=TEST_SEARCH)
class SiteSearchTestCase(SimpleTestCase):
    """Test SiteSearch creates valid searches for ElasticSearch"""
    # NOTE: SiteSearch is a specific search implementation. Should eventually be derived from a reusable base class

    def test_constructor_builds_search(self):
        """SiteSearch should call build_search when a Search instance is created."""
        SiteSearch.build_search = Mock()
        s = SiteSearch()
        s.build_search.assert_called_once_with()

    def test_configures_base_search_with_index(self):
        """SiteSearch should create a Search instance is limited to a particular index."""
        s = SiteSearch()

        self.assertTrue(hasattr(s, '_s'))
        self.assertIsNotNone(s._s.index)

    def test_configures_base_search_with_doc_types(self):
        """SiteSearch should create a Search instance that is aware of doc_types."""
        self.fail()

    def test_creates_countries_nested_aggregation(self):
        """SiteSearch should have a nested terms aggregation on countries.name"""
        self.fail()

    def test_creates_kind_terms_aggregation(self):
        """SiteSearch should have a non-nested terms aggregation on _meta.model"""
        self.fail()

    def test_creates_infrastructure_type_nested_aggregation(self):
        """SiteSearch should have a nested terms aggregation on infrastructure_type.name"""
        self.fail()

    def test_has_highlights(self):
        """SiteSearch should have highlights for matches"""
        self.fail()

    def test_can_filter_on_kind_aggregation(self):
        """SiteSearch should let us filter on the 'kind' aggregation"""
        self.fail()

    def test_can_filter_on_infrastructure_type_aggregation(self):
        """SiteSearch should let us filter on the 'infrastructure_type' aggregation"""
        self.fail()

    def test_can_filter_on_countries_aggregation(self):
        """SiteSearch should let us filter on the 'countries' aggregation"""
        self.fail()
