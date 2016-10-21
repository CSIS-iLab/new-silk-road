web: SEARCH_SIGNALS=True waitress-serve --port=$PORT newsilkroad.wsgi:application
worker: python -u manage.py rqworker default
scheduler: python -u manage.py rqscheduler
