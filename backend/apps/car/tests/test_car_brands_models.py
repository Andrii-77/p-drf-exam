from django.core.exceptions import ValidationError
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
        brand1 = CarBrandModel.objects.create(brand="Honda")
        brand2 = CarBrandModel(brand="Honda")
        with self.assertRaises(ValidationError):
            brand2.full_clean()  # перевірка унікальності через Django

    def test_create_model_valid(self):
        brand = CarBrandModel.objects.create(brand="BMW")
        car_model = CarModelModel(brand=brand, model="X5")
        car_model.full_clean()  # перевірка валідності
        car_model.save()

        self.assertIsNotNone(car_model.id)
        self.assertEqual(car_model.brand, brand)
        self.assertEqual(car_model.model, "X5")

    def test_model_unique_per_brand(self):
        brand = CarBrandModel.objects.create(brand="Audi")
        car_model1 = CarModelModel(brand=brand, model="A4")
        car_model1.full_clean()
        car_model1.save()

        # Спроба створити таку ж модель у того ж бренду
        car_model2 = CarModelModel(brand=brand, model="A4")
        with self.assertRaises(ValidationError):
            car_model2.full_clean()  # тут спрацьовує унікальний валідатор

    def test_same_model_name_different_brands_allowed(self):
        brand1 = CarBrandModel.objects.create(brand="Ford")
        brand2 = CarBrandModel.objects.create(brand="Chevrolet")

        # Модель з однаковим ім’ям, але різні бренди — можна
        model1 = CarModelModel(brand=brand1, model="Focus")
        model1.full_clean()
        model1.save()

        model2 = CarModelModel(brand=brand2, model="Focus")
        model2.full_clean()
        model2.save()

        self.assertEqual(model1.model, model2.model)
        self.assertNotEqual(model1.brand, model2.brand)