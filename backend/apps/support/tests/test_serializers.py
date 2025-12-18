from django.test import TestCase

from rest_framework.exceptions import ValidationError

from apps.car.models import CarBrandModel, CarModelModel
from apps.support.models import SupportRequestModel
from apps.support.serializers import SupportRequestSerializer
from apps.user.models import UserModel


class SupportRequestSerializerTestCase(TestCase):

    def setUp(self):
        self.user = UserModel.objects.create_user(
            email="user@test.com",
            password="123456",
            role="seller"
        )
        self.brand = CarBrandModel.objects.create(brand="Toyota")

    def test_brand_request_valid(self):
        data = {
            "type": "brand",
            "text": "BMW"
        }
        serializer = SupportRequestSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_brand_request_existing_brand_fails(self):
        data = {
            "type": "brand",
            "text": "Toyota"
        }
        serializer = SupportRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("text", serializer.errors)

    def test_model_request_without_brand_fails(self):
        data = {
            "type": "model",
            "text": "Camry"
        }
        serializer = SupportRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("brand", serializer.errors)

    def test_model_request_valid(self):
        data = {
            "type": "model",
            "text": "Camry",
            "brand": self.brand.id
        }
        serializer = SupportRequestSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_model_request_existing_model_fails(self):
        CarModelModel.objects.create(
            brand=self.brand,
            model="Camry"
        )

        data = {
            "type": "model",
            "text": "Camry",
            "brand": self.brand.id
        }
        serializer = SupportRequestSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("text", serializer.errors)