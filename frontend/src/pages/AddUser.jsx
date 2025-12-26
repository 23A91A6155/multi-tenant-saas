import { useState } from "react";
import api from "../api/api";

export default function AddUser({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const tenantId = localStorage.getItem("tenantId");

  const submit = async (e) => {
    e.preventDefault();

    await api.post(`/tenants/${tenantId}/users`, {
      email,
      fullName,
      password,
      role
    });

    setEmail("");
    setFullName("");
    setPassword("");
    setRole("user");

    onSuccess();
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 20 }}>
      <h3>Add User</h3>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />

      <input
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
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

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="tenant_admin">Tenant Admin</option>
      </select>
      <br /><br />

      <button type="submit">Create User</button>
    </form>
  );
}
