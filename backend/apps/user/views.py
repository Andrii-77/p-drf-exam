import os

from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView, ListCreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.car.serializers import CarPosterSerializer
from apps.user.serializers import UserSerializer

UserModel = get_user_model()


class UserListCreateView(ListCreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class BlockUserView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.all().exclude(id=self.request.user.id)

    # queryset = UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if user.is_active:
            user.is_active = False
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


class UnBlockUserView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.exclude(id=self.request.user.id)

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if not user.is_active:
            user.is_active = True
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


class UserToAdminView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.exclude(id=self.request.user.id)

    # queryset = UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if not user.is_staff:
            user.is_staff = True
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)


class UserBlockAdminView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.exclude(id=self.request.user.id)

    # queryset = UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if user.is_staff:
            user.is_staff = False
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)
    
class UserToSellerRoleBasicAccountTypeView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if not user.role == "seller":
            user.role = "seller"
            user.account_type = "basic"
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)

class UserToManagerRoleView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if not user.role == "manager":
            user.role = "manager"
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)

class UserToAdminRoleView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if not user.role == "admin":
            user.role = "admin"
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)

class UserToBuyerRoleView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if not user.role == "buyer":
            user.role = "buyer"
            user.account_type = ""
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)

class UserSellerToBasicAccountTypeView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if user.role == "seller" and not user.account_type == "basic":
            user.account_type = "basic"
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)

class UserSellerToPremiumAccountTypeView(GenericAPIView):
    def get_queryset(self):
        return UserModel.objects.all()

    def patch(self, *args, **kwargs):
        user = self.get_object()
        if user.role == "seller" and not user.account_type == "premium":
            user.account_type = "premium"
            user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status.HTTP_200_OK)

class UserAddCarPosterView(GenericAPIView):
    queryset = UserModel.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, *args, **kwargs):
        user = self.get_object()
        data = self.request.data
        if user.account_type == 'basic' and user.cars.count() >= 1:
            raise PermissionDenied("Користувач з базовим акаунтом може мати лише одне оголошення.")
        if self.request.user != user:
            raise PermissionDenied("Ви не можете створювати оголошення від імені іншого користувача.")
        serializer = CarPosterSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        user_serializer = UserSerializer(user)
        return Response(user_serializer.data, status.HTTP_201_CREATED)

class SendEmailTestView(GenericAPIView):
    permission_classes = (AllowAny,)
    def get(self, *args, **kwargs):
        template = get_template('test_email.html')
        html_content = template.render({'name':'DJANGO'})
        msg = EmailMultiAlternatives(
            subject="Test Email",
            from_email=os.environ.get('EMAIL_HOST_USER'),
            to=['a_smaga@i.ua']
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return Response({'message': 'Email sent!'}, status.HTTP_200_OK)