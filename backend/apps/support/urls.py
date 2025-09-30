from django.urls import path

from .views import SupportRequestListCreateView

urlpatterns = [
    path("", SupportRequestListCreateView.as_view(), name="support_list_create"),
]