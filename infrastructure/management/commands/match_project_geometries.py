from django.core.management.base import BaseCommand

from locations.models import (
    GeometryStore
)
from infrastructure.models import Project


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)

    def handle(self, *args, **kwargs):
        self.dry_run = kwargs.get('dry_run')
        self.verbosity = kwargs.get('verbosity')

        for item in GeometryStore.objects.all():
            if not item.label:
                self.stderr(self.style.WARNING("Geometry {} has no 'name' attribute to match on".format(str(item.identifier))))
            else:
                geom_name = item.label
                if self.verbosity > 1:
                    self.stdout.write("Attempting to match collection '{}' using name '{}'".format(item.identifier, geom_name))

                project_candidates = Project.objects.filter(name__icontains=geom_name.strip())
                matches_count = project_candidates.count()
                if self.verbosity > 1:
                    msg = "Matched {} projects".format(matches_count)
                    stylefunc = self.style.SUCCESS if matches_count == 1 else self.style.NOTICE
                    self.stdout.write(stylefunc(msg))

                if matches_count == 1 and not self.dry_run:
                    project = project_candidates.first()
                    if not project.geo:
                        if not self.dry_run:
                            project.geo = item
                            project.save(update_fields=['geo'])
                        if self.verbosity > 0:
                            msg = self.style.SUCCESS("Matched GeometryStore '{}' to Project '{}'".format(item, project))
                            self.stdout.write(msg)
                    else:
                        msg = self.style.WARNING("'{}' already has associated geodata, skipping".format(project))
                        self.stderr.write(msg)

                if self.verbosity > 0:
                    self.stdout.write("")
