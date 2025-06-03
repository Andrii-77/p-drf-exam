from rest_framework import serializers

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel


class CarBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrandModel
        fields = ('id', 'brand', 'updated_at', 'created_at')


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModelModel
        fields = ('id', 'brand', 'model', 'updated_at', 'created_at')


class CarPosterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPosterModel
        fields = ('id', 'brand', 'model', 'description', 'price', 'currency', 'location', 'updated_at', 'created_at')

    def validate_price(self, price):
        if price <= 0:
            raise serializers.ValidationError('Price must be greater than 0.')
        return price
