from django.contrib.auth import get_user_model

from rest_framework import serializers

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

UserModel = get_user_model()


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['password']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = UserModel.USERNAME_FIELD  # email

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = UserModel.objects.filter(email=email).first()

        if user is None or not user.check_password(password):
            raise serializers.ValidationError("Невірний логін або пароль")

        if not user.is_active:
            raise serializers.ValidationError("Акаунт не активний")

        # Якщо все ок, формуємо токен
        data = {}
        refresh = self.get_token(user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        user = self.context['request'].user
        old_password = attrs.get('old_password')
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        # 1. Перевірка старого пароля
        if not user.check_password(old_password):
            raise serializers.ValidationError({'old_password': 'Старий пароль невірний.'})

        # 2. Перевірка співпадіння
        if new_password != confirm_password:
            raise serializers.ValidationError({'confirm_password': 'Паролі не співпадають.'})

        # 3. Перевірка, щоб не був той самий пароль
        if old_password == new_password:
            raise serializers.ValidationError({'new_password': 'Новий пароль не може бути таким самим.'})

        return attrs

    def save(self, **kwargs):
        """
        Змінює пароль тільки якщо всі перевірки пройдені успішно.
        Токен користувача після цього стає невалідним (нормальна поведінка).
        """
        user = self.context['request'].user
        new_password = self.validated_data['new_password']

        user.set_password(new_password)
        user.save(update_fields=['password'])
        return user