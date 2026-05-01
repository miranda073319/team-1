import { useNavigate } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

const PaymentCancel = () => {
    const navigate = useNavigate();

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
            <FiXCircle size={80} color="#ff4d4d" style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#fff' }}>Pago Cancelado</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>
                No se ha realizado ningún cargo. Puedes intentarlo de nuevo cuando quieras.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                    onClick={() => navigate('/cart')}
                    style={{
                        padding: '12px 30px',
                        fontSize: '1.1rem',
                        backgroundColor: '#555',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Volver al Carrito
                </button>
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
                    Ir a la Tienda
                </button>
            </div>
        </div>
    );
};

export default PaymentCancel;
