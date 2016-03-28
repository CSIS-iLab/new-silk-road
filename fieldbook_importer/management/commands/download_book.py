from django.core.management.base import BaseCommand, CommandError
from fieldbook import Fieldbook
import os
import json
import time


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('book_id')
        parser.add_argument('outdir', help='Path to directory to save items')
        parser.add_argument('--key')
        parser.add_argument('--secret')
        parser.add_argument('--no-save', action='store_true', default=False)

    def handle(self, *args, **kwargs):
        self.book_id = kwargs.get('book_id')
        self.outdir = kwargs.get('outdir')
        self._key = kwargs.get('key', os.getenv('FIELDBOOK_KEY', None))
        self._secret = kwargs.get('secret', os.getenv('FIELDBOOK_SECRET', None))
        self.verbosity = kwargs.get('verbosity')
        self.no_save = kwargs.get('no_save')

        if not (self._key and self._secret):
            raise CommandError(
                """
You must provide the Fieldbook book's API key and secret, either as option flags or by
setting FIELDBOOK_KEY and FIELDBOOK_SECRET environment variables
                """
            )

        if not os.path.exists(self.outdir):
            raise CommandError("outdir does not exist. Either create the directory or choose an existing one.")

        outpath = os.path.abspath(self.outdir)

        book = Fieldbook(self.book_id, key=self._key, secret=self._secret)

        if self.verbosity > 1:
            self.stdout.write("Fetching sheet names for book {}".format(self.book_id))
        sheet_names = book.sheets()

        for sheet in sheet_names:
            if self.verbosity > 1:
                self.stdout.write("Fetching data for sheet {}".format(sheet))

            data = book.list(sheet)

            outtfile = os.path.join(outpath, "{}.json".format(sheet))
            if not self.no_save:
                if self.verbosity > 1:
                    self.stdout.write("Writing data to {}".format(outtfile))
                json.dump(data, open(outtfile, 'w'), indent=4)
            else:
                self.stdout.write(json.dumps(data))
