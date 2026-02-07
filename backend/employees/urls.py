from django.urls import path
from .views import EmployeeListCreateAPIView, EmployeeDeleteAPIView

urlpatterns = [
    path("employees/", EmployeeListCreateAPIView.as_view()),
    path("employees/<int:pk>/", EmployeeDeleteAPIView.as_view()),
]