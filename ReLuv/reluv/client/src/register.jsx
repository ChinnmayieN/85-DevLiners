import React, { useState } from "react";

export default function Register({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Registering...");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (res.ok && data.msg) {
        setMessage("Registration successful!");
        } else {
            setMessage(data.msg || "Registration failed");
        }
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "50px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={{ width: "100%", padding: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 4 }} type="submit">
          Sign Up
        </button>
        <div style={{ color: "red", marginTop: 8 }}>{message}</div>
      </form>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer" }} onClick={onSwitch}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
