from rest_framework import serializers

from ..car.models import CarBrandModel, CarModelModel
from .models import SupportRequestModel


class SupportRequestSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    brand_name = serializers.CharField(source="brand.brand", read_only=True)

    class Meta:
        model = SupportRequestModel
        fields = (
            "id",
            "type",
            "text",
            "brand",
            "user",
            "processed",
            "updated_at",
            "created_at",
            "user_email",
            "brand_name",
            "type_display",
        )
        read_only_fields = ("id", "created_at", "updated_at", "user", "processed")

    def validate(self, attrs):
        """
        Додаткова валідація:
        - якщо type == "model", то поле brand обов'язкове
        - перевірка, чи бренд/модель вже існують у БД (без урахування регістру)
        """
        from apps.car.models import CarBrandModel, CarModelModel  # імпорт тут, щоб уникнути циклів

        req_type = attrs.get("type")
        text_raw = (attrs.get("text") or "").strip()  # те, що ввів користувач
        text = text_raw.lower()  # для пошуку
        brand = attrs.get("brand")

        # 1. Якщо type = model -> обов'язковий brand
        if req_type == "model" and not brand:
            raise serializers.ValidationError(
                {"brand": "Для моделі потрібно вказати бренд."}
            )

        # 2. Якщо type = brand -> перевіряємо, чи бренд вже існує
        if req_type == "brand":
            existing_brand = CarBrandModel.objects.filter(brand__iexact=text).first()
            if existing_brand:
                raise serializers.ValidationError(
                    {
                        "text": (
                            f"Бренд '{text_raw}' вже існує як '{existing_brand.brand}'."
                        )
                    }
                )

        # 3. Якщо type = model -> перевіряємо, чи модель вже існує у цього бренду
        if req_type == "model" and brand:
            existing_model = CarModelModel.objects.filter(
                brand=brand, model__iexact=text
            ).first()
            if existing_model:
                raise serializers.ValidationError(
                    {
                        "text": (
                            f"Модель '{text_raw}' вже існує у бренду "
                            f"'{brand.brand}' як '{existing_model.model}'."
                        )
                    }
                )

        return attrs

    # def validate(self, attrs):
    #     """
    #     Додаткова валідація:
    #     - якщо type == "model", то поле brand обов'язкове
    #     """
    #     if attrs.get("type") == "model" and not attrs.get("brand"):
    #         raise serializers.ValidationError(
    #             {"brand": "Для моделі потрібно вказати бренд."}
    #         )
    #     return attrs

class SupportRequestProcessSerializer(serializers.ModelSerializer):
    """Серіалізатор для оновлення тільки processed"""
    class Meta:
        model = SupportRequestModel
        fields = ["id", "processed"]
        read_only_fields = ["id"]