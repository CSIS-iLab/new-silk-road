# Reconnecting Asia

This is a Django project for CSIS' *Reconnecting Asia* project.


## Getting Started

This is a Django project set up to run as a Procfile-based application. Make sure you have Python 3, virtualenv and [foreman](http://ddollar.github.io/foreman/) installed.

Create a virtualenv for the project, then `pip install -r dev-requirements.txt`.

You'll need to create a .env file with values for `SECRET_KEY` and `DATABASE_URL`, as well a few others; look in `newsilkroad/settings.py` for lines that have `os.getenv` for other environment variables. You'll probably want to set `DEBUG=True` in development.

If you want to test file handling, you'll need to set the various AWS settings for a test bucket.


### Dependencies

Make sure you have the following dependencies installed:

- PostgreSQL
- PostGIS
- Memcached (caching)
- Elasticsearch (search)

### Get it running

First make sure you're virtualenv is activated, then run `foreman run python manage.py check` to check for any issues.

Either get a copy of an existing database or run `foreman run python manage.py migrate` to create the tables in a new database.

At this point, you should be able to `foreman run python manage.py runserver` to get the Django development server running at <http://localhost:8000/>.

### Note on django-extensions, graphviz and pygraphviz

On an OS X running homebrew, if you want to compile pygraphviz for use with django-extensions, you need to `brew install graphviz --with-bindings` first, and then in your virtualenv, set `CFLAGS` and `LDFLAGS`, per [Homebrew's recommendations](https://github.com/Homebrew/homebrew/blob/master/share/doc/homebrew/Homebrew-and-Python.md#brewed-python-modules).

```
CFLAGS=-I$(brew --prefix)/include LDFLAGS=-L$(brew --prefix)/lib pip install pygraphviz
```

## Running locally

You can run the various Django management commands via foreman, which will pick up the environment variables in your `.env` file. So to run the development web server, you'd run the command `foreman run python manage.py runserver` from the project directory. `foreman run ./manage.py runserver` should also work.
