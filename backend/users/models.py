from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUserModel(AbstractUser):
    ROLE_ADMIN = "Admin"
    ROLE_SELLER = "Seller"
    ROLE_USER = "User"

    ROLE_CHOICES = [
        (ROLE_ADMIN, "Admin"),
        (ROLE_SELLER, "Seller"),
        (ROLE_USER, "User"),
    ]

    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Non-binary", "Non-binary"),
        ("Prefer not to say", "Prefer not to say"),
    ]

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=30, blank=True)
    location = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=30, choices=GENDER_CHOICES, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_USER)
    merchant_id = models.CharField(max_length=120, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
