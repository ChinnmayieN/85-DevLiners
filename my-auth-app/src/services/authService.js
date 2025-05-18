// src/services/authService.js
import { mockRegister, mockLogin, mockLogout, mockGetCurrentUser } from './mock/auth';
import { firebaseRegister, firebaseLogin, firebaseLogout, firebaseGetCurrentUser } from './firebase/auth';
import { BACKEND_TYPE } from '../config';

const authImpl = BACKEND_TYPE === 'firebase' ? {
  register: firebaseRegister,
  login: firebaseLogin,
  logout: firebaseLogout,
  getCurrentUser: firebaseGetCurrentUser
} : {
  register: mockRegister,
  login: mockLogin,
  logout: mockLogout,
  getCurrentUser: mockGetCurrentUser
};

export const register = authImpl.register;
export const login = authImpl.login;
export const logout = authImpl.logout;
export const getCurrentUser = authImpl.getCurrentUser;