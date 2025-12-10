from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel
from apps.user.models import UserModel


class TestCarListCreateView(APITestCase):

    def setUp(self):
        # Користувачі
        self.user = UserModel.objects.create_user(
            email="user1@example.com",
            password="password"
        )
        self.manager = UserModel.objects.create_user(
            email="manager@example.com",
            password="password",
            role="manager"
        )

        # Бренди та моделі
        self.brand1 = CarBrandModel.objects.create(brand="Toyota")
        self.brand2 = CarBrandModel.objects.create(brand="Honda")
        self.model1 = CarModelModel.objects.create(brand=self.brand1, model="Corolla")
        self.model2 = CarModelModel.objects.create(brand=self.brand2, model="Civic")

        # Авто
        self.car1 = CarPosterModel.objects.create(
            user=self.user, brand=self.brand1, model=self.model1, description="Car 1",
            original_price=10000, original_currency="USD", location="Kyiv", status="active"
        )
        self.car2 = CarPosterModel.objects.create(
            user=self.user, brand=self.brand2, model=self.model2, description="Car 2",
            original_price=15000, original_currency="USD", location="Lviv", status="draft"
        )

    def test_list_all_active_cars_anonymous(self):
        url = reverse("car-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()["data"]  # 👈 беремо "data"
        # тільки active cars
        self.assertTrue(all(car['status'] == 'active' for car in data))

    def test_list_all_cars_manager(self):
        self.client.force_authenticate(user=self.manager)
        url = reverse("car-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()["data"]
        # менеджер бачить всі машини
        self.assertEqual(len(data), 2)

    def test_filter_by_brand(self):
        url = reverse("car-list") + f"?brand={self.brand1.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()["data"]
        self.assertTrue(all(car['brand']['id'] == self.brand1.id for car in data))

    def test_filter_by_model(self):
        url = reverse("car-list") + f"?model={self.model2.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()["data"]
        self.assertTrue(all(car['model']['id'] == self.model2.id for car in data))

    def test_ordering_by_price(self):
        url = reverse("car-list") + "?ordering=price_usd"
        response = self.client.get(url)
        data = response.json()["data"]
        prices = [car['price_usd'] for car in data]
        self.assertEqual(prices, sorted(prices))

        url_desc = reverse("car-list") + "?ordering=-price_usd"
        response_desc = self.client.get(url_desc)
        data_desc = response_desc.json()["data"]
        prices_desc = [car['price_usd'] for car in data_desc]
        self.assertEqual(prices_desc, sorted(prices_desc, reverse=True))