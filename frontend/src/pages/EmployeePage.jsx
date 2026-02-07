import { useEffect, useState } from "react";
import { BASE_URL } from "../api";

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/employees/?no_paginate=1`);
      console.log("Fetch response:", res.status, res);
      if (!res.ok) throw new Error(`Failed to fetch employees: ${res.status}`);
      const data = await res.json();
      console.log("Employees data:", data);
      setEmployees(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !form.employee_id?.trim() ||
      !form.full_name?.trim() ||
      !form.email?.trim() ||
      !form.department?.trim()
    ) {
      setError("All fields are required");
      return;
    }

    if (!form.email?.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/employees/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("Add employee response:", res.status, res);
      
      if (!res.ok) {
        const errData = await res.json();
        console.error("Add error response:", errData);
        throw new Error(errData.detail || "Failed to add employee");
      }

      const addedEmployee = await res.json();
      console.log("Added employee:", addedEmployee);

      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });

      setError("");
      
      // Add small delay to ensure backend has committed the data
      setTimeout(() => {
        fetchEmployees();
      }, 300);
      
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Failed to add employee");
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/employees/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete employee");
      await fetchEmployees();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Employee ID"
          value={form.employee_id}
          onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          disabled={loading}
        />
        <br />

        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          disabled={loading}
        />
        <br />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          disabled={loading}
        />
        <br />

        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          disabled={loading}
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>

      <h2>Employee List</h2>

      {employees.length === 0 ? (
        <p>{loading ? "Loading..." : "No employees found"}</p>
      ) : (
        <ul>
          {employees.map((emp) => (
            <li key={emp.id}>
              {emp.full_name} ({emp.department}) - {emp.email}
              <button onClick={() => deleteEmployee(emp.id)} disabled={loading}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployeePage;