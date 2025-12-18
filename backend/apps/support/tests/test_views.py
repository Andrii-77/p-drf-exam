from rest_framework import status
from rest_framework.test import APITestCase

from apps.car.models import CarBrandModel
from apps.support.models import SupportRequestModel
from apps.user.models import UserModel


class SupportRequestViewTestCase(APITestCase):

    def setUp(self):
        self.url = "/support"

        self.brand = CarBrandModel.objects.create(brand="BMW")

        self.seller = UserModel.objects.create_user(
            email="seller@test.com",
            password="123",
            role="seller",
            account_type="premium",
        )

        self.manager = UserModel.objects.create_user(
            email="manager@test.com",
            password="123",
            role="manager",
        )

        self.support_request = SupportRequestModel.objects.create(
            type="brand",
            text="Audi",
            user=self.seller,
        )

    def test_create_support_request_authenticated(self):
        self.client.force_authenticate(self.seller)

        response = self.client.post(
            self.url,
            data={"type": "brand", "text": "Tesla"},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SupportRequestModel.objects.count(), 2)

    def test_create_support_request_unauthenticated_fails(self):
        response = self.client.post(
            self.url,
            data={"type": "brand", "text": "Tesla"},
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_support_requests_for_manager(self):
        self.client.force_authenticate(self.manager)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 🔑 перевіряємо структуру відповіді
        self.assertIsInstance(response.data, dict)
        self.assertIn("data", response.data)
        self.assertIsInstance(response.data["data"], list)

        # 🔑 перевіряємо, що наш request є у списку
        self.assertTrue(
            any(
                item["id"] == self.support_request.id
                for item in response.data["data"]
            )
        )

    def test_list_support_requests_forbidden_for_seller(self):
        self.client.force_authenticate(self.seller)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_processed_by_manager(self):
        self.client.force_authenticate(self.manager)

        response = self.client.patch(
            f"/support/{self.support_request.id}",
            data={"processed": True},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.support_request.refresh_from_db()
        self.assertTrue(self.support_request.processed)