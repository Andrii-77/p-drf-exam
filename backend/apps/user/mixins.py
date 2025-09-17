from rest_framework.permissions import AllowAny

from apps.user.permissions import IsManagerOrAdmin


class ReadOnlyOrManagerAdminMixin:
    """
    - GET/HEAD/OPTIONS -> доступні всім
    - POST/PUT/PATCH/DELETE -> тільки менеджеру або адміну
    """
    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsManagerOrAdmin()]