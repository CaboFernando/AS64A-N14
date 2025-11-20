import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Leitura síncrona inicial do localStorage. Necessário para evitar tela em branco 
  // se o token estiver salvo e o componente for renderizado pela primeira vez.
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; }
  });

  // Efeito 1: Sincronizar token com headers do Axios e localStorage
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Efeito 2: Sincronizar user com localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  async function login(email, senha) {
    // CORREÇÃO: O axios precisa de uma instância local se não for configurado globalmente antes
    // Mas vamos manter a chamada simples, confiando que o Docker está roteando bem para o backend.
    const resp = await axios.post('/api/login', { email, senha });
    const data = resp.data;
    setToken(data.token);
    setUser(data.usuario || null);
    return data;
  }

  async function logout() {
    try {
      // Envia o token para a revogação no Redis.
      if (token) await axios.post('/api/logout', null);
    } catch (e) {
      console.error("Erro durante o logout, mas o token local será removido:", e);
    }
    setToken(null);
    setUser(null);
  }
  
  // Removemos a verificação `if (!initialized)` que retornava `null`.

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}