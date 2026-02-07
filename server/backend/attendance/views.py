from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status
from rest_framework.generics import ListCreateAPIView, ListAPIView
from rest_framework.exceptions import ValidationError
from django.utils import timezone
from django.shortcuts import get_object_or_404
import logging

from .models import Attendance
from .serializers import AttendanceSerializer
from employees.models import Employee

logger = logging.getLogger(__name__)


class AttendanceCreateAPIView(ListCreateAPIView):
    """
    API view for creating attendance records.
    
    POST: Creates a new attendance record for an employee.
    Prevents duplicate attendance for the same employee on the same date.
    """
    
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def perform_create(self, serializer):
        """Override to add validation and logging."""
        employee = serializer.validated_data.get("employee")
        date = serializer.validated_data.get("date", timezone.now().date())
        
        # Check if attendance already exists for this employee on this date
        if Attendance.objects.filter(employee=employee, date=date).exists():
            raise ValidationError(
                {"detail": "Attendance already marked for this employee on this date."}
            )
        
        serializer.save()
        logger.info(f"Attendance created for employee {employee.employee_id} on {date}.")

    def create(self, request, *args, **kwargs):
        """Make POST idempotent: create if not exists, otherwise update existing.

        This allows frontend clients to `POST` the same employee+date to change
        the `status` without failing with a 400. Returns 201 for create and
        200 for update.
        """
        data = request.data.copy()

        # Default date to today if not provided
        if not data.get("date"):
            data["date"] = timezone.now().date().isoformat()

        employee_id = data.get("employee")
        if not employee_id:
            return Response({"employee": "Employee is required."}, status=http_status.HTTP_400_BAD_REQUEST)

        # Resolve employee existence
        try:
            employee = Employee.objects.get(pk=employee_id)
        except Exception:
            return Response({"employee": "Employee not found."}, status=http_status.HTTP_400_BAD_REQUEST)

        # Check existing attendance record for employee+date
        existing = None
        try:
            existing = Attendance.objects.filter(employee=employee, date=data.get("date")).first()
        except Exception:
            # If date format is invalid, delegate to serializer for proper error
            existing = None

        if existing:
            # Update existing record
            serializer = self.get_serializer(existing, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            logger.info(f"Attendance updated for employee {employee.employee_id} on {data.get('date')}")
            return Response(serializer.data, status=http_status.HTTP_200_OK)

        # Create new record
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=http_status.HTTP_201_CREATED, headers=headers)


class AttendanceListAPIView(ListAPIView):
    """
    API view for listing attendance records of an employee.
    
    GET: Returns attendance records for a specific employee with pagination.
    """
    
    serializer_class = AttendanceSerializer
    ordering_fields = ["date", "created_at"]
    ordering = ["-date"]

    def get_queryset(self):
        """Filter attendance records by employee_id and validate employee exists."""
        employee_id = self.kwargs.get("employee_id")
        
        # Ensure employee exists
        employee = get_object_or_404(Employee, id=employee_id)
        
        queryset = Attendance.objects.filter(employee=employee)
        logger.info(f"Fetched {queryset.count()} attendance records for employee {employee_id}.")
        return queryset