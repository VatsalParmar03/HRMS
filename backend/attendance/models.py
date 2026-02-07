from django.db import models
from django.utils import timezone
from employees.models import Employee


class Attendance(models.Model):
    STATUS_CHOICES = [
        ("Present", "Present"),
        ("Absent", "Absent"),
        ("Leave", "Leave"),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employee", "date")  # 🔥 prevents duplicates

    def __str__(self):
        return f"{self.employee.full_name} - {self.date} - {self.status}"