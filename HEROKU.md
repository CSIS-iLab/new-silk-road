# Heroku Setup

The staging and production instances of this site are deployed on the [Heroku](https://dashboard.heroku.com/) platform.
Only users which have been granted access to the team can deploy and configure it. This document is aimed at those
users which need to manage the staging and production infrastructure.


## Getting Started

Installing the [Heroku CLI tools](https://devcenter.heroku.com/articles/heroku-cli) is the first step for
managing the Heroku setup. You should follow their instructions for installing on your preferred operating system.
Once installed you can setup the tools by logging in.

```sh
$ heroku login
```

With your authentication established you can setup the git remotes used for the deployments.

```sh
$ heroku git:remote --remote staging --app csis-reconasia-bravo
$ heroku git:remote --remote production --app csis-reconasia-alfa
```

These are one-off setups for new developers joining the project.


## Deployment

Heroku enables easy deployment through pushing to a remote git repository established in the
previous setup. For this project, the staging branch is used for the staging app 
`csis-reconasia-bravo` and the master branch is used for the production app `csis-reconasia-alfa`.
To deploy to either environment, use the appropriate `git push` command:

```sh
$ git push staging staging:master
$ git push production master
```

The deployment will automatically pick up new Python requirements listed in the `requirements.txt`
file, collect any static file changes via `python manage.py collectstatic`, and run the
migrations via `python manage.py migrate --noinput`.

Merging to the staging branch automatically triggers a deploy to `csis-reconasia-bravo` by [Travis CI](https://travis-ci.org/CSIS-iLab/new-silk-road) after the CI passes. The same is true for merging/pusing to the master branch. This will automatically trigger a deploy `csis-reconasia-alfa`. However, you can still deploy manually if needed.


## Managing Services

The staging and production environments have been created and thankfully require very little maintenance but it's worth noting how they are setup in the case that they need to be recreated. There are a number of services which come together for the site to run properly and this section details how they all work together.


### Application Dynos

Heroku runs application processes in dedicated Dynos. They can be sized to meet the scaling/resource requirements. In production, this project runs in three dynos: `web`, `scheduler`, and `worker` as defined in the `Procfile` included in the root of the repository. `web` runs the webserver process. `worker` runs background tasks via [django-qq](https://github.com/ui/django-rq). `scheduler` schedules repeated background tasks to run over the Redis queue.

You can see the applications and their current dynos via:

```sh
$ heroku apps --team csis-ilab
=== Apps in team csis-ilab
chinapower
csis-reconasia-alfa
csis-reconasia-bravo
$ heroku apps:info csis-reconasia-alfa
=== csis-reconasia-alfa
Addons:         bonsai:staging
                heroku-postgresql:standard-0
                memcachier:100
                newrelic:wayne
                papertrail:choklad
                redistogo:micro
Auto Cert Mgmt: false
Dynos:          web: 1, worker: 1, scheduler: 1
Git URL:        https://git.heroku.com/csis-reconasia-alfa.git
Owner:          csis-ilab@herokumanager.com
Pipeline:       csis-reconasia-pipeline - production
Region:         us
Repo Size:      43 MB
Slug Size:      201 MB
Stack:          cedar-14
Web URL:        https://csis-reconasia-alfa.herokuapp.com/
$ heroku ps:scale --app csis-reconasia-alfa
scheduler=1:Standard-1X web=1:Standard-1X worker=1:Standard-1X
```

[ps:scale](https://devcenter.heroku.com/articles/heroku-cli-commands#heroku-dyno-scale) can also be used to adjust the scale of the dynos. This can be used to add more capacity to the site or lowered to reduce cost if the current size is too large for the traffic.


#### Configuration

Applications are configured through environment variables. You can see the current set of configurations for an app via:

```sh
# For staging
$ heroku config --app csis-reconasia-bravo
# For production
$ heroku config --app csis-reconasia-alfa
```

The example output is not included here because it contains a number of values which should be kept secret. Some of these values are set by the Heroku platform add-on and others are set by the development team. Values which need to be configured by the development team include:

- `SECRET_KEY` is a random string which defines the Django setting of the same name.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_STORAGE_BUCKET_NAME` all related to the Amazon S3 API settings used to store the static files and uploaded media for the application.
- `BUILD_WITH_GEO_LIBRARIES` should be turned on to ensure that the GEOS related Python libraries can be compiled.
- `MAPBOX_TOKEN` and `MAPBOX_STYLE_URL` are used for rendering the map with the Mapbox tiles.
- `GOOGLE_ANALYTICS_KEY` is used to enable Google Analytics tracking.
- `MAINTENANCE_MODE` can be enabled to show a maintenance page while the site is temporarily disabled (such as during a long data migration).

These are set with `heroku config:set <KEY>=<VALUE>` such as `heroku config:set SECRET_KEY='thisisverysecretandshouldnotbeshared' --app csis-reconasia-bravo`. Setting/changing these values can trigger an application restart which might result in a small amount of downtime.


#### Maintenance

For the most part the application Dynos don't need much regular maintenance; however, you may find yourself needing to run an occasional one-off command. Using `heroku run` and specifying the app with the `--app` flag, you can run commands inside the Dyno. These are particularly useful for running Django management commands.

```sh
# Example running migrations manually on the staging environment
$ heroku run python manage.py migrate --app csis-reconasia-bravo
```

#### Notifications

Since the deploys are triggered automatically by a push to the staging or master branches, it's helpful to know when those have been completed. The notifications addons have been enabled to notify the team when a deploy is complete.

```sh
$ heroku addons:create deployhooks:email --recipient=reconnecting-asia@caktusgroup.com --subject="{{app}} {{release}} Deployed ({{head}})" --body="{{user}} deployed app to {{url}}" --app csis-reconasia-bravo
$ heroku addons:create deployhooks:email --recipient=reconnecting-asia@caktusgroup.com --subject="{{app}} {{release}} Deployed ({{head}})" --body="{{user}} deployed app to {{url}}" --app csis-reconasia-alfa
```

The recipients, subject, and body can be managed in the [Heroku dashboard](https://dashboard.heroku.com/) under the Deploy Hooks Add On.


### Postgres

PostgreSQL is the chosen database backend for the project and this is enabled on the site using the [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql) addon:

```sh
$ heroku addons:create heroku-postgresql:standard-0 --app csis-reconasia-bravo
$ heroku addons:create heroku-postgresql:standard-0 --app csis-reconasia-alfa
```

This addon adds the `DATABASE_URL` value to the application environment. Postgres is the primary datastore for the Django ORM. Since this is the primary data store, its contents need to be backed up regularly. Thankfully Heroku takes care of most of that automatically.


#### Backups

Heroku can automatically run daily backups, but these do need to be set up manually from time to time. In particular, the schedule will need to be recreated whenever a database is restored from a backup, and sometimes when changing the tier of the server.

To see what time the backups are currently scheduled, run:

```sh
$ heroku pg:backups:schedules --app csis-reconasia-alfa
```

To schedule a backup (in this case, for 2am Eastern Time):

```sh
$ heroku pg:backups:schedule --at '02:00 America/New_York' --app csis-reconasia-alfa
```

Note that only one scheduled backup can exist at a time, so if there is already a scheduled time, this will replace the existing entry.

To see backups that are currently available:

```sh
$ heroku pg:backups --app csis-reconasia-alfa

=== Backups
ID    Created at                 Status                               Size      Database
────  ─────────────────────────  ───────────────────────────────────  ────────  ────────
b016  2016-10-13 15:32:37 +0000  Completed 2016-10-13 15:32:44 +0000  9.59MB    DATABASE
b015  2016-09-19 14:10:03 +0000  Completed 2016-09-19 14:10:17 +0000  9.38MB    DATABASE
b014  2016-08-30 21:39:15 +0000  Completed 2016-08-30 21:39:23 +0000  9.27MB    DATABASE
b013  2016-08-26 21:51:46 +0000  Completed 2016-08-26 21:51:53 +0000  9.20MB    DATABASE
b012  2016-08-22 21:12:30 +0000  Completed 2016-08-22 21:12:36 +0000  9.08MB    DATABASE
```

To restore from a backup (for this example, I'll use the first one listed in the example results above, b016):

```sh
$ heroku pg:backups:restore b016 --app csis-reconasia-alfa
```

Also note that, as mentioned above, the scheduled backup should be set up again after a restore, as it will be dropped.


### Redis

The Redis addon is installed through [Redis To Go](https://elements.heroku.com/addons/redistogo):

```sh
$ heroku addons:create redistogo:nano --app csis-reconasia-bravo
$ heroku addons:create redistogo:micro --app csis-reconasia-alfa
```

This addon adds the `REDISTOGO_URL` value to the application environment. Redis is used by the application to queue background tasks with RQ. The values kept in Redis are ephemeral so there are no backups configured for it.


### Memcached

The Memcached addon is installed through [MemCachier](https://elements.heroku.com/addons/memcachier):

```sh
$ heroku addons:create memcachier:dev --app csis-reconasia-bravo
$ heroku addons:create memcachier:100 --app csis-reconasia-alfa
```

This addon adds `MEMCACHE_SERVERS`, `MEMCACHE_USERNAME`, and `MEMCACHE_PASSWORD` values to the application environment. Memcached is used by the application for Django cache backend. Similar to Redis these values are not critical to backup as they will be repopulated through normal applicaiton usage.


### ElasticSearch

The ElasticSearch addon is installed through [Bonsai](https://elements.heroku.com/addons/bonsai):

```sh
$ heroku addons:create bonsai:sandbox-10 --app csis-reconasia-bravo
$ heroku addons:create bonsai:staging --app csis-reconasia-alfa
```

This addon adds the `BONSAI_URL` value to application environment. The application uses ElasticSearch
to power its full text search results page. The search index is populated from the ORM data and kept up to date with background tasks through RQ. Since this data can be rebuild from the Postgres data, it's not important to keep a backup.

To re-index the existing model data, you can use the `rebuild_index` management command:

```sh
$ heroku run python manage.py rebuild_index --app csis-reconasia-alfa
```

This is important to do any time the index configuration is changed or when restoring the DB from a backup.


### PaperTrail

The [PaperTrail addon](https://elements.heroku.com/addons/papertrail) adds centralized logging, log backups, and alerts to the application.

```sh
$ heroku addons:create papertrail:choklad --app csis-reconasia-bravo
$ heroku addons:create papertrail:choklad --app csis-reconasia-alfa
```

Alerts are configured to search for errors generated by application and email the Heroku team. Additional searches can be saved to generate alerts through the Papertrail dashboard.
