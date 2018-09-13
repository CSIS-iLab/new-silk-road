release: python manage.py migrate --noinput
web: SEARCH_SIGNALS=True newrelic-admin run-program gunicorn newsilkroad.wsgi:application
worker: python -u manage.py rqworker default
scheduler: python -u manage.py rqscheduler
