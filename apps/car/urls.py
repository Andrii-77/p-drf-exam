from django.urls import path

from apps.car.views import CarListCreateView, CarRetrieveUpdateDestroyView

urlpatterns = [
    path("", CarListCreateView.as_view()),
    path("/<int:pk>", CarRetrieveUpdateDestroyView.as_view())
]