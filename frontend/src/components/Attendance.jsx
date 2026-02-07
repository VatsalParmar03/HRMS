import { useEffect, useState } from "react";

const API_BASE = "https://hrms-lite-backend-1-dj44.onrender.com/api";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("PRESENT");
  const [attendanceList, setAttendanceList] = useState([]);

  // Fetch employees
  useEffect(() => {
    fetch(`${API_BASE}/employees/`)
      .then(res => res.json())
      .then(data => setEmployees(data));
  }, []);

  // Fetch attendance for selected employee
  const fetchAttendance = (id) => {
    fetch(`${API_BASE}/attendance/${id}/`)
      .then(res => res.json())
      .then(data => setAttendanceList(data));
  };

  // Submit attendance
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/attendance/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee: employeeId,
        date,
        status,
      }),
    });

    if (res.ok) {
      alert("Attendance marked");
      fetchAttendance(employeeId);
    } else {
      alert("Failed to mark attendance");
    }
  };

  return (
    <div>
      <h2>Mark Attendance</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={employeeId}
          onChange={(e) => {
            setEmployeeId(e.target.value);
            fetchAttendance(e.target.value);
          }}
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name}
            </option>
          ))}
        </select>

        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
        </select>

        <br />

        <button type="submit">Mark Attendance</button>
      </form>

      <h3>Attendance List</h3>
      <ul>
        {attendanceList.map(att => (
          <li key={att.id}>
            {att.date} — {att.status}
          </li>
        ))}
      </ul>
    </div>
  );
}