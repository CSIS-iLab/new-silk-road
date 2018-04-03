import argparse
import json

from django.apps import apps
from django.core.management.base import BaseCommand, CommandError

from utilities.string import clean_string


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            'matchfile', type=argparse.FileType('r'),
            help='A JSON array of objects with fields fo both project and initiative names'
        )
        parser.add_argument('--project-field', default='project_title')
        parser.add_argument('--initiative-field', default='initiative_name')

    def handle(self, *args, **kwargs):
        project_field = kwargs.get('project_field')
        initiative_field = kwargs.get('initiative_field')
        filename = kwargs.get('matchfile')

        Project = apps.get_model("infrastructure", "Project")
        Initiative = apps.get_model("infrastructure", "Initiative")

        try:
            data = json.load(filename)
        except json.decoder.JSONDecodeError as e:
            raise CommandError(e)

        for item in data:
            proj_name = clean_string(item.get(project_field, None))
            init_name = clean_string(item.get(initiative_field, None))
            if proj_name and init_name:
                self.stdout.write('Looking up "{}" for "{}"'.format(proj_name, init_name))
                proj = None
                try:
                    proj = Project.objects.get(name=proj_name)
                except Exception as e:
                    self.stderr.write(str(e))
                if proj:
                    self.stdout.write('Found "{}"'.format(proj.name))
                    init = None
                    try:
                        init = Initiative.objects.get(name=init_name)
                    except Exception as e:
                        self.stderr.write(str(e))
                    if init:
                        self.stdout.write('Found "{}", adding to "{}"'.format(init.name, proj.name))
                        if not proj.initiatives.filter(id__contains=init.id).exists():
                            proj.initiatives.add(init)
                            self.stderr.write(self.style.SUCCESS('Matched!'))
                        else:
                            self.stderr.write(self.style.WARNING('Project already associated with initiative'))
                self.stdout.write("---")
