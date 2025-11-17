import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';

export default function Login() {
  const { login, isAuthenticated, logout, user } = useContext(AuthContext);
  const [email, setEmail] = useState('user@example.com');
  const [senha, setSenha] = useState('senha123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, senha);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated) {
    return (
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <span>Olá, {user?.nome}</span>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      <h3>Login</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Senha</label>
      <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
    </form>
  );
}