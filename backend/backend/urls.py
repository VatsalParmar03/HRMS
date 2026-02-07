from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse(
        {"status": "ok", "message": "HRMS Lite Backend is running"}
    )


urlpatterns = [
    path("", health_check),
    path("admin/", admin.site.urls),
    path("api/", include("employees.urls")),
    path("api/", include("attendance.urls")),
]