import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// REMOVIDA a importação direta de CSS aqui para evitar o erro de build.
// A forma recomendada em projetos Vite é importar em src/index.css ou usar CDN.

// O ponto de entrada da aplicação React.
// Este arquivo monta o componente App no elemento com id="root".

// 1. Encontra o elemento raiz no DOM
const rootElement = document.getElementById('root');

if (rootElement) {
  // 2. Cria a raiz de renderização do React
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Elemento raiz 'root' não encontrado no DOM. A aplicação React não pôde ser inicializada.");
}