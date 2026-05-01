import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Optional: verify session on backend or clear local cart state if needed
        // For now just show success message
        window.dispatchEvent(new Event('cartUpdated')); 
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
            <FiCheckCircle size={80} color="#4bb543" style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>¡Pago Exitoso!</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>
                Tu orden ha sido procesada correctamente. Recibirás un correo con los detalles en breve.
            </p>
            <button 
                onClick={() => navigate('/')}
                style={{
                    padding: '12px 30px',
                    fontSize: '1.1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                Volver a la Tienda
            </button>
        </div>
    );
};

export default PaymentSuccess;
