import { Link } from 'react-router-dom';
import './GameCard.css';

/**
 * Componente GameCard
 * Representa la tarjeta individual de un videojuego en el catálogo.
 * Recibe un objeto 'game' como prop (propiedad) con todos los datos del juego.
 */
const GameCard = ({ game }) => {
  
  // LÓGICA DE PRECIOS:
  // Verificamos si el juego tiene un porcentaje de descuento mayor a 0.
  // Si es así, calculamos el precio restando el porcentaje. Si no, mostramos el precio normal.
  const finalPrice = game.discount_percent > 0 
    ? (game.price - (game.price * (game.discount_percent / 100))).toFixed(2)
    : Number(game.price).toFixed(2);

  return (
    // CONTENEDOR PRINCIPAL:
    // Al hacer clic, redirige a la ruta /juego/ID_DEL_JUEGO.
    <Link to={`/juego/${game.id}`} className="game-card">
      
      {/* SECCIÓN DE LA IMAGEN (PORTADA) */}
      <div className="card-image-wrapper">
        <img 
          // Si el juego no tiene imagen (null o vacía), muestra una imagen gris por defecto de placeholder.
          src={game.image_url || 'https://via.placeholder.com/300x400?text=SteveGames'} 
          alt={game.name} 
          className="game-image"
        />
      </div>
      
      {/* SECCIÓN DE CONTENIDO (TEXTOS Y PRECIOS) */}
      <div className="card-content">
        
        {/* ETIQUETAS DE CATEGORÍAS */}
        {/* Usamos flex-wrap para que si hay muchas categorías, bajen a la siguiente línea sin romper el diseño */}
        <div className="game-categories" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          
          {/* Verificamos que el arreglo de categorías exista y tenga elementos */}
          {game.categories && game.categories.length > 0 ? (
            // Recorremos las categorías y creamos una "píldora" visual para cada una
            game.categories.map(cat => (
              <span key={cat.id} style={{ background: 'rgba(255, 183, 0, 0.1)', color: '#ffb700', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {cat.name}
              </span>
            ))
          ) : (
            // Si el juego no tiene categorías asignadas, mostramos una etiqueta genérica
            <span style={{ background: 'rgba(255, 183, 0, 0.1)', color: '#ffb700', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
              Juego
            </span>
          )}
        </div>

        {/* TÍTULO DEL JUEGO */}
        <h3 className="game-title">{game.name}</h3>
        
        {/* SECCIÓN DE PRECIOS */}
        <div className="game-pricing">
          {/* Si hay descuento, mostramos la etiqueta*/}
          {game.discount_percent > 0 ? (
            <>
              <span className="discount-badge">-{game.discount_percent}%</span>
              <span className="old-price">${game.price}</span>
              <span className="current-price">${finalPrice}</span>
            </>
          ) : (
            // Si no hay descuento, solo mostramos el precio actual limpio
            <span className="current-price">${finalPrice}</span>
          )}
        </div>
        
      </div>
    </Link>
  );
};

export default GameCard;