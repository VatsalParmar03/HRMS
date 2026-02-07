from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status
from django.utils import timezone

from .models import Attendance
from .serializers import AttendanceSerializer
from employees.models import Employee


class AttendanceCreateAPIView(APIView):
    def post(self, request):
        employee_id = request.data.get("employee")
        date = request.data.get("date")

        if not employee_id or not date:
            return Response(
                {"message": "Employee and date are required"},
                status=http_status.HTTP_400_BAD_REQUEST,
            )

        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return Response(
                {"message": "Employee not found"},
                status=http_status.HTTP_404_NOT_FOUND,
            )

        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employee=employee)  # ✅ CRITICAL FIX
            return Response(serializer.data, status=http_status.HTTP_201_CREATED)

        return Response(serializer.errors, status=http_status.HTTP_400_BAD_REQUEST)


class AttendanceListView(APIView):
    def get(self, request, employee_id):
        date = request.GET.get("date")

        qs = Attendance.objects.select_related("employee").filter(employee_id=employee_id)

        if date:
            qs = qs.filter(date=date)

        serializer = AttendanceSerializer(qs, many=True)
        return Response(serializer.data)