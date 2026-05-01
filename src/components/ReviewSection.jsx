/**
 * ReviewSection — Nueva Funcionalidad #1
 * Componente de Reseñas y Valoraciones para juegos.
 * Se integra al final de GameDetails.jsx sin modificar el código existente.
 * 
 * Uso en GameDetails.jsx (agregar al final del JSX):
 *   import ReviewSection from '../components/ReviewSection';
 *   <ReviewSection gameId={game.id} />
 */
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../config/api';

const StarRating = ({ rating, interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px', cursor: interactive ? 'pointer' : 'default' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          style={{
            fontSize: interactive ? '28px' : '18px',
            color: star <= (hovered || rating) ? '#ffb700' : '#444',
            transition: 'color 0.1s',
            userSelect: 'none'
          }}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewSection = ({ gameId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products/${gameId}/reviews`);
      setReviews(res.data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [gameId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setMessage('Selecciona una valoración de 1 a 5 estrellas.'); return; }
    setSubmitting(true);
    setMessage('');
    try {
      await axios.post(
        `${API_BASE}/api/products/${gameId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('¡Reseña publicada con éxito!');
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al publicar la reseña.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const formatDate = (d) => new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div style={{
      marginTop: '50px',
      padding: '30px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      border: '1px solid #2a2a2a'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #2a2a2a', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>
          💬 Reseñas de Jugadores
        </h2>
        {avgRating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem', color: '#ffb700', fontWeight: 'bold' }}>{avgRating}</span>
            <StarRating rating={Math.round(parseFloat(avgRating))} />
            <span style={{ color: '#888', fontSize: '0.9rem' }}>({reviews.length} reseñas)</span>
          </div>
        )}
      </div>

      {/* Form for logged-in users */}
      {token ? (
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(255,183,0,0.05)',
          border: '1px dashed #ffb700',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#ffb700', marginTop: 0, fontSize: '1rem' }}>Tu Valoración</h3>
          <StarRating rating={rating} interactive onRate={setRating} />
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este juego... (opcional)"
            rows={3}
            style={{
              width: '100%', marginTop: '14px', padding: '12px',
              background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px',
              color: '#fff', resize: 'vertical', fontSize: '0.95rem',
              boxSizing: 'border-box'
            }}
          />
          {message && (
            <p style={{ color: message.includes('éxito') ? '#00ff64' : '#ff4d4d', margin: '10px 0 0', fontWeight: 'bold' }}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '12px', padding: '10px 24px', background: '#ffb700',
              color: '#000', border: 'none', borderRadius: '8px',
              fontWeight: 'bold', cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1, fontSize: '0.95rem'
            }}
          >
            {submitting ? 'Publicando...' : 'Publicar Reseña'}
          </button>
        </form>
      ) : (
        <p style={{ color: '#888', marginBottom: '24px' }}>
          <a href="/login" style={{ color: '#ffb700' }}>Inicia sesión</a> para dejar una reseña.
        </p>
      )}

      {/* Reviews list */}
      {loading ? (
        <p style={{ color: '#888' }}>Cargando reseñas...</p>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#555' }}>
          <p style={{ fontSize: '2rem' }}>🎮</p>
          <p>Sé el primero en reseñar este juego.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map(r => (
            <div key={r.id} style={{
              background: '#1a1a1a', borderRadius: '10px', padding: '16px',
              border: '1px solid #2a2a2a'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#fff', marginRight: '10px' }}>{r.userName}</span>
                  <StarRating rating={r.rating} />
                </div>
                <span style={{ color: '#555', fontSize: '0.85rem' }}>{formatDate(r.createdAt)}</span>
              </div>
              {r.comment && <p style={{ margin: 0, color: '#ccc', lineHeight: '1.5' }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
