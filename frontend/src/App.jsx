import { useEffect, useState } from "react";

const API_BASE = "/api";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [empForm, setEmpForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employee: "",
    status: "Present",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (attendanceForm.employee) {
      fetchAttendance(attendanceForm.employee);
    }
  }, [attendanceForm.employee]);

  // Auto-clear success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/employees/`);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Backend connection failed");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (employeeId) => {
    if (!employeeId) {
      setAttendance([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/attendance/${employeeId}/`);
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async () => {
    if (
      !empForm.employee_id?.trim() ||
      !empForm.full_name?.trim() ||
      !empForm.email?.trim() ||
      !empForm.department?.trim()
    ) {
      setError("All fields are required and cannot be empty");
      return;
    }
    if (!empForm.email?.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/employees/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: empForm.employee_id,
          full_name: empForm.full_name,
          email: empForm.email,
          department: empForm.department,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Employee create error:", err);
        throw new Error(err.detail || "Failed to add employee");
      }

      setEmpForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });

      setError("");
      setSuccess("Employee added successfully!");
      await fetchEmployees();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/employees/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete employee");
      
      // Instantly remove from UI
      setEmployees(employees.filter(emp => emp.id !== id));
      setSuccess("Employee deleted successfully!");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    if (!attendanceForm.employee) {
      setError("Please select an employee first");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        employee: attendanceForm.employee,
        status: attendanceForm.status,
        date: attendanceForm.date,
      };

      const res = await fetch(`${API_BASE}/attendance/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Attendance error:", err);
        throw new Error(err.detail || "Failed to mark attendance");
      }

      setError("");
      setSuccess("Attendance marked successfully!");
      await fetchAttendance(attendanceForm.employee);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalEmployees = employees.length;
  const presentToday = attendance.filter(a => a.status === "Present").length;
  const departments = [...new Set(employees.map(e => e.department))].length;

  // Filter employees based on search
  const filteredEmployees = employees.filter(e =>
    e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "20px",
            padding: "40px 30px",
            marginBottom: "30px",
            boxShadow: "0 20px 50px rgba(102, 126, 234, 0.2)",
            color: "white",
          }}
        >
          <h1 style={{ margin: "0 0 8px 0", fontSize: "40px", fontWeight: "700" }}>
            HRMS Lite
          </h1>
          <p style={{ margin: "0", fontSize: "16px", opacity: "0.9" }}>
            Employee & Attendance Management System
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>Total Employees</p>
                <p style={{ margin: "10px 0 0 0", fontSize: "32px", fontWeight: "700", color: "#667eea" }}>{totalEmployees}</p>
              </div>
              <span style={{ fontSize: "32px" }}>👥</span>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>Present Today</p>
                <p style={{ margin: "10px 0 0 0", fontSize: "32px", fontWeight: "700", color: "#10b981" }}>{presentToday}</p>
              </div>
              <span style={{ fontSize: "32px" }}>✅</span>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>Departments</p>
                <p style={{ margin: "10px 0 0 0", fontSize: "32px", fontWeight: "700", color: "#f59e0b" }}>{departments}</p>
              </div>
              <span style={{ fontSize: "32px" }}>🏢</span>
            </div>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "1px solid #fecaca",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{error}</span>
            <button onClick={() => setError("")} style={{ background: "none", border: "none", color: "#991b1b", cursor: "pointer", fontSize: "18px" }}>
              ×
            </button>
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "16px 20px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "1px solid #bbf7d0",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>✓ {success}</span>
            <button onClick={() => setSuccess("")} style={{ background: "none", border: "none", color: "#166534", cursor: "pointer", fontSize: "18px" }}>
              ×
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          {/* Add Employee Card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2 style={{ margin: "0 0 24px 0", fontSize: "20px", color: "#1f2937", fontWeight: "600" }}>
              ➕ Add New Employee
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <input
                placeholder="Employee ID"
                value={empForm.employee_id}
                onChange={(e) => setEmpForm({ ...empForm, employee_id: e.target.value })}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
              <input
                placeholder="Full Name"
                value={empForm.full_name}
                onChange={(e) => setEmpForm({ ...empForm, full_name: e.target.value })}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
              <input
                placeholder="Email"
                type="email"
                value={empForm.email}
                onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
              <input
                placeholder="Department"
                value={empForm.department}
                onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                onClick={addEmployee}
                disabled={loading}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  transition: "all 0.3s",
                  opacity: loading ? 0.6 : 1,
                  transform: "translateY(0)",
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {loading ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </div>

          {/* Mark Attendance Card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2 style={{ margin: "0 0 24px 0", fontSize: "20px", color: "#1f2937", fontWeight: "600" }}>
              📋 Mark Attendance
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <select
                value={attendanceForm.employee}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    employee: Number(e.target.value),
                  })
                }
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "white",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select Employee</option>
                {employees && employees.length > 0 ? (
                  employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.full_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No employees available</option>
                )}
              </select>

              <input
                type="date"
                value={attendanceForm.date}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    date: e.target.value,
                  })
                }
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "white",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />

              <select
                value={attendanceForm.status}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    status: e.target.value,
                  })
                }
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  backgroundColor: "white",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="Present">✅ Present</option>
                <option value="Absent">❌ Absent</option>
              </select>

              <button
                onClick={markAttendance}
                disabled={loading || !attendanceForm.employee}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: loading || !attendanceForm.employee ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  transition: "all 0.3s",
                  opacity: loading || !attendanceForm.employee ? 0.6 : 1,
                  transform: "translateY(0)",
                }}
                onMouseOver={(e) => {
                  if (!loading && attendanceForm.employee) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.4)";
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {loading ? "Submitting..." : "Submit Attendance"}
              </button>
            </div>
          </div>
        </div>

        {/* Employees List */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ margin: "0", fontSize: "20px", color: "#1f2937", fontWeight: "600" }}>
              👥 Employee Directory
            </h2>
            <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Total: {filteredEmployees.length}</span>
          </div>

          {/* Search Box */}
          {employees.length > 0 && (
            <input
              type="text"
              placeholder="🔍 Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                marginBottom: "20px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.3s",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
            />
          )}

          {!employees || employees.length === 0 ? (
            <p style={{ color: "#9ca3af", fontStyle: "italic", textAlign: "center", padding: "40px 20px" }}>
              {loading ? "Loading employees..." : "No employees added yet"}
            </p>
          ) : filteredEmployees.length === 0 ? (
            <p style={{ color: "#9ca3af", fontStyle: "italic", textAlign: "center", padding: "40px 20px" }}>
              No employees found matching your search
            </p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {filteredEmployees.map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    background: "#f9fafb",
                    borderRadius: "10px",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>
                      {e.full_name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      {e.department} • ID: {e.employee_id} • {e.email}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEmployee(e.id)}
                    style={{
                      padding: "8px 16px",
                      background: "#fee2e2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      whiteSpace: "nowrap",
                      marginLeft: "12px",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#fecaca";
                      e.target.style.color = "#991b1b";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#fee2e2";
                      e.target.style.color = "#dc2626";
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attendance Records */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              margin: "0 0 24px 0",
              fontSize: "20px",
              color: "#1f2937",
              fontWeight: "600",
            }}
          >
            📊 Attendance Records
          </h2>

          {!attendance || attendance.length === 0 ? (
            <p style={{ color: "#9ca3af", fontStyle: "italic", textAlign: "center", padding: "40px 20px" }}>
              {loading
                ? "Loading records..."
                : attendanceForm.employee
                ? "No attendance records found"
                : "Select an employee to view records"}
            </p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {attendance.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 18px",
                    background: "#f9fafb",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px" }}>
                      {a.status === "Present" ? "✅" : "❌"}
                    </span>
                    <div>
                      <div style={{ fontWeight: "500", color: "#1f2937" }}>
                        {a.employee_name}
                      </div>
                      <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
                        {new Date(a.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: a.status === "Present" ? "#d1fae5" : "#fee2e2",
                      color: a.status === "Present" ? "#065f46" : "#991b1b",
                    }}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
