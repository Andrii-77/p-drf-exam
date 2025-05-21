from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.request import Request

from apps.car.models import CarPosterModel
from apps.car.serializers import CarPosterSerializer


class CarListCreateView(ListCreateAPIView):
    serializer_class = CarPosterSerializer
    queryset = CarPosterModel.objects.all()
    #тут прописати фільтр замість попереднього рядка

class CarRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = CarPosterModel.objects.all()
    serializer_class = CarPosterSerializer