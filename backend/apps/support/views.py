from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated

from core.services.email_service import EmailService
from django_filters.rest_framework import DjangoFilterBackend

from ..user.permissions import IsManagerOrAdmin
from .filters import SupportRequestFilter
from .models import SupportRequestModel
from .serializers import SupportRequestSerializer


class SupportRequestListCreateView(generics.ListCreateAPIView):
    """
    - POST: створення нових заявок (авторизовані користувачі).
    - GET: перегляд заявок (доступно лише для менеджера та адміна).
    """

    queryset = SupportRequestModel.objects.all()
    serializer_class = SupportRequestSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = SupportRequestFilter

    # поля, по яких дозволене сортування
    ordering_fields = ["created_at", "updated_at"]
    # дефолтне сортування
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        # GET доступно тільки для staff (менеджери + адміни)
        return [IsManagerOrAdmin()]

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        # надсилаємо повідомлення менеджерам/адміну
        EmailService.support_request(instance)




# from rest_framework import generics, permissions
#
# from core.services.email_service import EmailService
#
# from .models import SupportRequestModel
# from .serializers import SupportRequestSerializer
#
#
# class SupportRequestCreateView(generics.CreateAPIView):
#     """
#     View для створення запитів support (відсутній бренд або модель).
#     Доступна лише для авторизованих користувачів.
#     """
#     queryset = SupportRequestModel.objects.all()
#     serializer_class = SupportRequestSerializer
#     permission_classes = [permissions.IsAuthenticated]
#
#     def perform_create(self, serializer):
#         instance = serializer.save(
#             user=self.request.user if self.request.user.is_authenticated else None
#         )
#
#         # Відправляємо повідомлення менеджерам/адміну
#         EmailService.support_request(instance)