from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    """Admin interface for Employee model."""
    
    list_display = ["employee_id", "full_name", "email", "department", "created_at"]
    list_filter = ["department", "created_at", "updated_at"]
    search_fields = ["employee_id", "full_name", "email"]
    readonly_fields = ["created_at", "updated_at"]
    ordering = ["-created_at"]
    
    fieldsets = (
        ("Personal Information", {
            "fields": ("employee_id", "full_name", "email")
        }),
        ("Work Information", {
            "fields": ("department",)
        }),
        ("Metadata", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )