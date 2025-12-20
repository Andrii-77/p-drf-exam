from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient

from core.services.jwt_service import ActivateToken, JWTService, RecoveryToken

User = get_user_model()


class TestAuthFlow(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.password = "TestPass123!"

        self.user = User.objects.create_user(
            email="user@test.com",
            password=self.password,
            is_active=True
        )

        self.inactive_user = User.objects.create_user(
            email="inactive@test.com",
            password=self.password,
            is_active=False
        )

    # -------------------- LOGIN --------------------

    def test_login_success(self):
        response = self.client.post(
            "/auth",
            {"email": self.user.email, "password": self.password},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_login_wrong_password(self):
        response = self.client.post(
            "/auth",
            {"email": self.user.email, "password": "wrong"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_inactive_user(self):
        response = self.client.post(
            "/auth",
            {"email": self.inactive_user.email, "password": self.password},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # -------------------- ACTIVATE --------------------

    def test_activate_user_success(self):
        token = JWTService.create_token(self.inactive_user, ActivateToken)

        response = self.client.patch(f"/auth/activate/{token}")

        self.inactive_user.refresh_from_db()
        self.assertTrue(self.inactive_user.is_active)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_activate_user_invalid_token(self):
        response = self.client.patch("/auth/activate/invalidtoken")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------------------- RECOVERY REQUEST --------------------

    @patch("core.services.email_service.EmailService.recovery")
    def test_recovery_request_success(self, mocked_email):
        response = self.client.post(
            "/auth/recovery",
            {"email": self.user.email},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mocked_email.assert_called_once()

    @patch("core.services.email_service.EmailService.recovery")
    def test_recovery_request_nonexistent_email(self, mocked_email):
        response = self.client.post(
            "/auth/recovery",
            {"email": "no@test.com"},
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        mocked_email.assert_not_called()

    # -------------------- RECOVERY PASSWORD --------------------

    def test_recovery_password_success(self):
        token = JWTService.create_token(self.user, RecoveryToken)

        response = self.client.post(
            f"/auth/recovery/{token}",
            {"password": "NewStrong123!"},
        )

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewStrong123!"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_recovery_password_invalid_token(self):
        response = self.client.post(
            "/auth/recovery/invalidtoken",
            {"password": "NewStrong123!"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------------------- CHANGE PASSWORD --------------------

    def test_change_password_success(self):
        """
        Перевірка зміни пароля для автентифікованого користувача.
        """
        # Логін користувача, щоб отримати access токен
        login_data = {
            "email": self.user.email,
            "password": self.password  # Використовуємо правильний пароль із setUp
        }
        login_response = self.client.post("/auth", login_data, format="json")  # правильно
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        access = login_response.data["access"]

        # Встановлюємо токен у заголовок авторизації
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

        # Дані для зміни пароля
        change_data = {
            "old_password": self.password,
            "new_password": "NewStrong123!",
            "confirm_password": "NewStrong123!"
        }

        response = self.client.post("/auth/change-password", change_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Оновлюємо користувача з БД
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewStrong123!"))