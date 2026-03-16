from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from .views import api_root

urlpatterns = [
    path("", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    path("api/v1/users/", include("users.urls")),
    path("api/v1/applications/", include("applications.urls")),
    path("api/v1/services/", include("services.urls")),
    path("api/v1/orders/", include("orders.urls")),
    path("api/v1/chat/", include("chat.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
