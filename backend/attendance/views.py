from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import Attendance
from .serializers import AttendanceSerializer
from employees.models import Employee


class AttendanceCreateAPIView(APIView):
    def post(self, request):
        employee_id = request.data.get("employee")
        status_value = request.data.get("status")

        if not employee_id or not status_value:
            return Response(
                {"message": "Employee and status are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return Response(
                {"message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check if attendance already exists for today
        today = timezone.now().date()
        existing = Attendance.objects.filter(
            employee=employee, 
            date=today
        ).first()
        
        if existing:
            return Response(
                {"message": "Attendance already marked for today"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = AttendanceSerializer(
            data={
                "employee": employee.id,
                "status": status_value,
                "date": today,
            }
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AttendanceListAPIView(APIView):
    def get(self, request, employee_id):
        attendance = Attendance.objects.filter(employee_id=employee_id).order_by('-date')
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)