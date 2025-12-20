import os

from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import GenericAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.services.banned_words_service import contains_bad_words

from apps.car.filter import CarFilter
from apps.car.models import CarPosterModel
from apps.car.serializers import CarPosterSerializer
from apps.user.permissions import IsManagerOrAdmin, IsOwnerOrManagerOrAdmin
from apps.user.serializers import AdminUserUpdateSerializer, UserSerializer

UserModel = get_user_model()

from rest_framework.filters import OrderingFilter

from core.pagination import PagePagination
from django_filters.rest_framework import DjangoFilterBackend

from apps.user.filter import UserFilter  # 🔹 додали імпорт


class UserListCreateView(ListCreateAPIView):
    """
    Повертає список користувачів із підтримкою:
    - фільтрації по role, account_type, is_active
    - сортування по id, email, role, is_active, account_type
    - пагінації
    """
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]

    # 🔹 додаємо фільтрацію, сортування і пагінацію
    pagination_class = PagePagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = UserFilter
    ordering_fields = ["id", "email", "role", "is_active", "account_type"]
    ordering = ["-id"]


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
            user.account_type = ""  # очищуємо при зміні
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
            user.account_type = ""  # очищуємо при зміні
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
            user.account_type = ""  # очищуємо при зміні
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


class UserAddCarPosterView(generics.ListCreateAPIView):
    """
    Відповідає за список авто конкретного користувача
    і створення нових авто.
    Підтримує:
    - фільтри по status, brand, model
    - сортування по price_usd, brand, model, id
    - кастомну пагінацію
    """
    serializer_class = CarPosterSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PagePagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CarFilter
    ordering_fields = ['id', 'price_usd', 'brand__brand', 'model__model']
    ordering = ['-id']

    def get_queryset(self):
        user_id = self.kwargs.get('pk')
        if self.request.user.id != int(user_id):
            raise PermissionDenied("Ви не можете переглядати авто іншого користувача.")
        return CarPosterModel.objects.filter(user_id=user_id)

    def perform_create(self, serializer):
        """
        Створення авто:
        - перевірка, що користувач створює тільки свої авто
        - обмеження для базового акаунту
        - перевірка на погані слова
        """
        user_id = self.kwargs.get('pk')
        if self.request.user.id != int(user_id):
            raise PermissionDenied("Ви не можете створювати оголошення від імені іншого користувача.")

        user = UserModel.objects.get(pk=user_id)

        # обмеження для базового акаунту
        if user.account_type == 'basic' and user.cars.count() >= 1:
            raise PermissionDenied("Користувач з базовим акаунтом може мати лише одне оголошення.")

        instance = serializer.save(user=user)

        # перевірка опису на погані слова
        if contains_bad_words(instance.description):
            instance.status = 'draft'
            instance.save()

    def create(self, request, *args, **kwargs):
        """
        Після створення додаємо повідомлення залежно від опису авто.
        Додано: дружня обробка PermissionDenied.
        """
        try:
            response = super().create(request, *args, **kwargs)
        except PermissionDenied as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)

        instance = CarPosterModel.objects.get(pk=response.data['id'])

        if contains_bad_words(instance.description):
            message = (
                "Опис створеного оголошення містить нецензурну лексику. "
                "Оголошення збережено зі статусом 'чернетка'."
            )
        else:
            message = "Оголошення успішно створене та активоване."

        response.data['message'] = message
        return response


class SendEmailTestView(GenericAPIView):
    permission_classes = (AllowAny,)

    def get(self, *args, **kwargs):
        template = get_template('test_email.html')
        html_content = template.render({'name': 'DJANGO'})
        msg = EmailMultiAlternatives(
            subject="Test Email",
            from_email=os.environ.get('EMAIL_HOST_USER'),
            to=['a_smaga@i.ua']
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return Response({'message': 'Email sent!'}, status.HTTP_200_OK)


class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrManagerOrAdmin]

    def get_serializer_class(self):
        """🔹 Визначає, який серіалізатор використовувати."""
        user = self.request.user
        if user.is_authenticated and getattr(user, "role", None) in ["manager", "admin"]:
            return AdminUserUpdateSerializer
        return UserSerializer

    def update(self, request, *args, **kwargs):
        """🔹 Контролює, які поля можна змінювати користувачу залежно від його ролі."""
        instance = self.get_object()
        current_user = request.user
        data = request.data.copy()

        # === 🔒 1) Звичайні користувачі (buyer/seller)
        if current_user.role in ["buyer", "seller"]:
            if instance.id != current_user.id:
                return Response(
                    {"detail": "Ви можете редагувати лише власний профіль."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # ✅ Дозволяємо змінювати лише 'role' і 'profile'
            allowed_fields = ["role", "profile"]
            for field in list(data.keys()):
                if field not in allowed_fields:
                    data.pop(field, None)

            # ❌ Забороняємо змінювати роль на manager або admin
            new_role = data.get("role")
            if new_role and new_role not in ["buyer", "seller"]:
                return Response(
                    {"detail": "Ви можете змінювати роль лише між buyer та seller."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        # === 🔐 2) Менеджери
        elif current_user.role == "manager":
            # ❌ Менеджер не може змінювати роль на admin чи manager
            new_role = data.get("role")
            if new_role and new_role not in ["buyer", "seller"]:
                return Response(
                    {"detail": "Менеджер може змінювати роль лише між buyer та seller."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        # === 🔓 3) Адмін — без обмежень
        # (нічого не обмежуємо, все дозволено)

        # --- серіалізація і збереження
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)

        # --- оновлення з логікою деактивації
        self.perform_update(serializer)

        response_data = serializer.data
        extra_message = getattr(self, "extra_message", None)
        if extra_message:
            response_data["message"] = extra_message
        else:
            response_data["message"] = "Дані користувача успішно оновлено."

        return Response(response_data)

    def perform_update(self, serializer):
        """🔸 Логіка деактивації авто, якщо роль змінено з seller на buyer."""
        user_before = self.get_object()
        user_after = serializer.save()

        self.extra_message = None
        if user_before.role == "seller" and user_after.role == "buyer":
            from apps.car.models import CarPosterModel

            active_cars = CarPosterModel.objects.filter(user=user_after, status="active")
            deactivated_count = active_cars.update(status="draft")

            if deactivated_count:
                self.extra_message = (
                    f"Роль змінено з 'seller' на 'buyer'. Деактивовано {deactivated_count} оголошень."
                )


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=200)
