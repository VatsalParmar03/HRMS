from django.apps import AppConfig


class AttendanceConfig(AppConfig):
    name = 'attendance'

# employees/apps.py
class EmployeesConfig(AppConfig):
    name = "employees"

    def ready(self):
        import employees.signals