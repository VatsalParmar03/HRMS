# HRMS Lite Backend

A lightweight Human Resource Management System (HRMS) backend built with Django REST Framework.

## Features

- Employee management (create, read, delete)
- Attendance tracking
- RESTful API endpoints
- Pagination support
- Search and filtering capabilities
- Admin panel for data management
- Comprehensive error handling and logging

## Project Structure

```
backend/
├── attendance/              # Attendance app
│   ├── migrations/
│   ├── models.py            # Attendance model
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   ├── urls.py              # App URL routing
│   └── admin.py             # Django admin configuration
├── employees/               # Employees app
│   ├── migrations/
│   ├── models.py            # Employee model
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   ├── urls.py              # App URL routing
│   └── admin.py             # Django admin configuration
├── backend/                 # Project settings
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL routing
│   ├── wsgi.py              # WSGI application
│   └── asgi.py              # ASGI application
├── manage.py                # Django management script
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (local)
├── .env.example             # Environment variables template
└── build.sh                 # Build script for deployment
```

## Installation

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Steps

1. **Clone or navigate to the project:**

   ```bash
   cd backend
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update settings as needed (optional for local development)

6. **Run migrations:**

   ```bash
   python manage.py migrate
   ```

7. **Create a superuser (for admin access):**

   ```bash
   python manage.py createsuperuser
   ```

8. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

The server will start at `http://localhost:8000/`

## API Endpoints

### Employees

- **GET** `/api/employees/` - List all employees (with pagination, search, filtering)
- **POST** `/api/employees/` - Create a new employee
- **DELETE** `/api/employees/<id>/` - Delete an employee

### Attendance

- **POST** `/api/attendance/` - Create an attendance record
- **GET** `/api/attendance/<employee_id>/` - Get attendance records for an employee

### Admin Panel

- **GET** `/admin/` - Django admin interface (requires superuser login)

## Environment Variables

Create a `.env` file in the backend directory:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
DJANGO_LOG_LEVEL=INFO
```

## Testing the API

### Using cURL

**Create an employee:**

```bash
curl -X POST http://localhost:8000/api/employees/ \
  -H "Content-Type: application/json" \
  -d '{"employee_id":"EMP001","full_name":"John Doe","email":"john@example.com","department":"IT"}'
```

**Get all employees:**

```bash
curl http://localhost:8000/api/employees/
```

**Mark attendance:**

```bash
curl -X POST http://localhost:8000/api/attendance/ \
  -H "Content-Type: application/json" \
  -d '{"employee":1,"status":"Present","date":"2026-02-07"}'
```

### Using Postman

1. Import the API endpoints
2. Set request type (GET, POST, DELETE)
3. Add JSON body for POST requests
4. Send requests

## Key Improvements Made

- ✅ Fixed security issues (hardcoded SECRET_KEY, permissive ALLOWED_HOSTS)
- ✅ Added environment variable support
- ✅ Implemented proper password validation
- ✅ Added database indexing for better performance
- ✅ Fixed variable naming conflicts (status shadow)
- ✅ Implemented pagination for large datasets
- ✅ Added comprehensive error handling
- ✅ Added logging throughout the application
- ✅ Improved serializers with field validation
- ✅ Enhanced admin interface with better list displays
- ✅ Added docstrings to all views and models
- ✅ Implemented DRY principle using ListCreateAPIView and DestroyAPIView
- ✅ Added updated_at field to models for tracking changes
- ✅ Removed duplicate URL configurations

## Troubleshooting

### Port Already in Use

If port 8000 is already in use, specify a different port:

```bash
python manage.py runserver 8001
```

### Database Errors

If you encounter database errors, reset the database:

```bash
# Delete the database file
rm db.sqlite3

# Re-run migrations
python manage.py migrate

# Create a new superuser
python manage.py createsuperuser
```

### Dependencies Issues

Update pip and reinstall dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## Deployment

Use the provided `build.sh` script for deployment:

```bash
bash build.sh
```

This script will:

1. Install Python dependencies
2. Run database migrations

For production deployment to Render or similar platforms, ensure:

- `DEBUG=False` in environment variables
- Set a secure `SECRET_KEY`
- Configure `ALLOWED_HOSTS` appropriately
- Use a production database (PostgreSQL recommended)

## Contributing

- Ensure code follows PEP 8 guidelines
- Add docstrings to all functions and classes
- Test all endpoints before committing
- Keep the `.env` file in `.gitignore`

## License

This project is part of HRMS Lite. All rights reserved.
