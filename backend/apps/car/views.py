from django.db.models import Q

from rest_framework import generics, status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from core.services.banned_words_service import contains_bad_words
from django_filters.rest_framework import DjangoFilterBackend

from apps.car.filter import CarFilter
from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel
from apps.car.serializers import BannedWordsSerializer, CarBrandSerializer, CarModelSerializer, CarPosterSerializer
from apps.statistic.models import CarViewModel
from apps.statistic.services import register_car_view
from apps.user.mixins import ReadOnlyOrManagerAdminMixin
from apps.user.permissions import EditCarPosterPermission


class CarBrandListCreateView(ReadOnlyOrManagerAdminMixin, ListCreateAPIView):
    serializer_class = CarBrandSerializer
    queryset = CarBrandModel.objects.all()
    # filterset_class = CarFilter
    pagination_class = None  # 🔑 вимикає пагінацію

class CarBrandRetrieveUpdateDestroyView(ReadOnlyOrManagerAdminMixin, RetrieveUpdateDestroyAPIView):
    serializer_class = CarBrandSerializer
    queryset = CarBrandModel.objects.all()


class CarModelListCreateView(ReadOnlyOrManagerAdminMixin, ListCreateAPIView):
    serializer_class = CarModelSerializer
    queryset = CarModelModel.objects.all()
    # filterset_class = CarFilter
    pagination_class = None  # 🔑 вимикає пагінацію
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["brand"]

class CarModelRetrieveUpdateDestroyView(ReadOnlyOrManagerAdminMixin, RetrieveUpdateDestroyAPIView):
    serializer_class = CarModelSerializer
    queryset = CarModelModel.objects.all()


class CarListCreateView(generics.ListAPIView):
    #тепер тут створювати cars ми не можемо
    serializer_class = CarPosterSerializer
    # queryset = CarPosterModel.objects.all()
    filterset_class = CarFilter
    permission_classes = (AllowAny,)
    # permission_classes = (IsAuthenticated,)

    # Виводить лише активні оголошення незалежно від того, чи користувач авторизований.
    # def get_queryset(self):
    #     return CarPosterModel.objects.filter(status='active')

    def get_queryset(self):
        user = self.request.user

        # Менеджер або адміністратор бачать все
        if user.is_authenticated and (
                user.is_staff or getattr(user, 'role', None) in ['manager', 'admin']
        ):
            return CarPosterModel.objects.all()

        # Для всіх інших — лише активні
        return CarPosterModel.objects.filter(status='active')

    #
    #     # Якщо неавторизований — лише активні оголошення
    #     if not user.is_authenticated:
    #         return CarPosterModel.objects.filter(status='active')
    #
    #
    #     # Авторизований користувач бачить активні + свої оголошення
    #     return CarPosterModel.objects.filter(
    #         Q(status='active') | Q(user=user)
    #     )

        # return CarPosterModel.objects.filter(
        #     status='active'
        # ) | CarPosterModel.objects.filter(user=user)


    # def get_queryset(self):
    #     user = self.request.user
    #
    #     if user.is_authenticated and (user.is_staff or getattr(user, 'role', None) in ['manager', 'admin']):
    #         return CarPosterModel.objects.all()
    #
    #     if user.is_authenticated:
    #         return CarPosterModel.objects.filter(models.Q(status='active') | models.Q(user=user))
    #
    #     return CarPosterModel.objects.filter(status='active')



class CarRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = CarPosterModel.objects.all()
    serializer_class = CarPosterSerializer
    permission_classes = [EditCarPosterPermission]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    # def retrieve(self, request, *args, **kwargs):
    #     response = super().retrieve(request, *args, **kwargs)
    #
    #     car = self.get_object()
    #
    #     # Не записуємо перегляд, якщо користувач — власник
    #     if not request.user.is_authenticated or request.user != car.user:
    #         CarViewModel.objects.create(car=car)
    #
    #     return response

    def retrieve(self, request, *args, **kwargs):
        car = self.get_object()
        response = super().retrieve(request, *args, **kwargs)

        # Реєстрація перегляду (з перевіркою дубліката і виключенням власника)
        register_car_view(request, car)

        return response

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        if contains_bad_words(instance.description):
            if instance.edit_attempts >= 3:
                message = (
                    "Закінчились три спроби редагування опису. Оголошення передано менеджеру на перевірку."
                )
            else:
                message = "Опис містить нецензурну лексику. Оголошення збережено зі статусом 'чернетка'."
        else:
            message = "Опис оновлено. Оголошення активоване."

        response_data = self.get_serializer(instance).data
        response_data['message'] = message

        return Response(response_data, status=status.HTTP_200_OK)


class BannedWordsListCreateView(ListCreateAPIView):
    serializer_class = BannedWordsSerializer
    queryset = BannedWordsModel.objects.all()

class BannedWordsRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = BannedWordsSerializer
    queryset = BannedWordsModel.objects.all()