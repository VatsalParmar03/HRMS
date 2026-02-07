from django.contrib import admin
from django.urls import path

from employees.views import EmployeeListCreateAPIView, EmployeeDeleteAPIView
from attendance.views import AttendanceCreateAPIView, AttendanceListAPIView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Employees
    path("api/employees/", EmployeeListCreateAPIView.as_view()),
    path("api/employees/<int:pk>/", EmployeeDeleteAPIView.as_view()),

    # Attendance
    path("api/attendance/", AttendanceCreateAPIView.as_view()),
    path("api/attendance/<int:employee_id>/", AttendanceListAPIView.as_view()),
]