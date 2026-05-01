import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import ReviewSection from '../components/ReviewSection';
import './GameDetails.css';

const GameDetails = () => {
  // 1. ESTADOS Y VARIABLES DE RUTA
  const { id } = useParams(); // Obtiene el ID del juego desde la URL
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false); // Controla el color del corazón

  // 2. PETICIONES A LA API (Carga inicial)
  useEffect(() => {
    // Obtener toda la información del juego
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`);
        setGame(response.data);
      } catch (error) {
        console.error("Error cargando el juego:", error);
      } finally {
        setLoading(false);
      }
    };

    // Comprobar si el usuario ya tiene este juego en su lista de deseos
    const checkWishlistStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/wishlist/check/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsWishlisted(response.data.is_in_wishlist);
        } catch (error) {
          console.error("Error comprobando la lista de deseos", error);
        }
      }
    };

    fetchGame();
    checkWishlistStatus();
  }, [id]);

  // 3. FUNCIONES DE CARRITO Y LISTA DE DESEOS

  // Agrega el juego al carrito 
  const handleAddToCart = async (redirect = false) => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/cart', { product_id: game.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      window.dispatchEvent(new Event('cartUpdated'));

      if (redirect) {
        navigate('/cart');
      } else {
        setMessage('¡Añadido al carrito exitosamente!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Hubo un error al añadir al carrito.');
    }
  };

  // Alterna el estado del juego en la lista de deseos (Agregar/Quitar)
  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/wishlist/toggle', { product_id: game.id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsWishlisted(!isWishlisted);

      if (!isWishlisted) {
        setMessage('¡Añadido a tu lista de deseos! ❤️');
      } else {
        setMessage('Eliminado de tu lista de deseos 💔');
      }
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      setMessage('Error al actualizar tu lista de deseos.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // 4. PANTALLAS DE CARGA Y ERROR
  if (loading) return <div className="loading">Cargando información...</div>;
  if (!game) return <div className="loading">Juego no encontrado.</div>;

  const finalPrice = game.discount_percent > 0
    ? (game.price - (game.price * (game.discount_percent / 100))).toFixed(2)
    : Number(game.price).toFixed(2);

  // 5. RENDERIZADO VISUAL
  return (
    <>
      <div className="game-details-container">
        <div className="game-details-layout">

          {/* SECCIÓN IZQUIERDA: Imagen de Portada */}
          <div className="game-image-section">
            <img
              src={game.image_url || 'https://via.placeholder.com/600x800?text=SteveGames'}
              alt={game.name}
              className="game-detail-img"
            />
          </div>

          {/* SECCIÓN DERECHA: Información y Controles */}
          <div className="game-info-section">

            <h1 className="game-detail-title">{game.name}</h1>

            {/* Bloque de precios y ofertas */}
            <div className="game-detail-pricing">
              {game.discount_percent > 0 ? (
                <>
                  <span className="detail-discount">-{game.discount_percent}%</span>
                  <span className="detail-old-price">${game.price}</span>
                  <span className="detail-current-price">${finalPrice}</span>
                </>
              ) : (
                <span className="detail-current-price">${finalPrice}</span>
              )}
            </div>

            {/* Categorías (Píldoras) */}
            <div className="game-categories" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
              {game.categories && game.categories.length > 0 ? (
                game.categories.map(cat => (
                  <span key={cat.id} style={{ background: 'rgba(255, 183, 0, 0.1)', color: '#ffb700', padding: '6px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {cat.name}
                  </span>
                ))
              ) : (
                <span style={{ background: 'rgba(255, 183, 0, 0.1)', color: '#ffb700', padding: '6px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Juego
                </span>
              )}
            </div>

            <p className="game-detail-desc">{game.description}</p>

            {/* Indicador de Disponibilidad */}
            <div className="game-stock" style={{ marginBottom: '20px' }}>
              {game.stock > 0 ? (
                <span className="in-stock" style={{ color: '#00ff64', fontWeight: 'bold' }}>Disponible ({game.stock} en stock)</span>
              ) : (
                <span className="out-of-stock" style={{ color: '#ff4d4d', fontWeight: 'bold' }}>Agotado</span>
              )}
            </div>

            {/* Notificaciones dinámicas (Toast) */}
            {message && (
              <div className="toast-message" style={{ background: message.includes('Eliminado') || message.includes('Error') ? 'rgba(255, 77, 77, 0.1)' : 'rgba(0, 255, 100, 0.1)', color: message.includes('Eliminado') || message.includes('Error') ? '#ff4d4d' : '#00ff64', padding: '12px', borderRadius: '8px', border: `1px solid ${message.includes('Eliminado') || message.includes('Error') ? '#ff4d4d' : '#00ff64'}`, marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                {message}
              </div>
            )}

            {/* Botones de acción principales */}
            <div className="game-action-buttons">
              <button
                className="btn-buy"
                disabled={game.stock === 0}
                onClick={() => handleAddToCart(true)}
                style={{ opacity: game.stock === 0 ? 0.5 : 1, cursor: game.stock === 0 ? 'not-allowed' : 'pointer' }}
              >
                Comprar Ahora
              </button>

              <button
                className="btn-cart"
                disabled={game.stock === 0}
                onClick={() => handleAddToCart(false)}
                style={{ opacity: game.stock === 0 ? 0.5 : 1, cursor: game.stock === 0 ? 'not-allowed' : 'pointer' }}
              >
                <FiShoppingCart /> Añadir al Carrito
              </button>

              <button
                className="btn-wishlist"
                onClick={handleToggleWishlist}
                style={{ color: isWishlisted ? '#ff4d4d' : '#aaaaaa' }}
              >
                <FiHeart style={{ fill: isWishlisted ? '#ff4d4d' : 'transparent' }} />
                {isWishlisted ? 'En tu lista de deseos' : 'Añadir a la lista de deseos'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Nueva Funcionalidad #1: Reseñas y Valoraciones ── */}
      <ReviewSection gameId={game.id} />
    </>
  );
};

export default GameDetails;