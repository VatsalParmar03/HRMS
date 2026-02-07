from django.urls import path
from .views import AttendanceCreateAPIView, AttendanceListAPIView

urlpatterns = [
    path("attendance/", AttendanceCreateAPIView.as_view()),
    path("attendance/<int:employee_id>/", AttendanceListAPIView.as_view()),
]