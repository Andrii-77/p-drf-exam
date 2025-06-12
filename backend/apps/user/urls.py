from django.urls import path

from .views import (
    BlockUserView,
    SendEmailTestView,
    UnBlockUserView,
    UserAddCarPosterView,
    UserBlockAdminView,
    UserListCreateView,
    UserToAdminView,
    UserToSellerView,
)

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user_list_create'),
    path('/<int:pk>/block', BlockUserView.as_view(), name='user_block'),
    path('/<int:pk>/unblock', UnBlockUserView.as_view(), name='user_unblock'),
    path('/<int:pk>/to_admin', UserToAdminView.as_view(), name='user_to_admin'),
    path('/<int:pk>/block_admin', UserBlockAdminView.as_view(), name='block_admin'),
    path('/<int:pk>/cars', UserAddCarPosterView.as_view(), name='user_add_car_poster'),
    path('/test', SendEmailTestView.as_view(), name='send_email_test'),
    path('/<int:pk>/to_seller', UserToSellerView.as_view(), name='user_to_seller'),
]