import os


TEST_SEARCH = {
    'default': {
        'index': 'test_reconnectingasia',
        'doc_types': ('search.tests.mocks.MockDocOne', 'search.tests.mocks.MockDocTwo',),
        'connections': {
            'hosts': [os.getenv('ELASTICSEARCH_TEST_URL', 'http://localhost:9200')],
            'timeout': 20,
        }
    }
}
