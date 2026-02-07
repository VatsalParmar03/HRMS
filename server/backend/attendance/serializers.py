from rest_framework import serializers
from django.utils import timezone
from .models import Attendance
from employees.models import Employee


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance model."""
    
    employee_name = serializers.CharField(
        source="employee.full_name", read_only=True
    )
    employee_id = serializers.CharField(
        source="employee.employee_id", read_only=True
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "employee",
            "employee_name",
            "employee_id",
            "status",
            "date",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_date(self, value):
        """Validate that date is not in the future."""
        if value > timezone.now().date():
            raise serializers.ValidationError("Attendance date cannot be in the future.")
        return value

    def validate(self, data):
        """Validate that employee exists and attendance is unique for date."""
        employee = data.get("employee")
        date = data.get("date", timezone.now().date())
        
        if not employee:
            raise serializers.ValidationError({"employee": "Employee is required."})
        
        # Check if already marked for this date
        if self.instance is None:  # Creating new
            if Attendance.objects.filter(employee=employee, date=date).exists():
                raise serializers.ValidationError(
                    "Attendance already marked for this employee on this date."
                )
        
        return data