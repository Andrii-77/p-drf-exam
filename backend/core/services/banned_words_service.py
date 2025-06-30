from apps.car.models import BannedWordsModel


def contains_bad_words(text):
    if not text:
        return False
    banned_words = BannedWordsModel.objects.values_list('word', flat=True)
    text_lower = text.lower()
    return any(bad_word.lower() in text_lower for bad_word in banned_words)
