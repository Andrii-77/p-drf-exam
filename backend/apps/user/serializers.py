from django.contrib.auth import get_user_model
from django.db.transaction import atomic

from rest_framework import serializers

from core.services.email_service import EmailService

from apps.user.models import ProfileModel

UserModel = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileModel
        fields = (
            'id',
            'name',
            'surname',
            'phone_number',
            'created_at',
            'updated_at',
        )


# 🔹 Новий серіалізатор для використання у CarPosterSerializer
class UserShortSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = UserModel
        fields = ("id", "email", "profile")


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    # ВАЖЛИВО: тут більше НЕ імпортуємо CarPosterSerializer,
    # щоб уникнути циклу. cars можна додати через інший механізм при потребі.

    class Meta:
        model = UserModel
        fields = (
            'id',
            'email',
            'password',
            'role',
            'account_type',
            'is_active',
            'is_staff',
            'is_superuser',
            'last_login',
            'created_at',
            'updated_at',
            'profile',
        )
        read_only_fields = (
            'id', 'role', 'account_type', 'is_active',
            'is_staff', 'is_superuser', 'last_login',
            'created_at', 'updated_at'
        )
        extra_kwargs = {
            'password': {
                'write_only': True,
            }
        }

    @atomic
    def create(self, validated_data: dict):
        profile = validated_data.pop('profile')
        user = UserModel.objects.create_user(**validated_data)
        ProfileModel.objects.create(**profile, user=user)
        EmailService.register(user)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance

    def validate(self, attrs):
        role = attrs.get('role', getattr(self.instance, 'role', None))
        account_type = attrs.get('account_type', getattr(self.instance, 'account_type', None))

        if role != 'seller' and account_type:
            raise serializers.ValidationError(
                "Тип акаунта (basic/premium) може бути лише для продавців."
            )
        return attrs




# from django.contrib.auth import get_user_model
# from django.db.transaction import atomic
#
# from rest_framework import serializers
#
# from core.services.email_service import EmailService
#
# from apps.car.serializers import CarPosterSerializer
# from apps.user.models import ProfileModel
#
# UserModel = get_user_model()
#
#
# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProfileModel
#         fields = (
#             'id',
#             'name',
#             'surname',
#             'phone_number',
#             'created_at',
#             'updated_at',
#         )
#
#
# class UserSerializer(serializers.ModelSerializer):
#     profile = ProfileSerializer()
#     cars = CarPosterSerializer(many=True, read_only=True)
#
#     class Meta:
#         model = UserModel
#         fields = (
#             'id',
#             'email',
#             'password',
#             'role',
#             'account_type',
#             'is_active',
#             'is_staff',
#             'is_superuser',
#             'last_login',
#             'created_at',
#             'updated_at',
#             'profile',
#             'cars',
#         )
#         # depth = 1
#         read_only_fields = ('id', 'role', 'account_type', 'is_active', 'is_staff', 'is_superuser', 'last_login',
#                             'created_at', 'updated_at')
#         extra_kwargs = {
#             'password': {
#                 'write_only': True,
#             }
#         }
#
#     @atomic
#     def create(self, validated_data: dict):
#         profile = validated_data.pop('profile')
#         user = UserModel.objects.create_user(**validated_data)
#         ProfileModel.objects.create(**profile, user=user)
#         EmailService.register(user)
#         return user
#
#     def update(self, instance, validated_data):
#         profile_data = validated_data.pop('profile', None)
#
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.save()
#
#         if profile_data:
#             profile = instance.profile
#             for attr, value in profile_data.items():
#                 setattr(profile, attr, value)
#             profile.save()
#
#         return instance
#
#     def validate(self, attrs):
#         role = attrs.get('role', getattr(self.instance, 'role', None))
#         account_type = attrs.get('account_type', getattr(self.instance, 'account_type', None))
#
#         if role != 'seller' and account_type:
#             raise serializers.ValidationError(
#                 "Тип акаунта (basic/premium) може бути лише для продавців."
#             )
#         return attrs

