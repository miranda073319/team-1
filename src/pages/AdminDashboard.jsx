import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiList, FiBox } from 'react-icons/fi';
import './AdminDashboard.css';

/**
 * Componente AdminDashboard (Panel de Administración)
 * Permite a los usuarios con rol 'vendedor' gestionar el inventario de juegos
 * (Crear, Leer, Actualizar, Eliminar) y administrar el estado de los pedidos.
 */
const AdminDashboard = () => {
 
  // 1. ESTADOS PRINCIPALES
  
  const [activeTab, setActiveTab] = useState('inventory'); // Pestaña activa ('inventory', 'form', 'pedidos')
  const [games, setGames] = useState([]);                  // Lista de juegos en el catálogo
  const [orders, setOrders] = useState([]);                // Lista de pedidos de los clientes
  const [message, setMessage] = useState('');              // Mensajes de éxito o error en pantalla
  const [editingId, setEditingId] = useState(null);        // Guarda el ID del juego si estamos editando
  
  // Estado base para limpiar el formulario
  const initialFormState = {
    name: '', description: '', price: '', discount_percent: 0, stock: 10, image_url: '', 
    categories: [], is_featured: false 
  };
  const [formData, setFormData] = useState(initialFormState);

  // 2. PETICIONES A LA API (JUEGOS Y PEDIDOS)
  
  // Obtiene todos los juegos públicos del catálogo
  const fetchGames = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setGames(response.data);
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    }
  };

  // Obtiene todos los pedidos (Requiere Token de Vendedor)
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  // Actualiza el estado de un pedido (Pendiente, Completado, Cancelado)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/api/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Actualizamos la tabla visualmente sin recargar la página
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setMessage('Estado del pedido actualizado.');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setMessage('Error al actualizar el estado del pedido.');
    }
  };

  // 3. EFECTOS (Ciclo de vida)
  
  // Carga los juegos al abrir el componente por primera vez
  useEffect(() => { fetchGames(); }, []);

  // Carga los pedidos solo cuando el usuario cambia a la pestaña de "pedidos"
  useEffect(() => {
    if (activeTab === 'pedidos') fetchOrders();
  }, [activeTab]);

  // Oculta los mensajes de éxito/error automáticamente después de 3 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000); 
      return () => clearTimeout(timer); 
    }
  }, [message]);

  // 4. LÓGICA DEL FORMULARIO DE INVENTARIO
  
  // Maneja los cambios de texto y checkboxes simples en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Maneja la selección múltiple de categorías (agrega o quita del arreglo)
  const handleCategoryToggle = (categoryId) => {
    setFormData((prevData) => {
      const isSelected = prevData.categories.includes(categoryId);
      if (isSelected) {
        return { ...prevData, categories: prevData.categories.filter(id => id !== categoryId) };
      } else {
        return { ...prevData, categories: [...prevData.categories, categoryId] };
      }
    });
  };

  const availableCategories = [
    { id: 1, name: 'Acción' }, { id: 2, name: 'Aventura' }, { id: 3, name: 'RPG' },
    { id: 4, name: 'Shooter' }, { id: 5, name: 'Estrategia' }, { id: 6, name: 'Deportes' },
    { id: 7, name: 'Carreras' }, { id: 8, name: 'Terror' }, { id: 9, name: 'Simulación' },
    { id: 10, name: 'Indie' }
  ];

  // Prepara el formulario con los datos del juego a editar y cambia de pestaña
  const handleEditClick = (game) => {
    setEditingId(game.id);
    setFormData({
      name: game.name, description: game.description, price: game.price,
      discount_percent: game.discount_percent, stock: game.stock, image_url: game.image_url,
      categories: game.categories ? game.categories.map(cat => cat.id) : [],
      is_featured: !!game.is_featured 
    });
    setActiveTab('form');
    setMessage('');
  };

  // Elimina un juego tras confirmación
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este juego del catálogo?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Juego eliminado correctamente.');
      fetchGames(); 
    } catch (error) {
      setMessage('Error al eliminar el juego.');
    }
  };

  // Envía el formulario a la API (Crea o Actualiza según exista un editingId)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' };

      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/products/${editingId}`, formData, { headers });
        setMessage('¡Juego actualizado con éxito!');
      } else {
        await axios.post('http://127.0.0.1:8000/api/products', formData, { headers });
        setMessage('¡Juego publicado con éxito!');
      }

      setFormData(initialFormState);
      setEditingId(null);
      fetchGames(); 
      setTimeout(() => setActiveTab('inventory'), 2000); // Vuelve a la tabla tras guardar
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Hubo un error al guardar los datos.');
    }
  };

  // Limpia el formulario y aborta la edición
  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setActiveTab('inventory');
    setMessage('');
  };

  // 5. RENDERIZADO VISUAL

  return (
    <div className="admin-container">
      
      {/* CABECERA Y NAVEGACIÓN DE PESTAÑAS */}
      <header className="admin-header">
        <h1>Panel de Gestión - SteveGames</h1>
        <p>Control total de tu inventario, precios y ofertas.</p>
        
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inventory'); setMessage(''); }}
          >
            <FiList /> Inventario
          </button>
          
          <button 
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => { setActiveTab('form'); setEditingId(null); setFormData(initialFormState); setMessage(''); }}
          >
            <FiPlus /> {editingId ? 'Editando Juego' : 'Añadir Nuevo'}
          </button>

          <button 
            className={`tab-btn ${activeTab === 'pedidos' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pedidos'); setMessage(''); }}
          >
            <FiBox /> Gestión de Pedidos
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Banner de mensajes (Verde para éxito, Rojo para error) */}
        {message && <div className={`admin-msg ${message.includes('éxito') || message.includes('correctamente') || message.includes('actualizado') ? 'success' : 'error'}`}>{message}</div>}

        {/* PESTAÑA 1: TABLA DE INVENTARIO*/}
        {activeTab === 'inventory' && (
          <div className="admin-card">
            <h2>Catálogo Actual</h2>
            <div className="table-responsive">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Juego</th><th>Precio Base</th><th>Oferta</th><th>Precio Final</th><th>Stock</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => {
                    const finalPrice = game.price * (1 - (game.discount_percent / 100));
                    return (
                      <tr key={game.id}>
                        <td>#{game.id}</td>
                        <td className="game-name-cell">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontWeight: 'bold' }}>
                              {game.name} 
                              {game.is_featured && <span style={{ color: '#ffb700', marginLeft: '8px', fontSize: '0.8rem' }}>⭐ Destacado</span>}
                            </span>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {game.categories && game.categories.map(cat => (
                                <span key={cat.id} style={{ fontSize: '0.75rem', background: '#333', padding: '2px 6px', borderRadius: '4px', color: '#ccc' }}>
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>${game.price}</td>
                        <td>
                          {game.discount_percent > 0 ? <span className="discount-tag">-{game.discount_percent}%</span> : '-'}
                        </td>
                        <td className="final-price">${finalPrice.toFixed(2)}</td>
                        <td>
                          <span className={`stock-tag ${game.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                            {game.stock > 0 ? `${game.stock} unids.` : 'Agotado'}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button onClick={() => handleEditClick(game)} className="action-btn edit" title="Editar"><FiEdit /></button>
                          <button onClick={() => handleDelete(game.id)} className="action-btn delete" title="Eliminar"><FiTrash2 /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: FORMULARIO*/}
        {activeTab === 'form' && (
          <div className="admin-card">
            <h2>{editingId ? `Editar: ${formData.name}` : 'Añadir Nuevo Juego'}</h2>
            
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label>Nombre del Juego</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Ej. Cyberpunk 2077" />
                </div>
                
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Categorías Múltiples (Selecciona una o más)</label>
                  <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', background: '#2a2a2a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                    {availableCategories.map(cat => (
                      <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'white' }}>
                        <input 
                          type="checkbox" checked={formData.categories.includes(cat.id)}
                          onChange={() => handleCategoryToggle(cat.id)}
                          style={{ width: '18px', height: '18px', accentColor: '#ffb700' }}
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label>Descripción Corta</label>
                <textarea name="description" required rows="3" value={formData.description} onChange={handleChange} placeholder="De qué trata el juego..."></textarea>
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>Precio Base ($)</label>
                  <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Descuento (%) - Pon 0 si no hay oferta</label>
                  <input type="number" name="discount_percent" min="0" max="100" value={formData.discount_percent} onChange={handleChange} />
                </div>
                <div className="input-group">
                  <label>Stock Disponible (Pon 0 para Agotado)</label>
                  <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleChange} />
                </div>
              </div>

              <div className="input-group">
                <label>URL de la Imagen (Portada)</label>
                <input type="url" name="image_url" required value={formData.image_url} onChange={handleChange} placeholder="https://ejemplo.com/portada.jpg" />
              </div>

              <div style={{ background: 'rgba(255, 183, 0, 0.1)', padding: '15px', borderRadius: '8px', border: '1px dashed #ffb700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <input 
                  type="checkbox" id="is_featured" name="is_featured" 
                  checked={formData.is_featured} onChange={handleChange} 
                  style={{ width: '20px', height: '20px', accentColor: '#ffb700', cursor: 'pointer' }} 
                />
                <label htmlFor="is_featured" style={{ color: '#ffb700', fontWeight: 'bold', margin: 0, cursor: 'pointer', fontSize: '1.1rem' }}>
                  ⭐ Destacar este juego en la página principal
                </label>
              </div>

              <div className="form-actions">
                {editingId && (
                  <button type="button" className="admin-cancel-btn" onClick={handleCancelEdit}>Cancelar</button>
                )}
                <button type="submit" className="admin-submit-btn">
                  {editingId ? 'Guardar Cambios' : 'Publicar Juego'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PESTAÑA 3: GESTIÓN DE PEDIDOS*/}
        {activeTab === 'pedidos' && (
          <div className="admin-card">
            <h2>Todos los Pedidos Registrados</h2>
            <div className="table-responsive">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>ID Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 'bold' }}>#{order.id}</td>
                      <td>{order.user ? order.user.email : 'Usuario Eliminado'}</td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="final-price">${order.total_amount}</td>
                      <td>
                        {/* Dropdown interactivo para cambiar el estatus del pedido */}
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{
                            padding: '6px 12px', borderRadius: '6px',
                            backgroundColor: order.status === 'completado' ? 'rgba(0, 255, 100, 0.2)' : order.status === 'cancelado' ? 'rgba(255, 77, 77, 0.2)' : 'rgba(255, 183, 0, 0.2)',
                            color: order.status === 'completado' ? '#00ff64' : order.status === 'cancelado' ? '#ff4d4d' : '#ffb700',
                            fontWeight: 'bold', border: `1px solid ${order.status === 'completado' ? '#00ff64' : order.status === 'cancelado' ? '#ff4d4d' : '#ffb700'}`,
                            cursor: 'pointer', outline: 'none'
                          }}
                        >
                          <option value="pendiente" style={{ color: '#000' }}>Pendiente</option>
                          <option value="completado" style={{ color: '#000' }}>Completado</option>
                          <option value="cancelado" style={{ color: '#000' }}>Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                        Aún no hay pedidos registrados en la tienda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;