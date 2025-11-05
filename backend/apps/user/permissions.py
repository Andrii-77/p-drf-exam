from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

from apps.user.utils.access import has_premium_access


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
        Перевірка прав доступу до оголошення (CarPosterModel):

        - Перегляд дозволений всім.
        - Редагування/видалення дозволене лише:
            - власнику, якщо оголошення не є неактивним;
            - менеджеру або адміну — завжди.
        - Якщо користувач не має відповідних прав, він отримає пояснювальне повідомлення.
        """

    def has_object_permission(self, request, view, obj):
        # Перегляд дозволяємо всім (у тому числі неавторизованим)
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True

        # Для всього іншого — перевірка прав
        user = request.user

        if not user.is_authenticated:
            raise PermissionDenied("Неавторизовані користувачі не можуть змінювати дані.")

        # Власник може редагувати лише, якщо оголошення не є неактивним
        if user == obj.user:
            if obj.status == 'inactive':
                raise PermissionDenied("Ви не можете редагувати оголошення зі статусом 'неактивне'.")
            return True

        # Менеджер або адміністратор мають повний доступ
        if user.is_staff:
            return True

        if hasattr(user, 'role') and user.role in ['manager', 'admin']:
            return True

        raise PermissionDenied("У вас немає прав змінювати або видаляти це оголошення.")

    # """
    # - Перегляд дозволений всім.
    # - Редагування/видалення дозволене лише власнику, менеджеру або адміну.
    # """
    #
    # def has_object_permission(self, request, view, obj):
    #     # Перегляд дозволяємо всім (навіть неавторизованим, якщо інше не заборонено)
    #     if request.method in ('GET', 'HEAD', 'OPTIONS'):
    #         return True
    #
    #     # Для всього іншого — перевірка прав
    #     user = request.user
    #
    #     if not user.is_authenticated:
    #         raise PermissionDenied("Неавторизовані користувачі не можуть змінювати дані.")
    #
    #     if user == obj.user and obj.status != 'inactive':
    #         return True
    #
    #     if user.is_staff:
    #         return True
    #
    #     if hasattr(user, 'role') and user.role in ['manager', 'admin']:
    #         return True
    #
    #     raise PermissionDenied("У вас немає прав змінювати або видаляти це оголошення.")

class IsOwnerOrManagerOrAdmin(BasePermission):
    """
    Дозволяє зміну/видалення лише власнику, менеджеру або адміну.
    """

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        # Якщо адміністратор або менеджер
        if getattr(user, "is_superuser", False) or getattr(user, "role", None) in ("manager", "admin"):
            return True

        # Якщо власник (перевірка, що користувач редагує сам себе)
        if obj == user:
            return True

        return False


# # 20251105 Роблю маленькі зміни по пораді ШІ, цей код коментую, новий зверху.
# class IsOwnerOrManagerOrAdmin(BasePermission):
#     """
#     Дозволяє зміну/видалення лише власнику, менеджеру або адміну.
#     """
#
#     def has_object_permission(self, request, view, obj):
#         user = request.user
#
#         if not user.is_authenticated:
#             raise PermissionDenied("Неавторизовані користувачі не мають доступу.")
#
#         # Перевірка ролей або статусу
#         if user.is_superuser or getattr(user, "role") in ("manager", "admin"):
#             return True
#
#         # Власник (наприклад, user переглядає/редагує свої дані)
#         if obj == user:
#             return True  # власник акаунта
#
#         raise PermissionDenied("У вас немає прав доступу до цього користувача.")


class HasPremiumAccessPermission(BasePermission):
    """
    Дозволяє доступ користувачу, якщо:
    - він є власником об'єкта і має тип акаунту 'premium'
    - або має роль 'manager' чи 'admin'
    """

    def has_object_permission(self, request, view, obj):
        if has_premium_access(request.user, obj.user):
            return True
        raise PermissionDenied("Доступ дозволений лише преміум-продавцю, менеджеру або адміну.")


class IsManagerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user.is_authenticated and (
                    request.user.is_staff or getattr(request.user, 'role', None) in ['manager', 'admin']
            )
        )

# Ще один варіант IsManagerOrAdmin, але завжди буде видавати одне повідомлення і для неавторизованих
# і для авторизованих але без права доступу:
# class IsManagerOrAdmin(BasePermission):
#     message = "У вас немає прав доступу."
#
#     def has_permission(self, request, view):
#         return bool(
#             getattr(request.user, 'is_staff', False) or
#             getattr(request.user, 'role', None) in ['manager', 'admin']
#         )
# Але це НЕ ДАСТЬ ЗРОЗУМІТИ чи треба користувача залогінити, чи просто показати повідомлення про відсутність прав.