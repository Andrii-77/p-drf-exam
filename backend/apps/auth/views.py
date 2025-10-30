from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from core.services.email_service import EmailService
from core.services.jwt_service import ActivateToken, JWTService, RecoveryToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.user.serializers import UserSerializer

from .serializers import ChangePasswordSerializer, CustomTokenObtainPairSerializer, EmailSerializer, PasswordSerializer

UserModel = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class ActivateUserView(GenericAPIView):
    permission_classes = (AllowAny,)

    def patch(self, *args, **kwargs):
        token = kwargs['token']
        user = JWTService.verify_token(token, ActivateToken)
        user.is_active = True
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


class RecoveryRequestView(GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, *args, **kwargs):
        data = self.request.data
        serializer = EmailSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = get_object_or_404(UserModel, email=serializer.data['email'])
        EmailService.recovery(user)
        return Response({'details': 'link send to email'}, status.HTTP_200_OK)


class RecoveryPasswordView(GenericAPIView):
    permission_classes = (AllowAny,)

    def post(self, *args, **kwargs):
        data = self.request.data
        serializer = PasswordSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        token = kwargs['token']
        user = JWTService.verify_token(token, RecoveryToken)
        user.set_password(serializer.data['password'])
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


class ChangePasswordView(GenericAPIView):
    """
    Дозволяє автентифікованому користувачу змінити свій пароль.
    Після успішної зміни користувач мусить повторно увійти в систему.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': 'Пароль успішно змінено. Будь ласка, увійдіть знову.'},
            status=status.HTTP_200_OK
        )



# from django.contrib.auth import get_user_model
#
# from rest_framework import status
# from rest_framework.generics import GenericAPIView, get_object_or_404
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
#
# from core.services.email_service import EmailService
# from core.services.jwt_service import ActivateToken, JWTService, RecoveryToken
#
# from apps.auth.serializers import EmailSerializer, PasswordSerializer
# from apps.user.serializers import UserSerializer
#
# UserModel = get_user_model()
#
#
# class ActivateUserView(GenericAPIView):
#     permission_classes = (AllowAny,)
#
#     def patch(self, *args, **kwargs):
#         token = kwargs['token']
#         user = JWTService.verify_token(token, ActivateToken)
#         user.is_active = True
#         user.save()
#         serializer = UserSerializer(user)
#         return Response(serializer.data, status.HTTP_200_OK)
#
#
# class RecoveryRequestView(GenericAPIView):
#     permission_classes = (AllowAny,)
#
#     def post(self, *args, **kwargs):
#         data = self.request.data
#         serializer = EmailSerializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         user = get_object_or_404(UserModel, email=serializer.data['email'])
#         EmailService.recovery(user)
#         return Response({'details': 'link send to email'}, status.HTTP_200_OK)
#
#
# class RecoveryPasswordView(GenericAPIView):
#     permission_classes = (AllowAny,)
#
#     def post(self, *args, **kwargs):
#         data = self.request.data
#         serializer = PasswordSerializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         token = kwargs['token']
#         user = JWTService.verify_token(token, RecoveryToken)
#         user.set_password(serializer.data['password'])
#         user.save()
#         serializer = UserSerializer(user)
#         return Response(serializer.data, status.HTTP_200_OK)
