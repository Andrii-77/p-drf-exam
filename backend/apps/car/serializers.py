from rest_framework import serializers

from core.services.banned_words_service import contains_bad_words
from core.services.email_service import EmailService

from apps.car.models import BannedWordsModel, CarBrandModel, CarModelModel, CarPosterModel


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
        fields = ('id', 'brand', 'model', 'description', 'price', 'currency', 'location', 'status', 'edit_attempts',
                  'updated_at', 'created_at')
        # read_only_fields = ['status', 'edit_attempts']  # щоб не підміняли вручну

    def validate_price(self, price):
        if price <= 0:
            raise serializers.ValidationError('Price must be greater than 0.')
        return price

    def create(self, validated_data):
        description = validated_data.get('description', '')
        if contains_bad_words(description):
            validated_data['status'] = 'draft'
            validated_data['edit_attempts'] = 1
        else:
            validated_data['status'] = 'active'
            validated_data['edit_attempts'] = 0
        return super().create(validated_data)

    def update(self, instance, validated_data):
        description = validated_data.get('description', instance.description)

        if contains_bad_words(description):
            # збільшуємо кількість спроб редагування
            instance.edit_attempts += 1

            if instance.edit_attempts >= 3:
                instance.status = 'inactive'
                EmailService. manager_email_for_car_poster_edit(car=instance)
            else:
                instance.status = 'draft'

        else:
            instance.status = 'active'
            instance.edit_attempts = 0  # скидаємо лічильник при успішній модерації

        instance.description = description
        instance.save()
        return instance


class BannedWordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BannedWordsModel
        fields = ('id', 'word', 'updated_at', 'created_at')
