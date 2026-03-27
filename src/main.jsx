// 1. IMPORTACIÓN DE LIBRERÍAS CORE DE REACT
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 2. IMPORTACIÓN DE LA APP PRINCIPAL Y ESTILOS GLOBALES
import App from './App.jsx';
import './index.css'; 

// 3. INICIALIZACIÓN Y RENDERIZADO EN EL DOM
// Busca el div con id "root" en el index.html y "monta" toda la aplicación de React ahí adentro.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter envuelve la app para permitir la navegación entre páginas sin recargar */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);