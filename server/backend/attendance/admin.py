from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    """Admin interface for Attendance model."""
    
    list_display = ["date", "employee", "status", "created_at"]
    list_filter = ["date", "status", "created_at"]
    search_fields = ["employee__full_name", "employee__employee_id", "date"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-date"]
    
    fieldsets = (
        ("Attendance Information", {
            "fields": ("employee", "date", "status")
        }),
        ("Additional Details", {
            "fields": ("notes",),
            "classes": ("collapse",)
        }),
        ("Metadata", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )