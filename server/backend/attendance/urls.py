from django.urls import path
from .views import AttendanceCreateAPIView, AttendanceListAPIView

urlpatterns = [
    path("attendance/", AttendanceCreateAPIView.as_view(), name="attendance-create-list"),
    path("attendance/<int:employee_id>/", AttendanceListAPIView.as_view(), name="attendance-list"),
]