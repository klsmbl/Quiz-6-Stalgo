from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def api_root(request):
    return Response(
        {
            "name": "Get Routes",
            "message": "Carpet and Upholstery Marketplace API",
            "version": "v1",
            "routes": {
                "users": "/api/v1/users/",
                "applications": "/api/v1/applications/",
                "services": "/api/v1/services/",
                "orders": "/api/v1/orders/",
                "chat": "/api/v1/chat/",
                "admin": "/admin/",
            },
        }
    )
