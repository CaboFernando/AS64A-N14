import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './Login';
import ProtectedRoute from './components/ProtectedRoute';
import UploadForm from './components/UploadForm'; 
import NewFilm from './components/NewFilm';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader'; 

export default function App() {
  return (
    <AuthProvider>
      <div className="container" style={{ padding: '1rem' }}>
        <h1>Projeto 2 – Catálogo de Filmes</h1>
        <p>Login, Busca e Inserção (dados locais)</p>
        <Login />
        <ProtectedRoute>
          <UploadForm />
          <NewFilm />
          <ResultCard />
          <Loader />
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}