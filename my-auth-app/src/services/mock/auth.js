// src/services/mock/auth.js
const USERS_KEY = "ecom_users";
const CURRENT_USER_KEY = "ecom_current_user";

// Export with the exact names expected by authService.js
export const mockRegister = async (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  
  if (users.some(user => user.email === email)) {
    throw new Error("User already exists");
  }

  const newUser = { email, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const mockLogin = async ({ email, password }) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const mockLogout = async () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const mockGetCurrentUser = () => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Keep the original exports as aliases for backward compatibility
export const register = mockRegister;
export const login = mockLogin;
export const logout = mockLogout;
export const getCurrentUser = mockGetCurrentUser;