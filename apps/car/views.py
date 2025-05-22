from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.request import Request

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel
from apps.car.serializers import CarBrandSerializer, CarModelSerializer, CarPosterSerializer


class CarBrandListCreateView(ListCreateAPIView):
    serializer_class = CarBrandSerializer
    queryset = CarBrandModel.objects.all()

class CarBrandRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = CarBrandSerializer
    queryset = CarBrandModel.objects.all()


class CarModelListCreateView(ListCreateAPIView):
    serializer_class = CarModelSerializer
    queryset = CarModelModel.objects.all()

class CarModelRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    serializer_class = CarModelSerializer
    queryset = CarModelModel.objects.all()


class CarListCreateView(ListCreateAPIView):
    serializer_class = CarPosterSerializer
    queryset = CarPosterModel.objects.all()
    #тут прописати фільтр замість попереднього рядка

class CarRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = CarPosterModel.objects.all()
    serializer_class = CarPosterSerializer