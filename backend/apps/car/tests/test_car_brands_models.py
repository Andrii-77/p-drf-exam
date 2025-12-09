from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.test import TestCase

from apps.car.models import CarBrandModel, CarModelModel


class TestCarBrandsModels(TestCase):

    def test_create_brand_valid(self):
        brand = CarBrandModel.objects.create(brand="Toyota")
        self.assertIsNotNone(brand.id)
        self.assertEqual(brand.brand, "Toyota")

    def test_create_brand_invalid_regex(self):
        # Назва повинна починатися з великої літери
        brand = CarBrandModel(brand="toyota")
        with self.assertRaises(ValidationError):
            brand.full_clean()

        # Надто коротка назва
        brand = CarBrandModel(brand="T")
        with self.assertRaises(ValidationError):
            brand.full_clean()

    def test_brand_unique_constraint(self):
        CarBrandModel.objects.create(brand="Honda")
        with self.assertRaises(IntegrityError):
            CarBrandModel.objects.create(brand="Honda")

    def test_create_model_valid(self):
        brand = CarBrandModel.objects.create(brand="BMW")
        car_model = CarModelModel.objects.create(brand=brand, model="X5")
        self.assertIsNotNone(car_model.id)
        self.assertEqual(car_model.brand, brand)
        self.assertEqual(car_model.model, "X5")

    def test_model_unique_per_brand(self):
        brand = CarBrandModel.objects.create(brand="Audi")
        CarModelModel.objects.create(brand=brand, model="A4")

        # Спроба створити таку ж модель у того ж бренду
        with self.assertRaises(IntegrityError):
            CarModelModel.objects.create(brand=brand, model="A4")

    def test_same_model_name_different_brands_allowed(self):
        brand1 = CarBrandModel.objects.create(brand="Ford")
        brand2 = CarBrandModel.objects.create(brand="Chevrolet")

        # Модель з однаковим ім’ям, але різні бренди — можна
        model1 = CarModelModel.objects.create(brand=brand1, model="Focus")
        model2 = CarModelModel.objects.create(brand=brand2, model="Focus")

        self.assertEqual(model1.model, model2.model)
        self.assertNotEqual(model1.brand, model2.brand)