from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.car.models import CarBrandModel, CarModelModel
from apps.user.models import UserModel


class TestCarBrandModelViews(APITestCase):

    def setUp(self):
        self.staff_user = UserModel.objects.create_user(username="staff", password="pass123", is_staff=True)
        self.normal_user = UserModel.objects.create_user(username="user1", password="pass123")
        self.brand = CarBrandModel.objects.create(brand="Toyota")

    def test_list_brands_readonly_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("carbrandlistcreateview")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(b["brand"] == "Toyota" for b in response.json()))

    def test_create_brand_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("carbrandlistcreateview")
        data = {"brand": "Honda"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CarBrandModel.objects.filter(brand="Honda").exists())

    def test_create_brand_denied_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("carbrandlistcreateview")
        data = {"brand": "Honda"}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])

    def test_retrieve_brand(self):
        url = reverse("carbrandretrieveupdatedestroyview", args=[self.brand.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["brand"], self.brand.brand)

    def test_update_brand_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("carbrandretrieveupdatedestroyview", args=[self.brand.id])
        data = {"brand": "UpdatedBrand"}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.brand.refresh_from_db()
        self.assertEqual(self.brand.brand, "UpdatedBrand")

    def test_delete_brand_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("carbrandretrieveupdatedestroyview", args=[self.brand.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CarBrandModel.objects.filter(id=self.brand.id).exists())


class TestCarModelViews(APITestCase):

    def setUp(self):
        self.staff_user = UserModel.objects.create_user(username="staff", password="pass123", is_staff=True)
        self.normal_user = UserModel.objects.create_user(username="user1", password="pass123")
        self.brand = CarBrandModel.objects.create(brand="Toyota")
        self.model = CarModelModel.objects.create(brand=self.brand, model="Corolla")

    def test_list_models_readonly_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("carmodellistcreateview")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(m["model"] == "Corolla" for m in response.json()))

    def test_create_model_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("carmodellistcreateview")
        data = {"brand_id": self.brand.id, "model": "Camry"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CarModelModel.objects.filter(model="Camry").exists())

    def test_create_model_denied_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("carmodellistcreateview")
        data = {"brand_id": self.brand.id, "model": "Camry"}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])

    def test_update_model_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("carmodelretrieveupdatedestroyview", args=[self.model.id])
        data = {"brand_id": self.model.brand.id, "model": "UpdatedModel"}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, 200)
        self.model.refresh_from_db()
        self.assertEqual(self.model.model, "UpdatedModel")

    def test_delete_model_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("carmodelretrieveupdatedestroyview", args=[self.model.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CarModelModel.objects.filter(id=self.model.id).exists())