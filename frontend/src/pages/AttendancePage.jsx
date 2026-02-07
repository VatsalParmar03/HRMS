import { useEffect, useState } from "react";

const API_BASE = "/api";

function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("Present");
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch employees
  useEffect(() => {
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
        setError("Failed to load employees");
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const fetchAttendance = async (id) => {
    if (!id) {
      setAttendanceList([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/attendance/${id}/`);
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      setAttendanceList(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance");
      setAttendanceList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!employeeId) {
      setError("Please select an employee");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/attendance/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee: parseInt(employeeId),
          date,
          status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to mark attendance");
      }
      
      setError("");
      await fetchAttendance(employeeId);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>Attendance</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <select
          value={employeeId}
          onChange={(e) => {
            setEmployeeId(e.target.value);
            if (e.target.value) {
              fetchAttendance(e.target.value);
            }
          }}
          required
          disabled={loading}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
        />

        <br /><br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Mark Attendance"}
        </button>
      </form>

      <h3 style={{ marginTop: "20px" }}>Attendance Records</h3>
      {attendanceList.length === 0 ? (
        <p>No attendance records found</p>
      ) : (
        <ul>
          {attendanceList.map(att => (
            <li key={att.id}>
              {att.date} — {att.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AttendancePage;