from rest_framework import generics, permissions

from users.permissions import IsSellerRole

from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.select_related("seller").all().order_by("id")
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]


class ServiceDetailView(generics.RetrieveAPIView):
    queryset = Service.objects.select_related("seller").all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]


class SellerServiceManageView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsSellerRole]

    def get_queryset(self):
        return Service.objects.filter(seller=self.request.user).order_by("id")

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class SellerServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated, IsSellerRole]

    def get_queryset(self):
        return Service.objects.filter(seller=self.request.user)
