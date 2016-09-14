import os


TEST_SEARCH = {
    'default': {
        'index': 'test_reconnectingasia',
        'serializers': (
            'search.tests.mocks.MockSerializer',
            'search.tests.mocks.MockSerializerTwo',
            'search.tests.mocks.MockSerializerThree',
        ),
        'connections': {
            'hosts': [os.getenv('ELASTICSEARCH_TEST_URL', 'http://localhost:9200')],
            'timeout': 20,
        }
    }
}

TEST_RQ_QUEUES = {
    'default': {
        'URL': os.getenv('REDISTOGO_URL', 'redis://localhost:6379/0'),
        'ASYNC': False,
    },
}
