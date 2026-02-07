from django.urls import path
from .views import EmployeeListCreateAPIView, EmployeeDetailDestroyAPIView

urlpatterns = [
    path("employees/", EmployeeListCreateAPIView.as_view(), name="employee-list-create"),
    path("employees/<int:pk>/", EmployeeDetailDestroyAPIView.as_view(), name="employee-destroy"),
]