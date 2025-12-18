from django.test import TestCase

from apps.car.models import CarBrandModel
from apps.support.models import SupportRequestModel
from apps.user.models import UserModel


class SupportRequestModelTestCase(TestCase):

    def setUp(self):
        self.user = UserModel.objects.create_user(
            email="user@test.com",
            password="123456",
            role="seller"
        )
        self.brand = CarBrandModel.objects.create(brand="Toyota")

    def test_create_brand_request(self):
        support = SupportRequestModel.objects.create(
            type="brand",
            text="BMW",
            user=self.user
        )

        self.assertEqual(support.type, "brand")
        self.assertEqual(support.text, "BMW")
        self.assertFalse(support.processed)
        self.assertEqual(support.user, self.user)

    def test_create_model_request_with_brand(self):
        support = SupportRequestModel.objects.create(
            type="model",
            text="Camry",
            brand=self.brand,
            user=self.user
        )

        self.assertEqual(support.type, "model")
        self.assertEqual(support.brand, self.brand)

    def test_support_request_ordering(self):
        s1 = SupportRequestModel.objects.create(type="brand", text="A")
        s2 = SupportRequestModel.objects.create(type="brand", text="B")

        qs = SupportRequestModel.objects.all()
        self.assertEqual(qs.first(), s2)