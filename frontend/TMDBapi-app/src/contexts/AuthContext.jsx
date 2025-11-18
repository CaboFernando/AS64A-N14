/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
if (API_BASE_URL) {
  axios.defaults.baseURL = API_BASE_URL;
}

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  async function login(email, senha) {
    const resp = await axios.post('/api/login', { email, senha });
    const data = resp.data;
    setToken(data.token);
    setUser(data.usuario || null);
    return data;
  }

  async function logout() {
    try {
      if (token) await axios.post('/api/logout', null, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      // Logout locally even if server request fails
      console.warn('Logout request failed:', err.message);
    }
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}