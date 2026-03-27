// 1. IMPORTACIÓN DE LIBRERÍAS DE ENRUTAMIENTO
import { Routes, Route } from 'react-router-dom';

// 2. IMPORTACIÓN DE COMPONENTES GLOBALES Y PÁGINAS
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import GameDetails from './pages/GameDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';

function App() {
  // 3. ESTRUCTURA PRINCIPAL DE LA APLICACIÓN
  return (
    <div className="app-wrapper">
      {/* El Navbar siempre visible en la parte superior */}
      <Navbar />
      
      {/* 4. DEFINICIÓN DE RUTAS (Manejador de URLs) */}
      <main>
        <Routes>
          {/* Ruta principal del catálogo (Página de Inicio) */}
          <Route path="/" element={<Home />} />
          
          {/* Detalles de un juego específico (URL dinámica por ID) */}
          <Route path="/juego/:id" element={<GameDetails />} />
          
          {/* Rutas de autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} /> 
          
          {/* Rutas de perfil del usuario */}
          <Route path="/perfil" element={<Profile />} />
          
          {/* Carrito de compras y pasarela de pagos */}
          <Route path="/cart" element={<Cart />} />
          
          {/* Panel de administración exclusivo del vendedor */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
