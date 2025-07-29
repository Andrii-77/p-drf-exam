from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff and request.user.is_superuser)


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == 'admin')


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == 'manager')


class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.role == 'seller')


class EditCarPosterPermission(BasePermission):
    """
    - Перегляд дозволений всім.
    - Редагування/видалення дозволене лише власнику, менеджеру або адміну.
    """

    def has_object_permission(self, request, view, obj):
        # Перегляд дозволяємо всім (навіть неавторизованим, якщо інше не заборонено)
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True

        # Для всього іншого — перевірка прав
        user = request.user

        if not user.is_authenticated:
            raise PermissionDenied("Неавторизовані користувачі не можуть змінювати дані.")

        if user == obj.user and obj.status != 'inactive':
            return True

        if user.is_staff:
            return True

        if hasattr(user, 'role') and user.role in ['manager', 'admin']:
            return True

        raise PermissionDenied("У вас немає прав змінювати або видаляти це оголошення.")


class IsOwnerOrManagerOrAdmin(BasePermission):
    """
    Дозволяє зміну/видалення лише власнику, менеджеру або адміну.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user.is_authenticated:
            raise PermissionDenied("Неавторизовані користувачі не мають доступу.")
        
        # Перевірка ролей або статусу
        if user.is_superuser or getattr(user, "role") in ("manager", "admin"):
            return True

        # Власник (наприклад, user переглядає/редагує свої дані)
        if obj == user:
            return True  # власник акаунта

        raise PermissionDenied("У вас немає прав доступу до цього користувача.")
