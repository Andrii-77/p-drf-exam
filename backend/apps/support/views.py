from rest_framework import generics, permissions

from core.services.email_service import EmailService

from .models import SupportRequestModel
from .serializers import SupportRequestSerializer


class SupportRequestCreateView(generics.CreateAPIView):
    """
    View для створення запитів support (відсутній бренд або модель).
    Доступна лише для авторизованих користувачів.
    """
    queryset = SupportRequestModel.objects.all()
    serializer_class = SupportRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save(
            user=self.request.user if self.request.user.is_authenticated else None
        )
        print("DEBUG USER:", instance.user, instance.user.email if instance.user else None)
        # Відправляємо повідомлення менеджерам/адміну
        EmailService.support_request(instance)

# app-1                            | DEBUG USER: user3@gmail.com user3@gmail.co