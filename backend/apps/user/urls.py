from django.urls import path

from .views import (
    BlockUserView,
    SendEmailTestView,
    UnBlockUserView,
    UserAddCarPosterView,
    UserBlockAdminView,
    UserListCreateView,
    UserToAdminRoleView,
    UserToAdminView,
    UserToBasicAccountTypeView,
    UserToBuyerRoleView,
    UserToManagerRoleView,
    UserToPremiumAccountTypeView,
    UserToSellerRoleView,
)

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user_list_create'),
    path('/<int:pk>/block', BlockUserView.as_view(), name='user_block'),
    path('/<int:pk>/unblock', UnBlockUserView.as_view(), name='user_unblock'),
    path('/<int:pk>/to_admin', UserToAdminView.as_view(), name='user_to_admin'),
    path('/<int:pk>/block_admin', UserBlockAdminView.as_view(), name='block_admin'),
    path('/<int:pk>/cars', UserAddCarPosterView.as_view(), name='user_add_car_poster'),
    path('/test', SendEmailTestView.as_view(), name='send_email_test'),
    path('/<int:pk>/to_seller_role', UserToSellerRoleView.as_view(), name='user_to_seller_role'),
    path('/<int:pk>/to_manager_role', UserToManagerRoleView.as_view(), name='user_to_manager_role'),
    path('/<int:pk>/to_admin_role', UserToAdminRoleView.as_view(), name='user_to_admin_role'),
    path('/<int:pk>/to_buyer_role', UserToBuyerRoleView.as_view(), name='user_to_buyer_role'),
    path('/<int:pk>/to_basic_account_type', UserToBasicAccountTypeView.as_view(), name='user_to_basic_account_type'),
    path('/<int:pk>/to_premium_account_type', UserToPremiumAccountTypeView.as_view(), name='user_to_premium_account_type'),
]