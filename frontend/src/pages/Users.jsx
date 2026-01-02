/*import { useEffect, useState } from "react";
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
}*/
/*import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // tenantId stored at login time (IMPORTANT)
  const tenantId = localStorage.getItem("tenantId");

  useEffect(() => {
    if (!tenantId) {
      setError("Tenant ID missing");
      return;
    }

    api
      .get(`/tenants/${tenantId}/users`)
      .then((res) => {
        setUsers(res.data.data || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load users");
      });
  }, [tenantId]);

  return (
    <>
      <Navbar />
      <h2>Users</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}*/
/*import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const tenantId = localStorage.getItem("tenantId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!tenantId) {
      setError("Tenant ID missing");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tenants/${tenantId}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const addUser = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/tenants/${tenantId}/users`,
        {
          email,
          password,
          role: "user",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch {
      alert("Add user failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await axios.delete(
      `http://localhost:5000/api/tenants/${tenantId}/users/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchUsers();
  };

  return (
    <div>
      <h2>Users</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Add User</h3>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={addUser}>Add</button>

      <hr />

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button onClick={() => deleteUser(u.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}*/





/*import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const tenantId = localStorage.getItem("tenantId");

    if (!tenantId) {
      setError("Tenant ID missing");
      return;
    }

    api.get(`/tenants/${tenantId}/users`)
      .then(res => {
        setUsers(res.data.data || []);
      })
      .catch(() => {
        setError("Failed to load users");
      });
  }, []);

  return (
    <>
      <Navbar />
      <h1>Users</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.is_active ? "Active" : "Inactive"}</td>
                <td>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}*/


import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const tenantId = localStorage.getItem("tenantId");

  // 🔹 Fetch users
  const loadUsers = async () => {
    try {
      const res = await api.get(`/tenants/${tenantId}/users`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔹 Add user
  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/tenants/${tenantId}/users`, {
        email,
        password,
        fullName
      });

      alert("User added successfully");
      setEmail("");
      setPassword("");
      setFullName("");
      setShowForm(false);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  // 🔹 Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <>
      <Navbar />
      <h2>Users</h2>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add User"}
      </button>

      {showForm && (
        <form onSubmit={handleAddUser} style={{ marginTop: 20 }}>
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <br />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />

          <button type="submit">Create</button>
        </form>
      )}

      <hr />

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        users.map((u) => (
          <div
            key={u.id}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <b>{u.fullName}</b>
            <p>{u.email}</p>
            <p>{u.role}</p>

            <button onClick={() => handleDelete(u.id)}>Delete</button>
          </div>
        ))
      )}
    </>
  );
}


