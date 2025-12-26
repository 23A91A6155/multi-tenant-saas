import { useState } from "react";
import api from "../api/api";

export default function Register() {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register-tenant", form);
      setMsg("Tenant registered successfully");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2>Register Tenant</h2>
      <form onSubmit={submit}>
        <input placeholder="Tenant Name" onChange={e => setForm({ ...form, tenantName: e.target.value })} />
        <input placeholder="Subdomain" onChange={e => setForm({ ...form, subdomain: e.target.value })} />
        <input placeholder="Admin Email" onChange={e => setForm({ ...form, adminEmail: e.target.value })} />
        <input placeholder="Admin Password" type="password" onChange={e => setForm({ ...form, adminPassword: e.target.value })} />
        <input placeholder="Admin Full Name" onChange={e => setForm({ ...form, adminFullName: e.target.value })} />
        <button>Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
