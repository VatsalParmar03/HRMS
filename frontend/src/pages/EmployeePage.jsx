import { useEffect, useState } from "react";
import { BASE_URL } from "../api";

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const fetchEmployees = async () => {
    const res = await fetch(`${BASE_URL}/api/employees/`);
    const data = await res.json();
    setEmployees(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${BASE_URL}/api/employees/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      employee_id: "",
      full_name: "",
      email: "",
      department: "",
    });

    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await fetch(`${BASE_URL}/api/employees/${id}/`, {
      method: "DELETE",
    });
    fetchEmployees();
  };

  return (
    <div>
      <h2>Add Employee</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Employee ID" value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })} />
        <br />

        <input placeholder="Full Name" value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        <br />

        <input placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <br />

        <input placeholder="Department" value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <br />

        <button type="submit">Add Employee</button>
      </form>

      <h2>Employee List</h2>

      <ul>
        {employees.map((emp) => (
          <li key={emp.id}>
            {emp.full_name} ({emp.department})
            <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeePage;