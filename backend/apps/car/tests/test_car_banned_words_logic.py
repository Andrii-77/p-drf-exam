from django.db import IntegrityError
from django.test import TestCase

from core.services.banned_words_service import contains_bad_words

from apps.car.models import BannedWordsModel


class TestBannedWordsLogic(TestCase):

    def test_create_banned_word(self):
        word = "badword"
        bw = BannedWordsModel.objects.create(word=word)
        self.assertIsNotNone(bw.id)
        self.assertEqual(bw.word, word)

    def test_unique_constraint(self):
        BannedWordsModel.objects.create(word="uniqueword")
        with self.assertRaises(IntegrityError):
            BannedWordsModel.objects.create(word="uniqueword")  # дубль повинен викликати помилку

    def test_contains_bad_words(self):
        # спочатку додаємо слово у базу
        BannedWordsModel.objects.create(word="badword")

        test_cases = [
            ("This is a clean text", False),
            ("This has badword inside", True),
            ("BADWORD in uppercase", True),
            ("Partiallybadwordhere", True),
            ("", False),
            (None, False),
        ]

        for text, expected in test_cases:
            with self.subTest(text=text):
                self.assertEqual(contains_bad_words(text), expected)