from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from apps.car.models import BannedWordsModel
from apps.user.models import UserModel


class TestBannedWordsViews(APITestCase):

    def setUp(self):
        # створюємо користувачів
        self.staff_user = UserModel.objects.create_user(
            email="staff@example.com",
            password="pass123",
            is_staff=True
        )
        self.normal_user = UserModel.objects.create_user(
            email="user1@example.com",
            password="pass123"
        )
        self.banned_word = BannedWordsModel.objects.create(word="badword")

    # ---------- LIST ----------
    def test_list_banned_words_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("bannedwordslistcreateview")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        results = response.json()["data"]  # 👈 тут беремо "data"
        self.assertTrue(any(w["word"] == "badword" for w in results))

    def test_list_banned_words_denied_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("bannedwordslistcreateview")
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])

    def test_list_banned_words_denied_for_anonymous(self):
        url = reverse("bannedwordslistcreateview")
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])

    # ---------- CREATE ----------
    def test_create_banned_word_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("bannedwordslistcreateview")
        data = {"word": "curse"}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(BannedWordsModel.objects.filter(word="curse").exists())

    def test_create_banned_word_denied_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("bannedwordslistcreateview")
        data = {"word": "curse"}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])

    # ---------- RETRIEVE ----------
    def test_retrieve_banned_word_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("bannedwordsretrieveupdatedestroyview", args=[self.banned_word.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["word"], self.banned_word.word)

    def test_retrieve_banned_word_denied_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("bannedwordsretrieveupdatedestroyview", args=[self.banned_word.id])
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])

    # ---------- UPDATE ----------
    def test_update_banned_word_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("bannedwordsretrieveupdatedestroyview", args=[self.banned_word.id])
        data = {"word": "updatedword"}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.banned_word.refresh_from_db()
        self.assertEqual(self.banned_word.word, "updatedword")

    def test_update_banned_word_denied_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("bannedwordsretrieveupdatedestroyview", args=[self.banned_word.id])
        data = {"word": "updatedword"}
        response = self.client.put(url, data)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])

    # ---------- DELETE ----------
    def test_delete_banned_word_allowed_for_staff(self):
        self.client.force_authenticate(user=self.staff_user)
        url = reverse("bannedwordsretrieveupdatedestroyview", args=[self.banned_word.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(BannedWordsModel.objects.filter(id=self.banned_word.id).exists())

    def test_delete_banned_word_denied_for_normal_user(self):
        self.client.force_authenticate(user=self.normal_user)
        url = reverse("bannedwordsretrieveupdatedestroyview", args=[self.banned_word.id])
        response = self.client.delete(url)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED])