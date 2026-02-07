from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return Response(
                {"message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class AttendanceListAPIView(APIView):
    def get(self, request, employee_id):
        attendance = Attendance.objects.filter(employee_id=employee_id)
        serializer = AttendanceSerializer(attendance, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)