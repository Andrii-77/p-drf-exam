from rest_framework import serializers

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
        """
        if attrs.get("type") == "model" and not attrs.get("brand"):
            raise serializers.ValidationError(
                {"brand": "Для моделі потрібно вказати бренд."}
            )
        return attrs