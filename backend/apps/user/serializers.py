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


# 🔹 Короткий варіант для використання у зв’язках (наприклад, у CarPosterSerializer)
class UserShortSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = UserModel
        fields = ("id", "email", "profile")


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

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
            'id', 'account_type', 'is_active',
            'is_staff', 'is_superuser', 'last_login',
            'created_at', 'updated_at'
        )
        extra_kwargs = {
            'password': {'write_only': True},
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
        """
        Дозволяє користувачам змінювати роль тільки між 'buyer' і 'seller'.
        Автоматично ставить account_type='basic' для продавця, якщо не задано.
        """
        user = self.instance  # поточний користувач
        new_role = attrs.get('role', getattr(user, 'role', None))
        account_type = attrs.get('account_type', getattr(user, 'account_type', None))

        # ❌ Заборона для звичайних користувачів ставати manager/admin
        if new_role not in ['buyer', 'seller']:
            raise serializers.ValidationError(
                {"role": "Ви можете змінити роль лише між 'buyer' і 'seller'."}
            )

        # ✅ Якщо роль buyer — очищуємо тип акаунта
        if new_role != 'seller':
            attrs['account_type'] = ""
        else:
            # Якщо продавець і account_type не задано — ставимо 'basic' за замовчуванням
            if not account_type:
                attrs['account_type'] = "basic"

        return attrs

# 🔹 Новий серіалізатор для менеджерів/адміністраторів
class AdminUserUpdateSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        # Ті самі поля, але дозволяємо редагувати role, account_type, is_active
        read_only_fields = (
            'id', 'is_staff', 'is_superuser', 'last_login',
            'created_at', 'updated_at'
        )