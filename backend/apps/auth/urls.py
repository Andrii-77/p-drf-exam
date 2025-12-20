from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ActivateUserView,
    ChangePasswordView,
    CustomTokenObtainPairView,
    RecoveryPasswordView,
    RecoveryRequestView,
)

urlpatterns = [
    path('', CustomTokenObtainPairView.as_view(), name='auth_login'),  # кастомний логін
    path('/refresh', TokenRefreshView.as_view(), name='auth_refresh'),
    path('/activate/<str:token>', ActivateUserView.as_view(), name='auth_activate'),
    path('/recovery', RecoveryRequestView.as_view(), name='auth_recovery'),
    path('/recovery/<str:token>', RecoveryPasswordView.as_view(), name='auth_recovery_password'),
    path('/change-password', ChangePasswordView.as_view(), name='auth_change_password'),
]