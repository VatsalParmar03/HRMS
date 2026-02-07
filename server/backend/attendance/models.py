from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from employees.models import Employee


class Attendance(models.Model):
    """Model to track employee attendance."""
    
    PRESENT = "Present"
    ABSENT = "Absent"
    LEAVE = "Leave"
    
    STATUS_CHOICES = [
        (PRESENT, "Present"),
        (ABSENT, "Absent"),
        (LEAVE, "Leave"),
    ]
    
    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )
    date = models.DateField(default=timezone.now)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default=PRESENT,
    )
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("employee", "date")
        ordering = ["-date"]
        indexes = [
            models.Index(fields=["employee", "date"]),
            models.Index(fields=["date"]),
        ]

    def __str__(self):
        return f"{self.employee.full_name} - {self.date} - {self.status}"

    def clean(self):
        """Validate attendance data."""
        if self.date > timezone.now().date():
            raise ValidationError("Attendance date cannot be in the future.")