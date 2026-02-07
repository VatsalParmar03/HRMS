from django.db import models
from django.core.exceptions import ValidationError


class Employee(models.Model):
    """Model to store employee information."""
    
    employee_id = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["employee_id"]),
            models.Index(fields=["email"]),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.employee_id})"

    def clean(self):
        """Validate employee data."""
        if not self.full_name or not self.full_name.strip():
            raise ValidationError("Full name cannot be empty.")
        if not self.employee_id or not self.employee_id.strip():
            raise ValidationError("Employee ID cannot be empty.")