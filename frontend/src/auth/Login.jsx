import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        subdomain,
      });

      // ✅ SAVE EVERYTHING
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("tenantId", res.data.data.user.tenantId);
      localStorage.setItem("role", res.data.data.user.role);


      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="Subdomain"
        value={subdomain}
        onChange={(e) => setSubdomain(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}
