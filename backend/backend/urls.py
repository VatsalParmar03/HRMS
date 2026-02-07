from django.contrib import admin
from django.urls import path

from employees.views import EmployeeListCreateAPIView, EmployeeDeleteAPIView
from attendance.views import AttendanceCreateAPIView, AttendanceListAPIView


def health_check(request):
    return JsonResponse(
        {"status": "ok", "message": "HRMS Lite Backend is running"}
    )


urlpatterns = [
    #employee
    path("api/employees/", EmployeeListCreateView.as_view()),
    path("api/employees/<int:pk>/", EmployeeDeleteView.as_view()),

    #attendance
    path("api/attendance/", AttendanceCreateView.as_view()),       
    path("api/attendance/<int:employee_id>/", AttendanceListView.as_view()),
]