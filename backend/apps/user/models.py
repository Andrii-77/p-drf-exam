from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from core.models import BaseModel

from apps.user.managers import UserManager


class Role(models.TextChoices):
    BUYER = "buyer", "Buyer"
    SELLER = "seller", "Seller"
    MANAGER = "manager", "Manager"
    ADMIN = "admin", "Admin"


class AccountType(models.TextChoices):
    BASIC = "basic", "Basic"
    PREMIUM = "premium", "Premium"


class UserModel(AbstractBaseUser, PermissionsMixin, BaseModel):
    class Meta:
        db_table = 'auth_user'
        ordering = ['-id']

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.BUYER)
    account_type = models.CharField(max_length=10, choices=AccountType.choices, default=AccountType.BASIC)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    objects = UserManager()


class ProfileModel(BaseModel):
    class Meta:
        db_table = 'profile'
        ordering = ['-id']

    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=15)
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='profile')
