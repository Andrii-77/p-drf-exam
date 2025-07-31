def has_premium_access(user, obj_user):
    """
    Повертає True, якщо користувач має доступ до преміум-інформації:
    - є власником (obj_user) з типом акаунту 'premium'
    - або має роль 'manager' або 'admin'
    """
    if not user or not user.is_authenticated:
        return False

    is_premium_owner = user == obj_user and getattr(user, 'account_type', None) == 'premium'
    is_manager_or_admin = getattr(user, 'role', None) in ['manager', 'admin']

    return is_premium_owner or is_manager_or_admin