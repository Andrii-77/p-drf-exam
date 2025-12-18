from django.test import TestCase

from apps.car.models import CarBrandModel
from apps.support.filters import SupportRequestFilter
from apps.support.models import SupportRequestModel


class SupportRequestFilterTestCase(TestCase):

    def setUp(self):
        self.brand1 = CarBrandModel.objects.create(brand="Toyota")
        self.brand2 = CarBrandModel.objects.create(brand="BMW")

        self.req1 = SupportRequestModel.objects.create(
            type="brand",
            text="Audi",
            processed=False
        )
        self.req2 = SupportRequestModel.objects.create(
            type="model",
            text="X5",
            brand=self.brand2,
            processed=True
        )

    def test_filter_by_type(self):
        qs = SupportRequestFilter(
            {"type": "brand"},
            queryset=SupportRequestModel.objects.all()
        ).qs

        self.assertIn(self.req1, qs)
        self.assertNotIn(self.req2, qs)

    def test_filter_by_processed(self):
        qs = SupportRequestFilter(
            {"processed": True},
            queryset=SupportRequestModel.objects.all()
        ).qs

        self.assertIn(self.req2, qs)
        self.assertNotIn(self.req1, qs)

    def test_filter_by_brand(self):
        qs = SupportRequestFilter(
            {"brand": self.brand2.id},
            queryset=SupportRequestModel.objects.all()
        ).qs

        self.assertIn(self.req2, qs)
        self.assertNotIn(self.req1, qs)

    def test_filter_by_text(self):
        qs = SupportRequestFilter(
            {"text": "aud"},
            queryset=SupportRequestModel.objects.all()
        ).qs

        self.assertIn(self.req1, qs)