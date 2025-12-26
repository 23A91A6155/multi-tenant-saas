import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSubdomain, setTenantSubdomain] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        tenantSubdomain
      });

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("tenantId", res.data.data.user.tenantId);

      navigate("/dashboard");
    } catch (err) {
      setMessage("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <input placeholder="Tenant Subdomain" onChange={e => setTenantSubdomain(e.target.value)} />
      <button>Login</button>
      <p>{message}</p>
    </form>
  );
}
