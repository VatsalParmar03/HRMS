from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, DestroyAPIView
import logging
from django.db import IntegrityError
from django.db.models import ProtectedError

from .models import Employee
from .serializers import EmployeeSerializer

logger = logging.getLogger(__name__)


class EmployeeListCreateAPIView(ListCreateAPIView):
    """
    API view for listing and creating employees.
    
    GET: Returns a list of all employees with pagination.
    POST: Creates a new employee record.
    """
    
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    search_fields = ["full_name", "employee_id", "email", "department"]
    ordering_fields = ["created_at", "full_name"]
    ordering = ["-created_at"]
    


class EmployeeDetailDestroyAPIView(DestroyAPIView):
    """
    API view for deleting an employee.
    
    DELETE: Deletes an employee by ID.
    """
    
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    lookup_field = "pk"

    def delete(self, request, *args, **kwargs):
        """Override delete to add logging and custom response."""
        instance = self.get_object()
        try:
            # perform_destroy handles the actual deletion; keep it testable
            self.perform_destroy(instance)
        except ProtectedError:
            logger.warning(f"Attempt to delete employee {kwargs.get('pk')} blocked by protected related objects.")
            return Response(
                {"detail": "Cannot delete employee because related records exist."},
                status=status.HTTP_409_CONFLICT,
            )
        except IntegrityError as e:
            logger.error(f"IntegrityError deleting employee {kwargs.get('pk')}: {e}")
            return Response(
                {"detail": "Database error while deleting employee."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.error(f"Error deleting employee: {str(e)}")
            return Response(
                {"detail": "An error occurred while deleting the employee."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.info(f"Employee with ID {kwargs.get('pk')} deleted successfully.")
        # 204 No Content must not include a response body per RFC
        return Response(status=status.HTTP_204_NO_CONTENT)