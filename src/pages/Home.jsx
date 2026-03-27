import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import GameCard from '../components/GameCard';
import { FiStar, FiTag, FiGrid, FiSearch, FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import './Home.css';

// Usamos las categorías oficiales de tu tienda
const CATEGORIAS_OFICIALES = [
  'Acción', 'Aventura', 'RPG', 'Shooter', 'Estrategia', 
  'Deportes', 'Carreras', 'Terror', 'Simulación', 'Indie'
];

const Home = () => {
  // 1. ESTADOS GENERALES Y REFERENCIAS
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Para saber si estamos viendo el inicio normal o una sección completa ("Ver todos")
  const [viewAll, setViewAll] = useState(null); 

  // Referencias DOM para mover los carruseles de juegos
  const destacadosRef = useRef(null);
  const ofertasRef = useRef(null);

  // Control de la visibilidad de las flechas del carrusel según la posición
  const [showArrows, setShowArrows] = useState({
    destacados: { left: false, right: true },
    ofertas: { left: false, right: true }
  });

  // 2. VARIABLES DE RUTA Y BÚSQUEDA
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // 3. CARGA DE DATOS DESDE LA API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 4. LÓGICA DE CARRUSELES Y FILTROS
  const checkScroll = (ref, sectionName) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      
      const isLeftVisible = scrollLeft > 50; 
      const isRightVisible = scrollLeft + clientWidth < scrollWidth - 50; 
      
      setShowArrows(prev => ({
        ...prev,
        [sectionName]: { left: isLeftVisible, right: isRightVisible }
      }));
    }
  };

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleCategory = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  // 5. PREPARACIÓN DE DATOS (FILTRADO Y CATEGORIZACIÓN)
  if (loading) return <div className="loading">Cargando el catálogo de SteveGames...</div>;

  const searchResults = products.filter(game => 
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const destacados = [...products].reverse().slice(0, 10);
  const ofertas = products.filter(game => game.discount_percent > 0);
  const catalogoFiltrado = products.filter(game => {
    if (selectedCategories.length === 0) return true;
    if (!game.categories) return false;
    return game.categories.some(cat => selectedCategories.includes(cat.name));
  });

  // 6. RENDERIZADO VISUAL - VISTA SECUNDARIA ("VER TODOS")
  if (viewAll) {
    const listToShow = viewAll === 'destacados' ? destacados : ofertas;
    const title = viewAll === 'destacados' ? 'Todos los Destacados' : 'Todas las Ofertas';
    const icon = viewAll === 'destacados' ? <FiStar /> : <FiTag />;
    const colorClass = viewAll === 'destacados' ? 'text-gold' : 'text-green';

    return (
      <div className="home-container">
        <button className="btn-back" onClick={() => setViewAll(null)}>
          <FiArrowLeft /> Volver al Inicio
        </button>
        <section className="home-section">
          <h2 className={`section-title ${colorClass}`}>{icon} {title}</h2>
          <div className="games-grid">
            {listToShow.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </section>
      </div>
    );
  }

  // 7. RENDERIZADO VISUAL - VISTA PRINCIPAL
  return (
    <div className="home-container">
      
      {/* SI HAY UNA BÚSQUEDA ACTIVA */}
      {searchQuery ? (
        <div className="search-results-section">
          <h2 className="section-title"><FiSearch /> Resultados para: "{searchQuery}"</h2>
          {searchResults.length > 0 ? (
            <div className="games-grid">
              {searchResults.map(game => <GameCard key={game.id} game={game} />)}
            </div>
          ) : (
            <div className="empty-state">No se encontraron juegos que coincidan con tu búsqueda.</div>
          )}
        </div>
      ) : (
        /* SI ESTAMOS EN EL INICIO NORMAL (NO BÚSQUEDA) */
        <>
          {/* SECCIÓN 1: DESTACADOS */}
          <section className="home-section">
            <div className="section-header">
              <div>
                <h2 className="section-title text-gold"><FiStar /> Destacados</h2>
                <p className="section-subtitle">Los últimos lanzamientos y tendencias.</p>
              </div>
              <button className="btn-view-all" onClick={() => setViewAll('destacados')}>Ver todos</button>
            </div>
            
            <div className="carousel-wrapper">
              {showArrows.destacados.left && (
                <button className="carousel-btn left" onClick={() => scrollCarousel(destacadosRef, 'left')}><FiChevronLeft/></button>
              )}
              
              <div className="carousel-track" ref={destacadosRef} onScroll={() => checkScroll(destacadosRef, 'destacados')}>
                {destacados.map(game => (
                  <div key={game.id} className="carousel-item">
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
              
              {showArrows.destacados.right && (
                <button className="carousel-btn right" onClick={() => scrollCarousel(destacadosRef, 'right')}><FiChevronRight/></button>
              )}
            </div>
          </section>

          {/* SECCIÓN 2: OFERTAS */}
          {ofertas.length > 0 && (
            <section className="home-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title text-green"><FiTag /> Ofertas Especiales</h2>
                  <p className="section-subtitle">Grandes descuentos por tiempo limitado.</p>
                </div>
                <button className="btn-view-all" onClick={() => setViewAll('ofertas')}>Ver todos</button>
              </div>

              <div className="carousel-wrapper">
                {showArrows.ofertas.left && (
                  <button className="carousel-btn left" onClick={() => scrollCarousel(ofertasRef, 'left')}><FiChevronLeft/></button>
                )}
                
                <div className="carousel-track" ref={ofertasRef} onScroll={() => checkScroll(ofertasRef, 'ofertas')}>
                  {ofertas.map(game => (
                    <div key={game.id} className="carousel-item">
                      <GameCard game={game} />
                    </div>
                  ))}
                </div>
                
                {showArrows.ofertas.right && (
                  <button className="carousel-btn right" onClick={() => scrollCarousel(ofertasRef, 'right')}><FiChevronRight/></button>
                )}
              </div>
            </section>
          )}

          {/* SECCIÓN 3: CATÁLOGO COMPLETO Y FILTROS */}
          <section className="home-section">
            <h2 className="section-title"><FiGrid /> Catálogo Completo</h2>
            
            <div className="category-filters">
              <span className="filter-label">Explora por tus géneros favoritos:</span>
              <div className="filters-container">
                <button 
                  className={`filter-pill ${selectedCategories.length === 0 ? 'active' : ''}`}
                  onClick={() => setSelectedCategories([])}
                >
                  Todos
                </button>
                {CATEGORIAS_OFICIALES.map(category => (
                  <button
                    key={category}
                    className={`filter-pill ${selectedCategories.includes(category) ? 'active' : ''}`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {catalogoFiltrado.length > 0 ? (
              <div className="games-grid">
                {catalogoFiltrado.map(game => <GameCard key={game.id} game={game} />)}
              </div>
            ) : (
              <div className="empty-state">No hay juegos con estas categorías.</div>
            )}
          </section>
        </>
      )}

    </div>
  );
};

export default Home;