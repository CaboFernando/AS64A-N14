export const initialState = {
  status: 'idle',
  query: '',
  results: [],
  error: ''
};

export function appReducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SEARCH_START':
      return { ...state, status: 'loading', error: '', results: [] };
    case 'SUCCESS':
      return { ...state, status: 'done', results: action.payload };
    case 'ERROR':
      return { ...state, status: 'error', error: action.payload }; 
    case 'RESET':
        return initialState;
    default:
      return state;
  }
}
