import csv
import logging
import os

from django.db import transaction
from django.conf import settings
from django.core.management.base import BaseCommand

from infrastructure.models import PowerPlant


logger = logging.getLogger('power_plant_import')


def load_costs(row):
    if row.get('Type') != 'Plant':
        return
    name = row.get('Power Plant Name')
    try:
        pp = PowerPlant.objects.get(name=name)
    except PowerPlant.DoesNotExist:
        logger.debug("{} does not exist, skipping".format(name))
        return
    total_cost = row.get('Total Cost')
    total_cost_currency = row.get('Total Cost Currency')
    if total_cost:
        logger.info("Updating {} with cost {} {}".format(name, total_cost,
                                                         total_cost_currency))
        pp.total_cost = total_cost
        pp.total_cost_currency = total_cost_currency
        pp.save()


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        logger.info('Updating power plant costs')
        csv_path = os.path.join(settings.BASE_DIR,
                                'power_plant_import/tests/data/full_csv.csv')
        with open(csv_path, 'r') as csv_file:
            reader = csv.DictReader(csv_file)
            with transaction.atomic():
                for row in reader:
                    load_costs(row)
        logger.info('Update complete')
