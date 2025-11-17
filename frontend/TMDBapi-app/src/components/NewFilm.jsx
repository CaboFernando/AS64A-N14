import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function NewFilm({ onInserted }) {
  const { isAuthenticated } = useContext(AuthContext);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ano, setAno] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!titulo || titulo.trim().length < 2) { setError('Título inválido'); return; }
    setLoading(true);
    try {
      const body = { titulo: titulo.trim(), descricao: descricao.trim(), ano: ano ? parseInt(ano) : undefined };
      const resp = await axios.post('/api/filmes', body);
      onInserted && onInserted(resp.data);
      setTitulo(''); setDescricao(''); setAno('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Erro ao inserir');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1rem 0', maxWidth: 600, display:'flex', flexDirection:'column', gap:'.5rem' }}>
      <h4>Inserir novo filme</h4>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <label>Título</label>
      <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <label>Descrição</label>
      <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <label>Ano</label>
      <input value={ano} onChange={(e) => setAno(e.target.value)} />
      <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Inserir'}</button>
    </form>
  );
}