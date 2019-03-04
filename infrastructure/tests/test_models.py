from django.core.urlresolvers import reverse
from django.test import TestCase

from . import factories
from infrastructure import models


class InfrastructureTypeTestCase(TestCase):
    def test_str(self):
        """String representation of an InfrastructureType uses the name."""
        infrastructure_type = factories.InfrastructureTypeFactory()
        self.assertEqual(str(infrastructure_type), infrastructure_type.name)


class OwnerStakeTestCase(TestCase):
    def test_str(self):
        """String representation of an OwnerStake uses the owner and PowerPlant."""
        owner_stake = factories.PlantOwnerStakeFactory()
        self.assertEqual(
            str(owner_stake), '{} stake in {}'.format(owner_stake.owner, owner_stake.power_plant)
        )


class ProjectOwnerStakeTestCase(TestCase):
    def test_str(self):
        owner_stake = factories.ProjectOwnerStakeFactory()
        self.assertEqual(
            str(owner_stake),
            '{} stake in {}'.format(owner_stake.owner, owner_stake.project)
        )


class ProjectFundingTestCase(TestCase):
    def test_str(self):
        """String representation of an ProjectFunding uses the amount and currency."""
        project_funding = factories.ProjectFundingFactory()
        self.assertEqual(
            str(project_funding), '{} {}'.format(project_funding.amount, project_funding.currency)
        )


class ProjectTestCase(TestCase):

    def setUp(self):
        self.project = factories.ProjectFactory()  # type: models.Project

    def test_str(self):
        """String representation of an Project uses the name."""
        self.assertEqual(str(self.project), self.project.name)

    def test_pipelines(self):
        """Test the pipeline portion of the model"""
        self.project.project_capacity = 10.0
        self.project.project_capacity_unit = models.ProjectCapacityUnits.BARRELS
        self.project.project_capacity_timeframe = models.ProjectTimeFrameUnits.PER_YEAR

        self.project.pipeline_diameter = 40
        self.project.pipeline_throughput = 100
        self.project.pipeline_throughput_unit = models.ProjectThroughputUnits.MIL_CUBIC_METERS
        self.project.pipeline_throughput_timeframe = models.ProjectTimeFrameUnits.PER_YEAR
        self.project.pipeline_throughput_year = 2019

        pp_capacity = self.project.pipeline_capacity_property
        # Is capacity rendered correctly
        self.assertEqual(pp_capacity, "10.0 Barrels per year")

        # Is Throughput rendered correctly
        self.assertEqual(self.project.pipeline_throughput_property,
                         "100 million cubic meters per year (2019)")


class FuelTestCase(TestCase):
    def test_str(self):
        """String representation of an Fuel uses the name."""
        fuel = factories.FuelFactory()
        self.assertEqual(str(fuel), fuel.name)


class FuelCategoryTestCase(TestCase):
    def test_str(self):
        """String representation of an FuelCategory uses the name."""
        fuel_category = factories.FuelCategoryFactory()
        self.assertEqual(str(fuel_category), fuel_category.name)


class PowerPlantTestCase(TestCase):
    def setUp(self):
        self.power_plant = factories.PowerPlantFactory()

    def test_str(self):
        """String representation of an PowerPlant uses the name."""
        self.assertEqual(str(self.power_plant), self.power_plant.name)

    def test_get_absolute_url(self):
        """The .get_absolute_url() method returns the PowerPlant's detail page URL."""
        self.assertEqual(
            self.power_plant.get_absolute_url(),
            reverse('infrastructure:powerplant-detail', kwargs={'slug': self.power_plant.slug}),
        )


class InitiativeTypeTestCase(TestCase):
    def test_str(self):
        """String representation of an InitiativeType uses the name."""
        initiative_type = factories.InitiativeTypeFactory()
        self.assertEqual(str(initiative_type), initiative_type.name)


class InitiativeTestCase(TestCase):
    def test_str(self):
        """String representation of an Initiative uses the name."""
        initiative = factories.InitiativeFactory()
        self.assertEqual(str(initiative), initiative.name)


class ProjectSubstationTestCase(TestCase):
    def setUp(self):
        self.substation = factories.ProjectSubstationFactory()

    def test_fk(self):
        """
        * Substation must have a project.
        * When the project is deleted, so is the substation (cascade)
        """
        self.assertIsNotNone(self.substation.project)
        id = self.substation.id
        self.substation.project.delete()
        self.assertFalse(models.ProjectSubstation.objects.filter(id=id).exists())
