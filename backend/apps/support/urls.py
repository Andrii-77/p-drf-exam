from django.urls import path

from .views import SupportRequestListCreateView, SupportRequestProcessView

urlpatterns = [
    path("", SupportRequestListCreateView.as_view(), name="support_list_create"),
    path("/<int:pk>", SupportRequestProcessView.as_view(), name="support_update_detail"),
]