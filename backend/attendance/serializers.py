from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(
        source="employee.full_name", read_only=True
    )

    class Meta:
        model = Attendance
        fields = ["id", "employee", "employee_name", "status", "date", "created_at"]
        read_only_fields = ["date", "created_at"]