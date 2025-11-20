import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Você precisa estar logado para acessar esta área.</div>;
  }
  return <>{children}</>;
}