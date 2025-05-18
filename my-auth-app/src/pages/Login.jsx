import React, { useState } from "react";

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // For demo: check localStorage for user
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setMessage("Login successful!");
    } else {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "50px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button style={{ width: "100%", padding: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }} type="submit">
          Login
        </button>
        <div style={{ color: "red", marginTop: 8 }}>{message}</div>
      </form>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }} onClick={onSwitch}>
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
}