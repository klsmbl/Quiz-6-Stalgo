from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from users.permissions import IsAdminRole

from .models import SellerApplication
from .serializers import SellerApplicationSerializer

User = get_user_model()


class SubmitApplicationView(generics.CreateAPIView):
    serializer_class = SellerApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        application, created = SellerApplication.objects.get_or_create(user=request.user)

        if not created and application.status == SellerApplication.STATUS_PENDING:
            return Response(
                {"detail": "Application is already pending."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        application.status = SellerApplication.STATUS_PENDING
        application.decline_reason = ""
        application.save()

        serializer = self.get_serializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ListApplicationView(generics.ListAPIView):
    queryset = SellerApplication.objects.select_related("user").all().order_by("-created_at")
    serializer_class = SellerApplicationSerializer
    permission_classes = [IsAdminRole]


class ApproveApplicationView(generics.GenericAPIView):
    queryset = SellerApplication.objects.select_related("user").all()
    serializer_class = SellerApplicationSerializer
    permission_classes = [IsAdminRole]

    def post(self, request, pk, *args, **kwargs):
        merchant_id = request.data.get("merchant_id")
        if not merchant_id:
            return Response(
                {"detail": "merchant_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        application = self.get_object()
        user = application.user

        application.status = SellerApplication.STATUS_APPROVED
        application.decline_reason = ""
        application.save()

        user.role = User.ROLE_SELLER
        user.merchant_id = merchant_id
        user.save(update_fields=["role", "merchant_id"])

        return Response(self.get_serializer(application).data)


class DeclineApplicationView(generics.GenericAPIView):
    queryset = SellerApplication.objects.select_related("user").all()
    serializer_class = SellerApplicationSerializer
    permission_classes = [IsAdminRole]

    def post(self, request, pk, *args, **kwargs):
        reason_for_decline = request.data.get("reason_for_decline")
        if not reason_for_decline:
            return Response(
                {"detail": "reason_for_decline is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        application = self.get_object()
        application.status = SellerApplication.STATUS_DECLINED
        application.decline_reason = reason_for_decline
        application.save(update_fields=["status", "decline_reason"])

        return Response(self.get_serializer(application).data)
