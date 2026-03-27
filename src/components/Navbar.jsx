import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import './Navbar.css';

/**
 * Componente Navbar (Barra de Navegación)
 * Es el encabezado principal de la tienda. Contiene el logo, la barra de búsqueda,
 * y los controles de usuario (carrito, perfil, inicio/cierre de sesión).
 */

const Navbar = () => {
  const navigate = useNavigate();

  // 1. ESTADOS PRINCIPALES
 
  const user = JSON.parse(localStorage.getItem('user')); // Obtenemos el usuario activo
  const [cartCount, setCartCount] = useState(0);         // Cantidad de items en el carrito
  const [searchTerm, setSearchTerm] = useState('');      // Lo que el usuario escribe en el buscador

  // 2. LÓGICA DEL CARRITO

  // Consulta la API para saber cuántos juegos hay en el carrito y mostrar el número en rojo (badge).
  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      return;
    }
    
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      let itemsArray = [];
      
      // Normalizamos la respuesta por si viene directo como array o dentro de un objeto 'items'
      if (data && Array.isArray(data.items)) {
        itemsArray = data.items;
      } else if (Array.isArray(data)) {
        itemsArray = data;
      }

      // Sumamos la cantidad total de artículos
      let totalItems = 0;
      itemsArray.forEach(item => {
        const cantidad = parseInt(item.quantity, 10);
        if (!isNaN(cantidad)) totalItems += cantidad;
      });

      setCartCount(totalItems);
    } catch (error) {
      console.error('Error obteniendo el carrito:', error);
      setCartCount(0);
    }
  };
  
  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    return () => window.removeEventListener('cartUpdated', fetchCartCount);
  }, []);

  // 3. FUNCIONES DE ACCIÓN (BÚSQUEDA Y LOGIN)

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload(); // Refresca para limpiar cualquier estado residual
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Evita que la página se recargue al dar Enter
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`); // Redirige al inicio aplicando el filtro
    } else {
      navigate('/');
    }
  };

  // 4. RENDERIZADO VISUAL (Estructura HTML)

  return (
    <nav className="navbar">
      
      {/* IZQUIERDA: Logo de la tienda */}
      <div className="nav-left">
        <Link to="/" className="logo">STEVE<span>GAMES</span></Link>
      </div>

      {/* CENTRO: Barra de búsqueda */}
      <div className="nav-center">
        <form className="search-container" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar juegos, ofertas y más..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* DERECHA: Controles de usuario y carrito */}
      <div className="nav-right">
        {user ? (
          // SI EL USUARIO ESTÁ LOGUEADO:
          <>
            {/* Botón del carrito con su medidor */}
            <Link to="/cart" className="cart-btn">
              <FiShoppingCart />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>

            {/* Validamos si es Admin (Vendedor) o Cliente Normal */}
            {user.role === 'vendedor' ? (
              <Link to="/admin" className="nav-link seller-link">
                <FiSettings /> Panel Vendedor
              </Link>
            ) : (
              <Link to="/perfil" className="nav-link profile-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="Avatar" 
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ffb700' }} 
                  />
                ) : (
                  <FiUser />
                )}
                <span style={{ fontWeight: 'bold' }}>{user.alias || user.name}</span>
              </Link>
            )}

            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut /> Salir
            </button>
          </>
        ) : (
          // SI NO ESTÁ LOGUEADO: Solo muestra el botón de iniciar sesión
          <Link to="/login" className="login-btn">
            <FiUser /> Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;