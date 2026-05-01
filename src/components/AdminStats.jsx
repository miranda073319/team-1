/**
 * AdminStats — Nueva Funcionalidad #2
 * Dashboard de estadísticas del administrador.
 * Se integra como nueva pestaña en AdminDashboard.jsx sin modificar el código existente.
 *
 * Uso en AdminDashboard.jsx (agregar):
 *   import AdminStats from '../components/AdminStats';
 *   // Nueva pestaña: <button onClick={() => setActiveTab('stats')}>Estadísticas</button>
 *   // Nuevo panel: {activeTab === 'stats' && <AdminStats />}
 */
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE from '../config/api';

const StatCard = ({ icon, label, value, color = '#ffb700' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${color}33`,
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
  >
    <span style={{ fontSize: '2rem' }}>{icon}</span>
    <span style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
    <span style={{ color, fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</span>
  </div>
);

const STATUS_COLORS = { pendiente: '#ffb700', completado: '#00ff64', cancelado: '#ff4d4d' };
const STATUS_LABELS = { pendiente: 'Pendientes', completado: 'Completados', cancelado: 'Cancelados' };

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch {
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '40px', color: '#888', textAlign: 'center' }}>Cargando estadísticas...</div>;
  if (error) return <div style={{ padding: '40px', color: '#ff4d4d', textAlign: 'center' }}>{error}</div>;
  if (!stats) return null;

  const totalOrders = stats.ordersByStatus.reduce((s, o) => s + o.count, 0);

  return (
    <div style={{ padding: '24px 0' }}>
      <h2 style={{ color: '#fff', marginBottom: '24px', fontSize: '1.3rem' }}>
        📊 Resumen del Negocio
      </h2>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}>
        <StatCard icon="👥" label="Clientes Registrados" value={stats.totalUsers} color="#00ff64" />
        <StatCard icon="🛒" label="Pedidos Totales" value={stats.totalOrders} color="#ffb700" />
        <StatCard icon="💰" label="Ingresos Totales" value={`$${Number(stats.totalRevenue).toFixed(2)}`} color="#00bfff" />
        <StatCard icon="🎮" label="Juegos en Catálogo" value={stats.totalProducts} color="#ff6b6b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Pedidos por Estado */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '24px', border: '1px solid #2a2a2a' }}>
          <h3 style={{ color: '#fff', marginTop: 0, fontSize: '1rem' }}>Estado de Pedidos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            {stats.ordersByStatus.map(({ status, count }) => {
              const color = STATUS_COLORS[status] ?? '#888';
              const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color, fontWeight: 'bold', textTransform: 'capitalize' }}>{STATUS_LABELS[status] ?? status}</span>
                    <span style={{ color: '#888' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
            {stats.ordersByStatus.length === 0 && (
              <p style={{ color: '#555' }}>Sin pedidos registrados aún.</p>
            )}
          </div>
        </div>

        {/* Producto estrella */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '24px', border: '1px solid #2a2a2a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '3rem' }}>🏆</span>
          <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1rem' }}>Producto Más Vendido</h3>
          {stats.bestSellingProduct ? (
            <p style={{ color: '#ffb700', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>
              {stats.bestSellingProduct}
            </p>
          ) : (
            <p style={{ color: '#555', margin: 0 }}>Aún sin ventas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
