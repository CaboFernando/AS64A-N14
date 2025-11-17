try {
  const resp = await axios.get('/api/filmes', { params: { query, ano: releaseYear } });
  dispatch({ type: 'SUCCESS', payload: resp.data.resultados || [] });
} catch (err) {
  dispatch({ type: 'ERROR', payload: err.response?.data?.error?.message || 'Erro na busca' });
}