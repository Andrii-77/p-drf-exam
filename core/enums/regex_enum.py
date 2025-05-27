from enum import Enum


class RegexEnum(Enum):
    BRANDNAME = (
        r'^[A-Z][a-zA-Z0-9- ]{1,49}$',
        'Name must start with a capital letter and contain only letters, numbers, spaces, or hyphens (2–50 characters).'
    )

    MODELNAME = (
        r'^[A-Za-z0-9][A-Za-z0-9- ]{1,49}$',
        'Name must contain only letters, numbers, spaces, or hyphens (2–50 characters).'
    )

    def __init__(self, pattern:str, msg:str):
        self.pattern = pattern
        self.msg = msg