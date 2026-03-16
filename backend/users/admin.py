from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUserModel


@admin.register(CustomUserModel)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (
            "Marketplace Profile",
            {
                "fields": (
                    "phone_number",
                    "location",
                    "gender",
                    "role",
                    "merchant_id",
                )
            },
        ),
    )
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "merchant_id",
        "is_staff",
    )
