from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse(
        {"status": "ok", "message": "HRMS Lite Backend is running"}
    )


urlpatterns = [
    path("api/employees/", EmployeeListCreateView.as_view()),
    path("api/employees/<int:pk>/", EmployeeDeleteView.as_view()),

    path("api/attendance/", AttendanceCreateView.as_view()),       
    path("api/attendance/<int:employee_id>/", AttendanceListView.as_view()),
]