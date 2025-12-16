from django.test import TestCase

from apps.user.models import UserModel
from apps.user.serializers import UserShortSerializer


class UserSerializerTestCase(TestCase):

    def setUp(self):
        self.user = UserModel.objects.create_user(
            email='user@example.com',
            password='password123',
            role='seller',
            account_type='premium'
        )

    def test_user_short_serializer_fields(self):
        serializer = UserShortSerializer(instance=self.user)
        data = serializer.data

        self.assertIn('id', data)
        self.assertIn('email', data)
        self.assertIn('profile', data)

        self.assertNotIn('role', data)
        self.assertNotIn('account_type', data)
        self.assertNotIn('is_active', data)