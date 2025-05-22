from django.urls import path

from apps.car.views import (
    CarBrandListCreateView,
    CarBrandRetrieveUpdateDestroyView,
    CarListCreateView,
    CarModelListCreateView,
    CarModelRetrieveUpdateDestroyView,
    CarRetrieveUpdateDestroyView,
)

urlpatterns = [
    path("", CarListCreateView.as_view()),
    path("/<int:pk>", CarRetrieveUpdateDestroyView.as_view()),
    path("/brands", CarBrandListCreateView.as_view()),
    path("/brands/<int:pk>", CarBrandRetrieveUpdateDestroyView.as_view()),
    path("/models", CarModelListCreateView.as_view()),
    path("/models/<int:pk>", CarModelRetrieveUpdateDestroyView.as_view()),
]