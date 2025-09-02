from django.contrib.auth import authenticate, get_user_model

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



# from django.contrib.auth import get_user_model
#
# from rest_framework import serializers
#
# UserModel = get_user_model()
#
#
# class EmailSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#
# class PasswordSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserModel
#         fields = ['password']