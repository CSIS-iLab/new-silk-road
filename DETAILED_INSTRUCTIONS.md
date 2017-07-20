# Detailed Instructions

These are detailed for setting up the project and it's dependencies. Unlike the [README.md](README.md), this guide does not assume you have Python, PostreSQL, Elasticsearch, or any of the other requirements installed. It does assume you are comfortable with the command line.

When you see a `$` followed by a space then some other words, i.e. `$ brew install python3`, that means this should be run on the command line. You don't type the `$`.

# Part 1a: Transform your computer into a developer's machine (macOS)

This section covers installing a number of tools commonly used by web and application developers, with a focus on macOS. This section involves a number of steps, but those steps should only need to be performed once per machine. After you've installed these tools, you may update them occasionally. If you are using a Linux based operating system then you should skip this section and follow the direction in the follow section on setup for Debian/Ubuntu based distributions.

## Install a Homebrew, package manager

If you are running macOS, you should use [Homebrew](http://brew.sh), a package manager. It's like the App Store, but for developer tools! First, you'll need to run `$ xcode-select --install` to get Apple's set of developer tools, which Homebrew needs. Next, go to <http://brew.sh> and follow the instructions for installing Homebrew.

Once you have Homebrew installed, you can run `$ brew help` to get some hints about ways you can use homebrew.

## Install developer software with Homebrew

Though macOS comes with Python pre-installed (try running `$ python --version` on the command line if you don't believe me), you should install the latest version of Python using homebrew. We'll also need PostgreSQL, and a number of other packages.

### Essentials

There are a lot of software packages used in developing websites: the following are essential to this website. To get started with the essentials, run:

```sh
$ brew install python3 node postgresql postgis heroku
```

What is all that, you ask? Well, `brew install` was telling Homebrew we want to install some things, and everything after that is a software package. `python3` and `node` are for running code Python and JavaScript code on your computer. Python runs the server-side code that interacts with the database, generates HTML pages, etc. Node is used to compile CSS files from Sass and JavaScript from, well, other JavaScript.

Next in that list is `postgresql` and `postgis`. PostgreSQL is a database program, and PostGIS adds geospatial capabilities to PostgreSQL. We'll use those to run a local copy of the database.

`heroku` is both the name for a [platform for hosting websites](https://heroku.com) and the command line tool used for managing applications and running things on our local computers similar to how it would be run on Heroku's hosting platform. To start, we'll mainly type `heroku local:run` in front of commands we want to run, for reasons that will become clear later.

### Search, Caching, and related packages

Without the packages listed below, you will not be able all parts of the website, such as the search engine. You may not need to work with those parts, but if you do, you'll need to install additional software:

```sh
$ brew install redis elasticsearch memcached libmemcached
```

`elasticsearch` is software for a search database. Basically, information gets copied from the PostgreSQL database and transformed into a format optimized for searchability.

To run it on your machine you may run the following command:

```sh
$ elasticsearch
```

or to run it in the background, add a `-d` flag:

```sh
elasticsearch -d
```

`memcached` is a program that stores things in computer's memory for fast retrieval. The live website caches pages and other pieces of information to give the website a speed boost. We may turn this feature on or off in development for testing purposes. `libmemcached` is a helper library used to help Django communicate with memcached.

`redis` is a database of sorts, and is used in the code for storing and running automated tasks, such as rebuilding the Elasticsearch database from the PostgreSQL database. You probably don't need this unless you are writing and testing automated tasks.

### Version control

If you have Github.app installed, you probably don't need to install `git`, but you may want to in the future. Github.app provides a limited interface to `git`, and someday you'll want the power and flexibility that `git` provides.

There is a version that comes with MacOS, and Github.app installs a version as well, but you can:

```sh
$ brew install git
```

## Set up Python3 virtual environments

Now you can install python packages (yes, packages written in and for python projects). When you ran `$ brew install python3`, it installed a few command-line programs. One is `python3`, so if you run `$ python3 --version` you should get something like `Python 3.5.2` in return. You also get `pip3`, the python package installer. This will help you install python-specific packages.

macOS comes with an older version of Python installed, but `python3` should point to the version you installed via homebrew. If you run `$ which python3`, it should print out `/usr/local/bin/python3`. You *could* also install a Homebrew version of python2, but we won't get into that because it doesn't matter for our

Since you will someday be working on many python projects and need to keep the packages for one project separate from the packages for another project, you'll want two handy tools: `virtualenv` and `virtualenvwrapper`. There's a [good explanation of those tools](http://docs.python-guide.org/en/latest/dev/virtualenvs/) in the ["The Hitchhiker’s Guide to Python"](http://docs.python-guide.org/en/latest/). Go and [read about virtual environments](http://docs.python-guide.org/en/latest/dev/virtualenvs/) now. I'll wait.

Basically you need to run `$ pip3 install virtualenv`. If you're comfortable creating or editing your `.bashrc`, you can also `$ pip3 install virtualenvwrapper` and [add the proper entries](https://virtualenvwrapper.readthedocs.io/en/latest/install.html#shell-startup-file) to your `.bashrc`.

# Part 1b: Transform your computer into a developer's machine (Debian/Ubuntu)

This section details the setup of some of the primary tools required for setting up your development machine for Linux with the assumption of using a Debian/Ubuntu based system. If you are using a different Linux distribution, these steps should be roughly the same changing out the appropriate package manager commands and package names. If you followed the previous section for your macOS system then you should skip this section and continue to part 2.

## Version control

This project requires using `git` and if you don't currently have it installed you should install it with `apt`:

```sh
$ sudo apt-get install git
```

## Python Essentials

This project uses Python 3.5 which ships by default on Ubuntu 16.04 and Debian testing. In addition to the base installation, you should ensure you have the development headers to build some of the Python requirements from source:

```sh
$ sudo apt-get install python3.5 python3.5-dev python-pip build-essential libjpeg8 libjpeg8-dev libfreetype6 libfreetype6-dev zlib1g zlib1g-dev libxml2-dev libxslt1-dev ghostscript libffi-dev
```

With those installed you should also install `virtualenv` and `virtualenvwrapper` using `pip`:

```sh
$ sudo pip install virtualenv virtualenvwrapper
```

This will be used later to create an isolated Python environment for the development of the project.

## Search, Caching, and related packages

This project uses Postgres, Memcached, Redis, and ElasticSearch for DB storage, caching, background queuing, and search respectively. With the exception of ElasticSearch, you can use the OS provided versions of these services installable via `apt`:

```sh
$ sudo apt-get install postgresql postgis postgresql-contrib postgresql-server-dev postgresql-client libpq-dev redis-server memcached libmemcached-dev
```

It can be helpful to create a superuser matching your current local user so that you can access the server using ident authentication:

```sh
$ sudo -u postgres createuser --superuser $USER
```

ElasticSearch can be installed using either a `.deb` file or from a repository following the directions provided by [elastic](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html):

```sh
$ wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
$ sudo apt-get install apt-transport-https
$ echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-5.x.list
$ sudo apt-get update && sudo apt-get install elasticsearch
$ sudo /bin/systemctl daemon-reload
$ sudo /bin/systemctl enable elasticsearch.service
```

# Part 2: Setting up the website

## "Clone" the code repository

If you're using Github.app, you can follow [their instructions](https://help.github.com/desktop/guides/contributing/cloning-a-repository-from-github-to-github-desktop/) for cloning the CSIS-iLab/new-silk-road code repository. If you use the command line git tool, you can follow [Github's instructions for that process](https://help.github.com/articles/cloning-a-repository/).

## Changing the working directory on the command line.

Once you've cloned the repository, you'll want to change your current working directory to that of the code repository. It's like opening a folder in the Finder, but you are telling the command line that you are working out of this folder/directory. You'd run something similar to:

```sh
$ cd /Users/<username>/projects/new-silk-road
```

`cd` is the command to change the directory and `/Users/<username>/projects/new-silk-road` is a (fake) path to where the cloned repository might be. The path depends on your username on the computer and where you stored the repository, so it won't match that example.

On macOS, you can actually drag a folder from the Finder onto your command line in Terminal and it print out the path! So you can type `cd ` then drag the folder onto the Terminal and you should get the correct path. Do that, hit return and your working directory should be the project's directory.

Any time you aren't sure which directory you is your present working directory, you can run `$ pwd` and it will print it out.

## Create a virtual environment for the website

If you've read the [Virtual Environments chapter](http://docs.python-guide.org/en/latest/dev/virtualenvs/) in ["The Hitchhiker’s Guide to Python"](http://docs.python-guide.org/en/latest/), so you know that:

> A Virtual Environment is a tool to keep the dependencies required by different projects in separate places, by creating virtual Python environments for them. It solves the “Project X depends on version 1.x but, Project Y needs 4.x” dilemma, and keeps your global site-packages directory clean and manageable.

This may be the first project you're running that uses Python, but let's assume it won't be the only or last. So let's keep our dependencies organized neatly using virtual environments.

You don't want to create your virtual environment folder inside the project folder because you don't want to accidentally commit your environment to Github.

If you have `virtualenvwrapper` set up, it should manage this for you. Run:

```sh
# macOS
$ mkvirtualenv -p python3 reconasia
# Linux
$ mkvirtualenv -p `which python3.5` reconasia
```


That should create a folder named "reconasia" in the directory specified by `$WORKON_HOME`. When you want to work on the project, you'll run `$ workon reconasia` to activate that environment.

If you *don't* have `virtualenvwrapper` set up, you'll want to run something like (assuming you have a 'virtualenvs' directory/folder already created in your home directory):

```sh
$ virtualenv -p python3 ~/virtualenvs/reconasia
```

You'll need to run `$ source ~/virtualenvs/reconasia` to activate that environment in the command line before you start working on the project.

## Install stuff into the virtual environment

Once you have your virtual environment created and activated, you can install the packages this project needs by running the following command from the project directory:

```sh
# macOS
$ CFLAGS=-I$(brew --prefix)/include LDFLAGS=-L$(brew --prefix)/lib pip install -r dev-requirements.txt
# Linux
$ pip install -r dev-requirements.txt
```

If it weren't for the django-pylibmc package, you could run `$ pip install -r dev-requirements.txt` but it needs `CFLAGS=-I$(brew --prefix)/include LDFLAGS=-L$(brew --prefix)/lib` to compile.

You should see a bunch of lines appear in your terminal in a fairly rapid manner, which indicates that pip is fetching packages from the internet and installing them into your virtual environment. This may take a few minutes. When it's done, you should have almost enough to get started.

The command above tells `pip` to look at the `dev-requirements.txt` file and install the packages listed. If you open `dev-requirements.txt`, you'll see it has a line `- requirements.txt` which tells pip to also look in `requirements.txt` for packages to install.

Notice we used `pip` rather than `pip3`. That's because with our virtual environment activated, `pip` is a copy of the tool installed in our virtual environment.


## Set up the database

You could have done this before setting up Python, but this part should be relatively easy. Since the project uses a database for many pages, you should create a local copy. To create a totally empty PostgreSQL database on your computer, run:

```sh
$ createdb reconasia
```

Installing the [Heroku CLI tools](https://devcenter.heroku.com/articles/heroku-cli) can allow you to retrieve a copy of the current staging or production databases.
You can see the available DB snapshots via:

```sh
# For staging
$ heroku pg:backups --app csis-reconasia-bravo
# For production
$ heroku pg:backups --app csis-reconasia-alfa
```

You can download an existing backup by referencing its ID, listed in the first column of the output under "Backups".
If there are no existing backups then you should create a new one. This can be done via:

```sh
# For staging
$ heroku pg:backups:capture --app csis-reconasia-bravo
# For production
$ heroku pg:backups:capture --app csis-reconasia-alfa
```

Once you know the ID of the backup you would like to use then you can download it. This example
command downloads the backup with the ID `b002`:

```sh
# For staging
$ heroku pg:backups:download b002 --app csis-reconasia-bravo
# For production
$ heroku pg:backups:download b002 --app csis-reconasia-alfa
```

The `b002` reference in the above command would be replaced by the desired ID.
This will create a new file named `latest.dump` which can be used to restore the database locally.

```sh
$ createdb reconasia
$ pg_restore --clean --no-owner --dbname=reconasia latest.dump
```

The parts with the two hyphens are options that affect the behavior of `pg_restore`. The `--clean` options tell `pg_dump` to clear any existing data, for example.

Notes: If you already had this db present, you may see some errors after running this command, but everything should be in working order. If it doesn't seem to work, try deleting your existing db with `$ dropdb reconasia` and run the above commands again. Also, if your local code has migrations that have not been deployed to the system you are restoring the db from, you may need to run migrations as follows:

```sh
$ heroku local:run python manage.py migrate
```

If you ever need to destroy the database on your local machine, you can run `$ dropdb reconasia`.

More information on the automated DB backups is described in [our Heroku setup](HEROKU.md) documentation.

## Configure the application

At this point, we have the various software and python package dependencies installed, so we are close to being able to run the website locally. If you want to see some errors about things like `SECRET_KEY` not being set, you can run `$ heroku local:run python manage.py check`. The command tried to load configuration settings so that our Django-powered website could run, but we haven't created the configuration file.

We need to create a file named `.env` in our current working directory. This file is special in a few ways. One thing that makes this file special is the period in the beginning of the file name. That means this file won't be visible in the macOS Finder. This may make the file invisible to some programs, but respectable code editors like [Sublime Text](https://www.sublimetext.com) and [Atom](https://atom.io) will see it if you open the folder/directory containing it.

Another thing that is special about `.env` is that the `heroku` command line tool reads configuration options and makes it available to "environment" python will run in. You can read about [Heroku Local and environment variables](https://devcenter.heroku.com/articles/heroku-local#set-up-your-local-environment-variables), but essentially this file allows us to separate configuration details that change based on where the application is running (your computer vs the production website vs my computer, etc.).

You can run `$ touch .env` if you want to create the file on the command line, but you can also create it using a code editor. Once it is, you'll need to add things to it. Start by copying and pasting:

```env
SECRET_KEY="a-bad-secret-key"
DEBUG=True
DEBUG_STATIC=True
#DEBUG_TOOLBAR=True
# MAINTENANCE_MODE=False
DATABASE_URL=postgres://localhost/reconasia
# ELASTICSEARCH_URL=
MEMCACHEIFY_USE_LOCAL=True
DISABLE_CACHE=True
# Mapbox
MAPBOX_TOKEN=
MAPBOX_STYLE_URL=
# S3
AWS_STORAGE_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

Those keys (`SECRET_KEY`, `DEBUG`, etc.) represent configuration settings that Django needs. If you open `newsilkroad/settings.py`, you'll see various places lines that have something like `os.getenv('SECRET_KEY', None)`. That's python code that says "Go get the value for 'SECRET_KEY' from the environment." You can search for 'os.getenv' and find the various configurable settings.

Right now, this env file is missing values for a number of keys. Anywhere you see an `=` with nothing to the right of it, the value is missing. So `MAPBOX_TOKEN=` and `MAPBOX_STYLE_URL=` are missing values. As you might guess, this means the map page might not work on the local version of your site. The keys starting with `AWS_` have to do with file uploads to Amazon's S3 simple file hosting service. So you can't test uploading files.

`SECRET_KEY` is a [Django setting](https://docs.djangoproject.com/en/1.10/ref/settings/#std:setting-SECRET_KEY) and is used for ["Cryptographic signing"](https://docs.djangoproject.com/en/1.10/topics/signing/). It's about website security, so "a-bad-secret-key" is a bad secret key that should **never** be used for a website accessible to the public.

The setting `DATABASE_URL=postgres://localhost/reconasia` may be fine for your local environment if you have PostgreSQL installed and a database created named 'reconasia'. `postgres://localhost/reconasia` is a URL for configuring a connection to a postgres database. In production the URL will include things like a username and password, but we don't need that for developing locally.

For Linux you may want to change this to `DATABASE_URL=postgres:///reconasia` to connect over the Unix socket instead particular if you are using ident auth as previously described.

`DEBUG` and `DEBUG_STATIC` control how the Django website behaves, particularly when there are errors. Having these set to `True` (with a capital T) is useful for developing locally because you get more information about the errors.

The `DEBUG_TOOLBAR` setting enables the use of [django-debug-toolbar](https://django-debug-toolbar.readthedocs.io/en/stable/), a popular Django app for debugging sites particularly for tracing performance issues. It's installed by default in the dev requirements. This should not be enabled in any live/public environment.

When you see a # symbol, that indicates the start of a comment, which is not processed as an environment variable. If a line begins with a #, that entire line is a treated as a comment. So `# ELASTICSEARCH_URL=` is a comment, despite the `KEY=` syntax. You can comment and uncomment various lines to change which settings are processed as an environment variable. So if you aren't using Elasticsearch to test the search, you can put a # in front on `ELASTICSEARCH_URL=http://localhost:9200`.

## Run migrations

You may need to run some database migrations at this point. Migrations update the database with any new model changes since your database was created. So, if your db_archive.tar is from a few months ago, there may be some updates that need to occur. To read more about migrations, see https://docs.djangoproject.com/en/dev/topics/migrations/. To run the migrations:

```sh
$ heroku local:run python manage.py migrate
```

## Run the application

Now that you've created the `.env` file you can cross your fingers and run:

```sh
$ heroku local:run python manage.py runserver
```

If everything was installed and configured successfully, you should see something like:

```
[OKAY] Loaded ENV .env File as KEY=VALUE Format
Performing system checks...

System check identified no issues (0 silenced).

November 17, 2016 - 12:36:19
Django version 1.9.9, using settings 'newsilkroad.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

That means you can open <http://127.0.0.1:8000/> (or <http://localhost:8000/>, both are "addresses" for your computer) in a web browser and you should see your local copy of the website up and running!

Note that any Django commands will need to be run with heroku or foreman, so that the environment variables in the `.env` file can be picked up. For example, to open a shell, you will need to run `heroku local:run python manage.py shell`, rather than just `python manage.py shell`.

## Working on JavaScript and Sass/CSS: Use Node

Since [Node](https://nodejs.org/) has its own ecosystem of tools oriented toward front-end web development, this project includes a `package.json` and `gulpfile.babel.js`. If you plan to write Sass/CSS or JavaScript, you should install the required tools:

```sh
$ npm install
```

`npm` will look at the `package.json` and install the tools for writing JavaScript using ES6 and React, and Sass. You will also want to install the [Gulp](http://gulpjs.com) command line client "globally" by running:

```sh
npm install --global gulp-cli
```

Once that's done, you can run the various tasks defined in `gulpfile.babel.js`. Some are Sass-related, some are JavaScript-related, and there is one task for optimizing svg files from website/assets/svg and copying them into website/static/img.

### Running a Sass dev server

If you want to run the website and edit the Sass styles (\*.scss files) with a live preview, you can open two terminal windows/tabs and run one command in each. The first starts the website at <http://127.0.0.1:8000/> and handle serving the database-driven HTML pages:

```sh
$ heroku local:run python manage.py runserver
```

The following will start watching the Sass files for changes and update the resulting CSS. It runs a webserver on <http://127.0.0.1:3000/> (note the different port: 3000, rather than 8000) that live updates the stylesheets as you edit them, and it proxies HTML page requests to the other webserver (running on port 8000):

```sh
$ gulp watch
```

So if you have both running, you can access <http://127.0.0.1:3000/> or <http://localhost:3000/> to see styles update moments after you edit and save the Sass files.


## Running the tests

This project has a number of tests in order to verify that the code runs as expected.
While developing, you should add tests for the code you contribute, and may run the
tests by:

```sh
$ heroku local:run python manage.py tests
```

Note: Since some of the tests rely on elasticsearch, make sure that is is running on
your machine. Refer to the section above on elasticsearch for more information.
