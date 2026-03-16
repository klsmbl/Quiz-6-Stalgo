from django.contrib.auth import get_user_model
from rest_framework import exceptions
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "phone_number",
            "first_name",
            "last_name",
            "location",
            "gender",
            "role",
            "merchant_id",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "phone_number",
            "first_name",
            "last_name",
            "location",
            "gender",
            "password",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            phone_number=validated_data.get("phone_number", ""),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            location=validated_data.get("location", ""),
            gender=validated_data.get("gender", ""),
            role=User.ROLE_USER,
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["username"] = user.username
        token["role"] = user.role
        return token

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist as exc:
            raise exceptions.AuthenticationFailed("Invalid email or password.") from exc

        if not user.check_password(password):
            raise exceptions.AuthenticationFailed("Invalid email or password.")

        token = self.get_token(user)
        data = {
            "refresh": str(token),
            "access": str(token.access_token),
        }
        self.user = user
        data["user"] = UserSerializer(self.user).data
        return data
