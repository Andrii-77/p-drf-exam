from rest_framework import serializers

from apps.car.models import CarBrandModel, CarModelModel, CarPosterModel


class CarBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrandModel
        # fields = ('id', 'brand', 'updated_at', 'created_at')
        fields = ('brand',)


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModelModel
        # fields = ('id', 'brand', 'model', 'updated_at', 'created_at')
        fields = ('model',)

class CarPosterSerializer(serializers.ModelSerializer):
    # brand = CarBrandSerializer(read_only=True)
    # model = CarModelSerializer(read_only=True)
    brand = CarBrandSerializer
    model = CarModelSerializer
    class Meta:
        model = CarPosterModel
        fields = ('id', 'brand', 'model', 'description', 'price', 'currency', 'location', 'updated_at', 'created_at')

    def validate_price(self, price):
        if price <= 0:
            raise serializers.ValidationError('Price must be greater than 0.')
        return price
