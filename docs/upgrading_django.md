Upgrading to a newer version of Django
======================================

It is important to do periodic upgrades of Django to stay up to date with bug fixes, security updates, and get access to new features from newer versions. This document outlines best practices for upgrading to a newer version of Django.

When to do upgrades
-------------------
The best strategy for doing upgrades is to stay up to date with the most recent version(s), and to update often. When making frequent upgrades, each update tends to be relatively quick and pain free; trying to make a huge update tends to be less enjoyable.
For Django's release plan on new versions, check out https://www.djangoproject.com/weblog/2015/jun/25/roadmap/.

Steps
-----
We've outlined some steps that have been helpful for us when upgrading Django. You're also welcome to check out Django's docs on upgrading to a newer version https://docs.djangoproject.com/en/dev/howto/upgrade-version/.

1. Check out the release notes for the newer version. For instance, the release notes for Django2.0 can be found here: https://docs.djangoproject.com/en/dev/releases/2.0/. If there is anything from the notes that clearly needs to be updated (a certain function is deprecated, etc.), make those updates to the code. Don't worry about catching everything (sometimes there's not anything that sticks out from the notes).

2. Determine if our code generates any deprecation warnings by running the test suite. Use the `-W` command line argument to show the deprecation warnings. Adding `once` after `-W` will only show the first occurrence of each warning in order to make seeing the warnings more manageable:

   `heroku local:run python -Wonce manage.py test`

   A deprecation warning will look like:

   ```/.../lib/python3.5/site-packages/easy_thumbnails/migrations/0001_initial.py:34: RemovedInDjango20Warning: on_delete will be a required arg for ForeignKey in Django 2.0. Set it to models.CASCADE on models and in existing migrations if you want to maintain the current default behavior. See https://docs.djangoproject.com/en/1.10/ref/models/fields/#django.db.models.ForeignKey.on_delete```

3. If our code has deprecation warnings, then make the changes there. If one of our dependencies has deprecation warnings, then look into whether a newer version of the dependency is available, and try to upgrade that first. It may be helpful to make a few or just 1 change at a time, rather than trying to do everything at once. Assuming that thorough tests have been written for our application, feel free to run the test suite after each set of changes to make sure that everything still runs. Sometimes things will break unexpectedly and you will need to determine why. Googling the error messages is oftentimes helpful in such a situation.

   Note: if you upgrade a dependency, make sure you update requirements.txt with the newer version of the dependency, as well as newer versions of sub-dependencies. For example, if you update the `celery` dependency, and this upgrade also upgrades the `pytz` sub-dependency, then pin down both the `celery` version and the `pytz` version in the requirements.txt file.

   It may also be a good idea to review our dependencies even if they don't generate deprecation warnings. Feel free to upgrade dependencies to newer versions and to run the test suite to make sure the upgrade didn't break anything, and make sure to update the version number in requirements.txt. You can see which dependencies have updates available by running:

   ```pip list --outdated```

   and see the same list in a column format with:

   ```pip list --outdated --format=columns```

4. Once all of the deprecation warnings have been resolved, update requirements.txt with the new version of Django and run `pip install -r requirements.txt`.

5. Try to run the server locally with `heroku local:run python manage.py runserver`, and navigate to the site locally. If something is broken, look into fixing it.

6. Once everything seems to run locally, run the test suite and make sure all of the tests pass. If something is broken, look into fixing it.

   Note: sometimes you may need to fix the test, rather than the code itself, especially if something works on your local version of the site, but fails in the tests. The tests are always supposed to look like the real environment, rather than the other way around.

7. Make a pull request with your changes and ask another developer to review them. It is always important to have others review our work to make sure we have done it correctly and thoroughly.

8. Deploy the code to the staging server and verify that everything works as it should.
