from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from core.services.banned_words_service import contains_bad_words

from apps.car.filter import CarFilter
from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel
from apps.car.serializers import BannedWordsSerializer, CarBrandSerializer, CarModelSerializer, CarPosterSerializer
from apps.statistic.models import CarViewModel
from apps.statistic.services import register_car_view
from apps.user.permissions import EditCarPosterPermission


class CarBrandListCreateView(ListCreateAPIView):
    serializer_class = CarBrandSerializer
    queryset = CarBrandModel.objects.all()
    filterset_class = CarFilter

class CarBrandRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = CarBrandSerializer
    queryset = CarBrandModel.objects.all()


class CarModelListCreateView(ListCreateAPIView):
    serializer_class = CarModelSerializer
    queryset = CarModelModel.objects.all()
    filterset_class = CarFilter

class CarModelRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = CarModelSerializer
    queryset = CarModelModel.objects.all()


class CarListCreateView(ListAPIView):
    #тепер тут створювати cars ми не можемо
    serializer_class = CarPosterSerializer
    queryset = CarPosterModel.objects.all()
    filterset_class = CarFilter
    permission_classes = (AllowAny,)
    # permission_classes = (IsAuthenticated,)

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