# Reconnecting Asia

This is a Django project for CSIS' *Reconnecting Asia* project.


## Getting Started

This is a Django project set up to run as a Procfile-based application. At a minimum, make sure you have Python 3, PostgreSQL, virtualenv and [heroku](https://devcenter.heroku.com/articles/heroku-local) or [foreman](http://ddollar.github.io/foreman/) installed. Elasticsearch, Memcached, and Redis are required for advanced features, such as search and caching. For a more detailed explanation, see [DETAILED_INSTRUCTIONS.md](DETAILED_INSTRUCTIONS.md).

Create a virtualenv for the project, then `pip install -r dev-requirements.txt`.

You'll need to create a `.env` file with values for `SECRET_KEY` and `DATABASE_URL`, as well a few others; look in `newsilkroad/settings.py` for lines that have `os.getenv` for other environment variables. You'll probably want to set `DEBUG=True` in development.

If you want to test file handling, you'll need to set the various AWS settings for a test bucket.

If you want to develop Sass/CSS or JavaScript, you should also (have node installed and then) run `npm i` so you get all of the build dependencies for running the Gulp build commands. See `gulpfile.js` and `package.json` for more info.

### Dependencies

Make sure you have the following dependencies installed:

- PostgreSQL
- PostGIS
- Memcached (caching)
- Elasticsearch (search)

### Get it running

First make sure you're virtualenv is activated, then run `heroku local:run python manage.py check` to check for any issues.

Either get a copy of an existing database or run `heroku local:run python manage.py migrate` to create the tables in a new database.

At this point, you should be able to `heroku local:run python manage.py runserver` to get the Django development server running at <http://localhost:8000/>.

### Note on django-extensions, graphviz and pygraphviz

On an OS X running homebrew, if you want to compile pygraphviz for use with django-extensions, you need to `brew install graphviz --with-bindings` first, and then in your virtualenv, set `CFLAGS` and `LDFLAGS`, per [Homebrew's recommendations](https://github.com/Homebrew/homebrew/blob/master/share/doc/homebrew/Homebrew-and-Python.md#brewed-python-modules).

```
CFLAGS=-I$(brew --prefix)/include LDFLAGS=-L$(brew --prefix)/lib pip install pygraphviz
```

## Running locally

You can run the various Django management commands via `heroku local:run` or foreman, which will pick up the environment variables in your `.env` file. So to run the development web server, you'd run the command ` heroku local:run python manage.py runserver` from the project directory. ` heroku local:run ./manage.py runserver` should also work.


## Running tests

You can run tests locally with the following command:

```
heroku local:run python manange.py tests
```

For more detailed instrutions, refer to the [DETAILED_INSTRUCTIONS.md](DETAILED_INSTRUCTIONS.md).
