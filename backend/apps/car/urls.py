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
    path("", CarListCreateView.as_view(), name="car-list"),
    path("/<int:pk>", CarRetrieveUpdateDestroyView.as_view(), name='car-detail'),
    path("/brands", CarBrandListCreateView.as_view(), name="carbrand-list"),
    path("/brands/<int:pk>", CarBrandRetrieveUpdateDestroyView.as_view(), name="carbrand-detail"),
    path("/models", CarModelListCreateView.as_view(), name="carmodel-list"),
    path("/models/<int:pk>", CarModelRetrieveUpdateDestroyView.as_view(), name="carmodel-detail"),
    path("/bad_words", BannedWordsListCreateView.as_view(), name="bannedwordslistcreateview"),
    path("/bad_words/<int:pk>", BannedWordsRetrieveUpdateDestroyView.as_view(), name="bannedwordsretrieveupdatedestroyview"),
]