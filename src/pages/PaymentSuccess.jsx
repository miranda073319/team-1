import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [clearing, setClearing] = useState(true);

    useEffect(() => {
        const clearCartAndNotify = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Fetch the (now empty) cart from the server to confirm it's cleared.
                    // The webhook already removed cart items on the backend.
                    // This call just ensures our frontend state is in sync.
                    await axios.get(`${API_BASE}/api/cart`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
            } catch (err) {
                // Non-critical – just log and proceed
                console.warn('Could not refresh cart state:', err);
            } finally {
                // Notify all components (Navbar cart counter, etc.) that the cart changed
                window.dispatchEvent(new Event('cartUpdated'));
                setClearing(false);
            }
        };

        clearCartAndNotify();
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            {clearing ? (
                <>
                    <FiLoader size={60} color="#7c8cf8" style={{ marginBottom: '1.5rem', animation: 'spin 1s linear infinite' }} />
                    <p style={{ fontSize: '1.1rem', color: '#ccc' }}>Procesando tu compra...</p>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </>
            ) : (
                <>
                    <FiCheckCircle size={80} color="#4bb543" style={{ marginBottom: '1.5rem' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>¡Pago Exitoso!</h1>
                    <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '0.75rem' }}>
                        Tu orden ha sido procesada correctamente.
                    </p>
                    <p style={{ fontSize: '1rem', color: '#a0a8ff', marginBottom: '2rem' }}>
                        📧 Recibirás un correo de confirmación con los detalles de tu compra en breve.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => navigate('/profile')}
                            style={{
                                padding: '12px 30px',
                                fontSize: '1.1rem',
                                background: 'linear-gradient(135deg, #5c6bc0, #7c8cf8)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Ver Mi Biblioteca 🎮
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '12px 30px',
                                fontSize: '1.1rem',
                                backgroundColor: 'transparent',
                                color: '#7c8cf8',
                                border: '2px solid #5c6bc0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Seguir Comprando
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentSuccess;
