from django.urls import path

from apps.car.views import (
    BannedWordsListCreateView,
    BannedWordsRetrieveUpdateDestroyView,
    CarBrandListCreateView,
    CarBrandRetrieveUpdateDestroyView,
    CarListCreateView,
    CarModelListCreateView,
    CarModelRetrieveUpdateDestroyView,
    CarRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("", CarListCreateView.as_view()),
    path("/<int:pk>", CarRetrieveUpdateDestroyView.as_view(), name='car-detail'),
    path("/brands", CarBrandListCreateView.as_view()),
    path("/brands/<int:pk>", CarBrandRetrieveUpdateDestroyView.as_view()),
    path("/models", CarModelListCreateView.as_view()),
    path("/models/<int:pk>", CarModelRetrieveUpdateDestroyView.as_view()),
    path("/bad_words", BannedWordsListCreateView.as_view()),
    path("/bad_words/<int:pk>", BannedWordsRetrieveUpdateDestroyView.as_view()),
]