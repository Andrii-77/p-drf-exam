from rest_framework import generics, status
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.services.banned_words_service import contains_bad_words
from django_filters.rest_framework import DjangoFilterBackend

from apps.car.filter import CarFilter
from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel
from apps.car.serializers import BannedWordsSerializer, CarBrandSerializer, CarModelSerializer, CarPosterSerializer
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
    serializer_class = CarPosterSerializer
    permission_classes = (AllowAny,)

    # Підключаємо фільтри та сортування
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = CarFilter

    # дозволені поля для ordering; для brand/model — вказуємо повні шляхові поля
    ordering_fields = ['id', 'price_usd', 'brand__brand', 'model__model']
    ordering = ['-id']  # дефолтне сортування

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and (
                user.is_staff or getattr(user, 'role', None) in ['manager', 'admin']
        ):
            return CarPosterModel.objects.all()
        return CarPosterModel.objects.filter(status='active')

class CarRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = CarPosterModel.objects.all()
    serializer_class = CarPosterSerializer
    permission_classes = [EditCarPosterPermission]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

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

        # --- Зберігаємо старі дані ---
        old_data = {
            'description': instance.description,
            'original_price': instance.original_price,
            'original_currency': instance.original_currency,
            'location': instance.location,
            'brand_id': instance.brand_id,
            'model_id': instance.model_id,
        }

        # --- Оновлюємо ---
        instance = serializer.save()

        # --- Перевірка на нецензурну лексику ---
        if contains_bad_words(instance.description):
            if instance.edit_attempts >= 3:
                message = (
                    "⚠️ Опис містить нецензурну лексику. "
                    "Закінчилися три спроби редагування — оголошення передано менеджеру на перевірку."
                    f"Поточний статус: {instance.status}."
                )
            else:
                message = (
                    "⚠️ Опис містить нецензурну лексику. "
                    "Оголошення збережено зі статусом 'чернетка'."
                    f"Поточний статус: {instance.status}."
                )
        else:
            # --- Перевіряємо, які поля змінились ---
            changed_fields = []
            field_names = {
                'description': 'опис',
                'original_price': 'ціна',
                'original_currency': 'валюта',
                'location': 'локація',
                'brand_id': 'бренд',
                'model_id': 'модель',
            }

            for field, old_value in old_data.items():
                new_value = getattr(instance, field)
                if new_value != old_value:
                    changed_fields.append(field_names.get(field, field))

            if changed_fields:
                message = (
                    f"✅ Оголошення оновлено. "
                    f"Змінено: {', '.join(changed_fields)}. "
                    f"Поточний статус: {instance.status}."
                )
            else:
                message = f"ℹ️ Дані не змінено. Поточний статус: {instance.status}."

        # --- Формуємо фінальну відповідь ---
        response_data = self.get_serializer(instance).data
        response_data['message'] = message
        return Response(response_data, status=status.HTTP_200_OK)


class BannedWordsListCreateView(ListCreateAPIView):
    serializer_class = BannedWordsSerializer
    queryset = BannedWordsModel.objects.all()


class BannedWordsRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = BannedWordsSerializer
    queryset = BannedWordsModel.objects.all()
