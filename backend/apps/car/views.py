from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.request import Request

from apps.car.filter import CarFilter
from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel
from apps.car.serializers import BannedWordsSerializer, CarBrandSerializer, CarModelSerializer, CarPosterSerializer


class CarBrandListCreateView(ListCreateAPIView):
    serializer_class = CarBrandSerializer
    queryset = CarBrandModel.objects.all()
    # filterset_class = CarFilter

class CarBrandRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = CarBrandSerializer
    queryset = CarBrandModel.objects.all()


class CarModelListCreateView(ListCreateAPIView):
    serializer_class = CarModelSerializer
    queryset = CarModelModel.objects.all()
    # filterset_class = CarFilter

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

class BannedWordsListCreateView(ListCreateAPIView):
    serializer_class = BannedWordsSerializer
    queryset = BannedWordsModel.objects.all()

class BannedWordsRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = BannedWordsSerializer
    queryset = BannedWordsModel.objects.all()