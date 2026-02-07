from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Employee
from attendance.models import Attendance

@receiver(post_save, sender=Employee)
def create_today_attendance(sender, instance, created, **kwargs):
    if created:
        Attendance.objects.create(
            employee=instance,
            date=timezone.now().date(),
            status="Absent"
        )