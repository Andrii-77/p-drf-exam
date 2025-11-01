import os

from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import OrderingFilter
from rest_framework.generics import GenericAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.pagination import PagePagination
from core.services.banned_words_service import contains_bad_words
from django_filters.rest_framework import DjangoFilterBackend

from apps.car.filter import CarFilter
from apps.car.models import CarPosterModel
from apps.car.serializers import CarPosterSerializer
from apps.user.permissions import IsOwnerOrManagerOrAdmin
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
    permission_classes = [AllowAny]

    # 🔹 додаємо фільтрацію, сортування і пагінацію
    pagination_class = PagePagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = UserFilter
    ordering_fields = ["id", "email", "role", "is_active", "account_type"]
    ordering = ["-id"]


# # 20251028 Оновлюю цей клас, щоб на фронтенді була можливість сортування і фільтрації
# class UserListCreateView(ListCreateAPIView):
#     queryset = UserModel.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]


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
        Після створення додаємо повідомлення залежно від опису авто
        """
        response = super().create(request, *args, **kwargs)
        instance = CarPosterModel.objects.get(pk=response.data['id'])

        if contains_bad_words(instance.description):
            message = "Опис створеного оголошення містить нецензурну лексику. Оголошення збережено зі статусом 'чернетка'."
        else:
            message = "Оголошення успішно створене та активоване."

        response.data['message'] = message
        return response


# # 20251011 Змінюю цей клас, щоб була підтримка фільтрів
# class UserAddCarPosterView(generics.ListCreateAPIView):
#     serializer_class = CarPosterSerializer
#     permission_classes = [IsAuthenticated]
#     pagination_class = PagePagination  # твоя кастомна пагінація
#     filterset_class = CarFilter
#
#     def get_queryset(self):
#         user_id = self.kwargs.get('pk')  # або як ти називаєш параметр у URL
#         if self.request.user.id != int(user_id):
#             raise PermissionDenied("Ви не можете переглядати авто іншого користувача.")
#         # Фільтруємо машини конкретного користувача
#         return CarPosterModel.objects.filter(user_id=user_id)
#
#     def perform_create(self, serializer):
#         user_id = self.kwargs.get('pk')
#         if self.request.user.id != int(user_id):
#             raise PermissionDenied("Ви не можете створювати оголошення від імені іншого користувача.")
#
#         user = UserModel.objects.get(pk=user_id)
#         if user.account_type == 'basic' and user.cars.count() >= 1:
#             raise PermissionDenied("Користувач з базовим акаунтом може мати лише одне оголошення.")
#
#         instance = serializer.save(user=user)
#
#         # Перевірка опису на погані слова
#         if contains_bad_words(instance.description):
#             instance.status = 'draft'  # або як там статус чорновика називається
#             instance.save()
#
#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         instance = CarPosterModel.objects.get(pk=response.data['id'])
#         if contains_bad_words(instance.description):
#             message = "Опис створеного оголошення містить нецензурну лексику. Оголошення збережено зі статусом 'чорновик'."
#         else:
#             message = "Оголошення успішно створене та активоване."
#
#         response.data['message'] = message
#         return response


# class UserAddCarPosterView(GenericAPIView):
#     queryset = UserModel.objects.all()
#     permission_classes = [IsAuthenticated]
#     pagination_class = PagePagination  # призначаємо кастомну пагінацію
#
#     def get(self, request, *args, **kwargs):
#         user = self.get_object()
#         if self.request.user != user:
#             raise PermissionDenied("Ви не можете переглядати авто іншого користувача.")
#
#         cars = user.cars.all()
#
#         # застосовуємо пагінацію до queryset
#         page = self.paginate_queryset(cars)
#         if page is not None:
#             serializer = CarPosterSerializer(page, many=True, context={'request': request})
#             return self.get_paginated_response(serializer.data)
#
#         # якщо пагінація не застосовується, повертаємо все
#         serializer = CarPosterSerializer(cars, many=True, context={'request': request})
#         return Response(serializer.data, status=200)
#
#     # def get(self, request, *args, **kwargs):
#     #     user = self.get_object()
#     #     if self.request.user != user:
#     #         raise PermissionDenied("Ви не можете переглядати авто іншого користувача.")
#     #
#     #     cars = user.cars.all()  # тут уже всі машини користувача
#     #     serializer = CarPosterSerializer(cars, many=True, context={'request': request})
#     #     return Response(serializer.data, status=status.HTTP_200_OK)
#
#
#     def post(self, *args, **kwargs):
#         user = self.get_object()
#         data = self.request.data
#         if user.account_type == 'basic' and user.cars.count() >= 1:
#             raise PermissionDenied("Користувач з базовим акаунтом може мати лише одне оголошення.")
#         if self.request.user != user:
#             raise PermissionDenied("Ви не можете створювати оголошення від імені іншого користувача.")
#         serializer = CarPosterSerializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         # serializer.save(user=user)
#         # user_serializer = UserSerializer(user)
#         # return Response(user_serializer.data, status.HTTP_201_CREATED)
#         instance = serializer.save(user=user)
#
#         # Додаємо повідомлення в залежності від опису
#         if contains_bad_words(instance.description):
#             message = "Опис створеного оголошення містить нецензурну лексику. Оголошення збережено зі статусом 'чорновик'."
#         else:
#             message = "Оголошення успішно створене та активоване."
#
#         # user_serializer = UserSerializer(user)
#         # response_data = user_serializer.data
#         # response_data['message'] = message
#         # return Response(response_data, status=status.HTTP_201_CREATED)
#         # Тут повідомлення йде після опису юзері і його списку авто.
#
#         car_data = CarPosterSerializer(instance).data
#         car_data['message'] = message
#         return Response(car_data, status=status.HTTP_201_CREATED)
#         # Тут виводиться тільки створене авто і в кінці йде повідомлення до цього оголошення.


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

# 20251101 Змінюю, щоб адмін і менеджер могли редагувати role, account_type, is_active.
# class UserDetailView(RetrieveUpdateDestroyAPIView):
#     queryset = UserModel.objects.all()
#     serializer_class = UserSerializer
#
#     def get_permissions(self):
#         if self.request.method == 'GET':
#             return [AllowAny()]  # будь-хто може побачити юзера
#         return [IsAuthenticated(), IsOwnerOrManagerOrAdmin()]  # редагувати/видалити — тільки з правами

class UserDetailView(RetrieveUpdateDestroyAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated(), IsOwnerOrManagerOrAdmin()]

    def get_serializer_class(self):
        """
        Менеджер або адміністратор можуть змінювати role, account_type і is_active.
        Власник — лише свої особисті дані.
        """
        user = self.request.user
        if user.is_authenticated and getattr(user, "role", None) in ["manager", "admin"]:
            return AdminUserUpdateSerializer
        return UserSerializer


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data, status=200)
