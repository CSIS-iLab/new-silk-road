# new-silk-road

This is a Django project for CSIS' *The New Silk Road* project.


## Installation

This is a Django project set up to run as a Procfile-based application. So make you have Python 3, virtualenv and [foreman](http://ddollar.github.io/foreman/) installed. Create a virtualenv for the project, then `pip install -r dev-requirements.txt`. You'll need to create a .env file with values for `SECRET_KEY` and `DATABASE_URL` at a minimum. This project will likely use PostgreSQL-specific features, so you should create a PostgreSQL database.

## Running locally

You can run the various Django management commands via foreman, which will pick up the environment variables in your `.env` file. So to run the development web server, you'd run the command `foreman run python manage.py runserver` from the project directory. `foreman run ./manage.py runserver` should also work.
