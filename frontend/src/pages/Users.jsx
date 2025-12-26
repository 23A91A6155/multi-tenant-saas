import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import AddUser from "./AddUser";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const tenantId = localStorage.getItem("tenantId");

  const fetchUsers = async () => {
    const res = await api.get(`/tenants/${tenantId}/users`);
    setUsers(res.data.data || res.data || []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <>
      <Navbar />
      <h1>Users</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close" : "Add User"}
      </button>

      {showForm && <AddUser onSuccess={fetchUsers} />}

      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}

          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td>{u.is_active ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
