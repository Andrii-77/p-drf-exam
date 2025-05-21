from rest_framework import serializers

from apps.car.models import CarPosterModel

# class CarBrandSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CarBrandModel
#         fields = ('id', 'name', 'updated_at', 'created_at')
#
#
# class CarModelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CarModelModel
#         fields = ('id', 'brand', 'name', 'updated_at', 'created_at')

class CarPosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPosterModel
        fields = ('id', 'brand', 'model', 'description', 'price', 'currency', 'location', 'updated_at', 'created_at')