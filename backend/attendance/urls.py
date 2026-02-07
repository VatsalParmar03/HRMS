from django.urls import path
from .views import AttendanceCreateAPIView, AttendanceListView

urlpatterns = [
    path("attendance/", AttendanceCreateAPIView.as_view()),
    path("attendance/<int:employee_id>/", AttendanceListView.as_view()),
]