from django.core.management.base import BaseCommand, CommandError

from locations.models import (
    MultiGeometry
)
from infrastructure.models import Project


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', '-n', action='store_true', default=False)

    def handle(self, *args, **kwargs):
        self.dry_run = kwargs.get('dry_run')
        self.verbosity = kwargs.get('verbosity')

        for item in MultiGeometry.objects.all():
            if self.verbosity > 1:
                self.stdout.write("Attempting to match collection '{}'".format(item.label))

            project_candidates = Project.objects.filter(name=item.label)
            matches_count = project_candidates.count()
            if self.verbosity > 1:
                msg = "Matched {} projects".format(matches_count)
                stylefunc = self.style.SUCCESS if matches_count == 1 else self.style.NOTICE
                self.stdout.write(stylefunc(msg))

            if matches_count == 1 and not self.dry_run:
                project = project_candidates.first()
                if not project.geodata:
                    if not self.dry_run:
                        project.geodata = item
                        project.save(update_fields=['geodata'])
                    if self.verbosity > 0:
                        msg = self.style.SUCCESS("Matched geodata '{}' to Project '{}'".format(item, project))
                        self.stdout.write(msg)
                else:
                    msg = self.style.WARNING("'{}' already has associated geodata, skipping".format(project))
                    self.stderr.write(msg)

            if self.verbosity > 0:
                self.stdout.write("")
