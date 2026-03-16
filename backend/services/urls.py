from django.urls import path

from .views import (
    SellerServiceDetailView,
    SellerServiceManageView,
    ServiceDetailView,
    ServiceListView,
)

urlpatterns = [
    path("list/", ServiceListView.as_view(), name="service-list"),
    path("<int:pk>/", ServiceDetailView.as_view(), name="service-detail"),
    path("manage/", SellerServiceManageView.as_view(), name="seller-service-manage"),
    path("manage/<int:pk>/", SellerServiceDetailView.as_view(), name="seller-service-detail"),
]
