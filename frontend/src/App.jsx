import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState("");

  const [empForm, setEmpForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employee: "",
    status: "Present",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (attendanceForm.employee) {
      fetchAttendance(attendanceForm.employee);
    }
  }, [attendanceForm.employee]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees/`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmployees(data);
      setError("");
    } catch {
      setError("Backend connection failed");
    }
  };

  const fetchAttendance = async (employeeId) => {
    try {
      const res = await fetch(`${API_BASE}/attendance/${employeeId}/`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAttendance(data);
      setError("");
    } catch {
      setError("Failed to load attendance");
    }
  };

  const addEmployee = async () => {
    if (
      !empForm.employee_id ||
      !empForm.full_name ||
      !empForm.email ||
      !empForm.department
    ) {
      setError("All fields are required");
      return;
    }

    try {
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
        throw new Error("Employee create failed");
      }

      // reset form
      setEmpForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });

      setError("");
      fetchEmployees(); // refresh list
    } catch (err) {
      console.error(err);
      setError("Failed to add employee");
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await fetch(`${API_BASE}/employees/${id}/`, { method: "DELETE" });
      fetchEmployees();
    } catch {
      setError("Failed to delete employee");
    }
  };

  const markAttendance = async () => {
  if (!attendanceForm.employee) {
    setError("Please select an employee");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/attendance/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee: attendanceForm.employee,
        status: attendanceForm.status,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Attendance error:", err);
      throw new Error("Attendance failed");
    }

    setError("");
    fetchAttendance(); // refresh list
  } catch (err) {
    console.error(err);
    setError("Failed to mark attendance");
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "700",
            }}
          >
            HRMS Lite
          </h1>
          <p
            style={{
              margin: "10px 0 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Employee & Attendance Management System
          </p>
        </div>

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
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "30px",
          }}
        >
          {/* Add Employee Card */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "30px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                margin: "0 0 20px 0",
                fontSize: "20px",
                color: "#1f2937",
                fontWeight: "600",
              }}
            >
              ➕ Add New Employee
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                placeholder="Employee ID"
                value={empForm.employee_id}
                onChange={(e) =>
                  setEmpForm({ ...empForm, employee_id: e.target.value })
                }
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <input
                placeholder="Full Name"
                value={empForm.full_name}
                onChange={(e) =>
                  setEmpForm({ ...empForm, full_name: e.target.value })
                }
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <input
                placeholder="Email"
                value={empForm.email}
                onChange={(e) =>
                  setEmpForm({ ...empForm, email: e.target.value })
                }
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <input
                placeholder="Department"
                value={empForm.department}
                onChange={(e) =>
                  setEmpForm({ ...empForm, department: e.target.value })
                }
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                onClick={addEmployee}
                style={{
                  padding: "12px 24px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "8px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(102, 126, 234, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Add Employee
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
            }}
          >
            <h2
              style={{
                margin: "0 0 20px 0",
                fontSize: "20px",
                color: "#1f2937",
                fontWeight: "600",
              }}
            >
              📋 Mark Attendance
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <select
                value={attendanceForm.employee}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    employee: Number(e.target.value),
                  })
                }
              >
                <option value="">Select Employee</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.full_name}
                  </option>
                ))}
              </select>

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
                }}
              >
                <option value="Present">✅ Present</option>
                <option value="Absent">❌ Absent</option>
              </select>

              <button
                onClick={markAttendance}
                style={{
                  padding: "12px 24px",
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "8px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(16, 185, 129, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Submit Attendance
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
            marginTop: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              color: "#1f2937",
              fontWeight: "600",
            }}
          >
            👥 Employee Directory
          </h2>

          {employees.length === 0 ? (
            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
              No employees added yet
            </p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {employees.map((e) => (
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
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "4px",
                      }}
                    >
                      {e.full_name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                      {e.department} • ID: {e.employee_id}
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
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#fecaca";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#fee2e2";
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
            marginTop: "30px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              color: "#1f2937",
              fontWeight: "600",
            }}
          >
            📊 Attendance Records
          </h2>

          {attendance.length === 0 ? (
            <p style={{ color: "#9ca3af", fontStyle: "italic" }}>
              {attendanceForm.employee
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
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                      }}
                    >
                      {a.status === "Present" ? "✅" : "❌"}
                    </span>
                    <div>
                      <div style={{ fontWeight: "500", color: "#1f2937" }}>
                        {a.employee_name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginTop: "2px",
                        }}
                      >
                        {a.date}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        a.status === "Present" ? "#d1fae5" : "#fee2e2",
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
