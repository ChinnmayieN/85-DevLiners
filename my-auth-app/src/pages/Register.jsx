import React, { useState } from "react";

export default function Signup({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) {
      setMessage("User already exists");
      return;
    }
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    setMessage("Signup successful! Please login.");
    setEmail("");
    setPassword("");
    setConfirm("");
  };

  return (
    <div style={{ maxWidth: 350, margin: "50px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />
        <button style={{ width: "100%", padding: 10, background: "#059669", color: "#fff", border: "none", borderRadius: 4 }} type="submit">
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