export const initialState = {
  status: 'idle', // idle | uploading | processing | done | error
  query: '', // Termo de busca
  results: [], // Lista de filmes ou séries
  error: ''
};

export function appReducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'UPLOAD_START':
      return { ...state, status: 'uploading', error: '', results: [] };
    case 'SEARCH_START':
      return { ...state, status: 'uploading', error: '', results: [] };
    case 'PROCESSING':
      return { ...state, status: 'processing' };
    case 'SUCCESS':
      // O payload será a lista de resultados (filmes)
      return { ...state, status: 'done', results: action.payload };
    case 'ERROR':
      return { ...state, status: 'error', error: action.payload }; 
    case 'RESET':
        return initialState;
    default:
      return state;
  }
}
