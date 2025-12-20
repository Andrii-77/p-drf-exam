from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from core.services.email_service import EmailService
from django_filters.rest_framework import DjangoFilterBackend

from ..car.models import CarBrandModel
from ..car.serializers import CarBrandSerializer
from ..user.permissions import IsManagerOrAdmin
from .filters import SupportRequestFilter
from .models import SupportRequestModel
from .serializers import SupportRequestProcessSerializer, SupportRequestSerializer


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


class SupportRequestProcessView(generics.RetrieveUpdateAPIView):
    """
    - GET: перегляд конкретної заявки (менеджер/адмін).
    - PATCH/PUT: оновлення тільки processed.
    """

    queryset = SupportRequestModel.objects.all()
    permission_classes = [IsAuthenticated, IsManagerOrAdmin]
    # serializer_class = SupportRequestProcessSerializer
    # lookup_field = "id"

    def get_serializer_class(self):
        if self.request.method in ["PATCH", "PUT"]:
            return SupportRequestProcessSerializer
        return SupportRequestSerializer

class SupportBrandsListView(generics.ListAPIView):
    """
    Повертає всі бренди авто (для фільтрації support requests типу 'model').
    """
    queryset = CarBrandModel.objects.all()
    serializer_class = CarBrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None  # без пагінації