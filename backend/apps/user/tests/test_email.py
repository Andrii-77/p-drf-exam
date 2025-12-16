from unittest.mock import patch

from django.core.mail import EmailMultiAlternatives
from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APIClient

from apps.user.models import UserModel


class SendEmailTestViewTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.admin = UserModel.objects.create_superuser(email='admin@example.com', password='admin123')

    @patch.object(EmailMultiAlternatives, 'send')
    def test_send_email_test_view_calls_email_send(self, mock_send):
        url = reverse('send_email_test')
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        mock_send.assert_called_once()