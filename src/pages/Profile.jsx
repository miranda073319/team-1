import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiHeart, FiShoppingBag, FiCalendar, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import GameCard from '../components/GameCard';
import './Profile.css';

const Profile = () => {
  // 1. ESTADOS DE NAVEGACIÓN Y DATOS
  const [activeTab, setActiveTab] = useState('compras'); 
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null); // Controla qué pedido está desplegado
  
  // Obtenemos los datos actuales del usuario guardados al iniciar sesión
  const user = JSON.parse(localStorage.getItem('user'));

  // 2. ESTADOS PARA LA EDICIÓN DEL PERFIL
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    alias: user?.alias || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || ''
  });
  const [profileMsg, setProfileMsg] = useState('');

  // 3. CARGA DINÁMICA DE DATOS SEGÚN LA PESTAÑA ACTIVA
  useEffect(() => {
    if (activeTab === 'deseos') {
      fetchWishlist();
    } else if (activeTab === 'compras') {
      fetchOrders(); 
    }
  }, [activeTab]);

  // 4. FUNCIONES DE CONEXIÓN CON LA API (Wishlist y Pedidos)
  const fetchWishlist = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(response.data);
    } catch (error) {
      console.error("Error cargando lista de deseos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/orders/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error cargando el historial de compras:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5. MANEJO DEL FORMULARIO DE EDICIÓN DE PERFIL
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://127.0.0.1:8000/api/user/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Actualizamos los datos locales para que los cambios se reflejen de inmediato
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setProfileMsg('¡Perfil actualizado con éxito!');
      setIsEditing(false);
      
      // Recargamos tras 1.5s para que la barra de navegación también se actualice
      setTimeout(() => window.location.reload(), 1500);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor.';
      setProfileMsg(`Error: ${errorMessage}`);
      console.error("Error detallado del backend:", error.response?.data);
    }
  };

  // 6. FUNCIONES AUXILIARES (Formateo de fecha y Despliegue de ticket)
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const toggleOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null); // Cierra si ya estaba abierto
    } else {
      setExpandedOrder(orderId); // Abre el pedido seleccionado
    }
  };

  // Protección: Si alguien entra a la URL sin loguearse
  if (!user) {
    return <div className="profile-container"><h2>Debes iniciar sesión para ver tu perfil.</h2></div>;
  }

  // 7. RENDERIZADO VISUAL DEL PERFIL
  return (
    <div className="profile-container">
      
      {/* CABECERA DEL PERFIL (Avatar, Nombre y Navegación) */}
      <header className="profile-header">
        
        <div className="profile-avatar" style={{ overflow: 'hidden' }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FiUser className="avatar-icon" />
          )}
        </div>
        
        <h1>¡Hola, {user?.alias || user?.name}!</h1>
        <p>Gestiona tu cuenta, tus juegos favoritos y tus compras.</p>
        
        <div className="profile-tabs">
          <button className={`tab-btn ${activeTab === 'datos' ? 'active' : ''}`} onClick={() => setActiveTab('datos')}>
            <FiUser /> Mis Datos
          </button>
          <button className={`tab-btn ${activeTab === 'deseos' ? 'active' : ''}`} onClick={() => setActiveTab('deseos')}>
            <FiHeart /> Lista de Deseos
          </button>
          <button className={`tab-btn ${activeTab === 'compras' ? 'active' : ''}`} onClick={() => setActiveTab('compras')}>
            <FiShoppingBag /> Mis Compras
          </button>
        </div>
      </header>

      <div className="profile-content">
        
        {/* PESTAÑA 1: DATOS PERSONALES Y EDICIÓN */}
        {activeTab === 'datos' && (
          <div className="profile-card data-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Información de la Cuenta</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}>
                  Editar Perfil
                </button>
              )}
            </div>

            {/* Mensajes de éxito o error tras editar */}
            {profileMsg && (
              <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '5px', background: profileMsg.includes('Error') ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,100,0.1)', color: profileMsg.includes('Error') ? '#ff4d4d' : '#00ff64', textAlign: 'center', fontWeight: 'bold' }}>
                {profileMsg}
              </div>
            )}

            {!isEditing ? (
              // Vista de Lectura (Datos Actuales)
              <>
                <div className="data-group">
                  <label>Nombre Completo:</label>
                  <p>{user.name}</p>
                </div>
                <div className="data-group">
                  <label>Alias (Apodo):</label>
                  <p>{user.alias || <span style={{color: '#666', fontStyle: 'italic'}}>No configurado</span>}</p>
                </div>
                <div className="data-group">
                  <label>Correo Electrónico:</label>
                  <p>{user.email}</p>
                </div>
                <div className="data-group">
                  <label>Teléfono:</label>
                  <p>{user.phone || <span style={{color: '#666', fontStyle: 'italic'}}>No configurado</span>}</p>
                </div>
                <div className="data-group">
                  <label>Tipo de Cuenta:</label>
                  <p className="role-badge">{user.role === 'vendedor' ? 'Administrador / Vendedor' : 'Cliente'}</p>
                </div>
              </>
            ) : (
              // Vista de Edición (Formulario)
              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="input-group">
                  <label style={{ color: '#888', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Nombre Completo *</label>
                  <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#222', border: '1px solid #444', color: 'white' }} />
                </div>
                
                <div className="input-group">
                  <label style={{ color: '#888', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Alias (Apodo opcional)</label>
                  <input type="text" name="alias" value={profileData.alias} onChange={handleProfileChange} placeholder="Ej. Gamer69" style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#222', border: '1px solid #444', color: 'white' }} />
                </div>

                <div className="input-group">
                  <label style={{ color: '#888', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Teléfono (Opcional)</label>
                  <input type="text" name="phone" value={profileData.phone} onChange={handleProfileChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#222', border: '1px solid #444', color: 'white' }} />
                </div>

                <div className="input-group">
                  <label style={{ color: '#888', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>URL de Foto de Perfil (Opcional)</label>
                  <input type="url" name="avatar_url" value={profileData.avatar_url} onChange={handleProfileChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', background: '#222', border: '1px solid #444', color: 'white' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '10px', background: '#444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ flex: 1, padding: '10px', background: '#00ff64', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* PESTAÑA 2: LISTA DE DESEOS */}
        {activeTab === 'deseos' && (
          <div className="profile-card wishlist-card">
            <h2>Mi Lista de Deseos</h2>
            {loading ? (
              <p>Cargando tus juegos favoritos...</p>
            ) : wishlist.length > 0 ? (
              <div className="wishlist-grid">
                {wishlist.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FiHeart className="empty-icon" />
                <p>Aún no has guardado ningún juego en tu lista de deseos.</p>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 3: MIS COMPRAS */}
        {activeTab === 'compras' && (
          <div className="profile-card purchases-card">
            <h2>Historial de Compras</h2>
            
            {loading ? (
              <p>Cargando tus recibos...</p>
            ) : orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  
                  return (
                    // La tarjeta de cada pedido actúa como un botón para desplegarse
                    <div key={order.id} className={`order-item-card ${isExpanded ? 'expanded' : ''}`}>
                      <div className="order-header" onClick={() => toggleOrder(order.id)} style={{ cursor: 'pointer' }}>
                        <div className="order-info">
                          <span className="order-id">Pedido #{order.id}</span>
                          <span className="order-date"><FiCalendar /> {formatDate(order.created_at)}</span>
                        </div>
                        <div className="order-status">
                          <span className="status-badge success"><FiCheckCircle /> {order.status}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="order-total">${Number(order.total_amount).toFixed(2)}</span>
                            {/* Cambia la flecha según si el ticket está abierto o cerrado */}
                            {isExpanded ? <FiChevronUp size={24} color="#888" /> : <FiChevronDown size={24} color="#888" />}
                          </div>
                        </div>
                      </div>
                      
                      {/* Ticket detallado: Solo se muestra si el pedido está expandido */}
                      {isExpanded && (
                        <div className="order-products" style={{ marginTop: '1rem', borderTop: '1px dashed #333', paddingTop: '1rem' }}>
                          <h4 style={{ color: '#aaa', marginBottom: '10px' }}>Artículos comprados:</h4>
                          {order.items && order.items.map((item) => (
                            <div key={item.id} className="mini-product-row">
                              <img 
                                src={item.product?.image_url || 'https://via.placeholder.com/50'} 
                                alt={item.product?.name} 
                                className="mini-product-img" 
                              />
                              <div className="mini-product-details">
                                <span className="mini-product-name">{item.product?.name || 'Juego Eliminado'}</span>
                                <span className="mini-product-qty">Cantidad: {item.quantity}</span>
                              </div>
                              <span className="mini-product-price">${Number(item.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <FiShoppingBag className="empty-icon" />
                <p>Aún no has realizado ninguna compra.</p>
                <button onClick={() => window.location.href = '/'} className="btn-explore" style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Ir a la tienda
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;