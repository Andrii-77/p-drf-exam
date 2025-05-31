from django.urls import path

from .views import BlockUserView, UnBlockUserView, UserBlockAdminView, UserListCreateView, UserToAdminView

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user_list_create'),
    path('/<int:pk>/block', BlockUserView.as_view(), name='user_block'),
    path('/<int:pk>/unblock', UnBlockUserView.as_view(), name='user_unblock'),
    path('/<int:pk>/to_admin', UserToAdminView.as_view(), name='user_to_admin'),
    path('/<int:pk>/block_admin', UserBlockAdminView.as_view(), name='block_admin'),
]