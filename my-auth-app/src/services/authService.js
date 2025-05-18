// authService.js

// Simulated backend with localStorage
export const register = async (email, password) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.find((user) => user.email === email)) {
    throw new Error("User already exists");
  }

  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
};

export function login({ email, password }) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export const logout = () => {
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};
