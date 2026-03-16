from django.urls import path

from .views import AdminUserListView, MyTokenObtainPairView, RegisterView, UserProfileView

urlpatterns = [
    path("login/", MyTokenObtainPairView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
]
