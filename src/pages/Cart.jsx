import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2, FiCreditCard, FiCheckCircle, FiMinus, FiPlus } from 'react-icons/fi';
import paymentService from '../services/paymentService';
import './Cart.css';

const Cart = () => {
  // 1. ESTADOS GENERALES Y DE UI
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // 2. ESTADO DEL MODAL DE PAGO SIMULADO
  const [paymentData, setPaymentData] = useState({
    name: '', cardNumber: '', expiry: '', cvv: ''
  });

  // 3. OBTENER DATOS DEL CARRITO DESDE LA API
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      
      const response = await axios.get('http://127.0.0.1:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCartItems(response.data.items || response.data); 
    } catch (error) {
      console.error("Error cargando el carrito", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 4. ACTUALIZAR CANTIDAD (+ / -) Y ELIMINAR JUEGOS
  const handleUpdateQuantity = async (cartId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return; // Evita bajar de 1 unidad

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://127.0.0.1:8000/api/cart/${cartId}`, { quantity: newQty }, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      fetchCart(); 
      window.dispatchEvent(new Event('cartUpdated')); 
      setErrorMsg(''); 
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Error actualizando cantidad');
    }
  };

  const handleRemove = async (cartId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart(); 
      window.dispatchEvent(new Event('cartUpdated')); 
    } catch (error) {
      console.error("Error eliminando item", error);
    }
  };

  // 5. MANEJO DEL FORMULARIO DE TARJETA Y FORMATEO VISUAL
  const handlePaymentChange = (e) => {
    let { name, value } = e.target;

    // Formateo automático: Agrega espacios a la tarjeta y diagonales a la fecha
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, ''); 
      value = value.replace(/(\d{4})/g, '$1 ').trim(); 
      value = value.substring(0, 19); 
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, ''); 
      if (value.length >= 3) {
        value = `${value.substring(0, 2)}/${value.substring(2, 4)}`; 
      }
      value = value.substring(0, 5); 
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4); 
    }

    setPaymentData({ ...paymentData, [name]: value });
  };

  // 6. CÁLCULO EN TIEMPO REAL DE TOTALES, DESCUENTOS E IVA
  const calcularResumen = () => {
    let precioOriginalTotal = 0;
    let descuentoTotal = 0;

    cartItems.forEach(item => {
      const precioBase = parseFloat(item.product.price);
      const cantidad = parseInt(item.quantity);
      const porcentajeDescuento = item.product.discount_percent || 0;

      const totalItemOriginal = precioBase * cantidad;
      const ahorroItem = totalItemOriginal * (porcentajeDescuento / 100);

      precioOriginalTotal += totalItemOriginal;
      descuentoTotal += ahorroItem;
    });

    const totalAPagar = precioOriginalTotal - descuentoTotal;
    const subtotal = totalAPagar / 1.16; // Extraemos el precio base sin IVA
    const iva = totalAPagar - subtotal;   // Diferencia correspondiente al IVA

    return { precioOriginalTotal, descuentoTotal, subtotal, iva, totalAPagar };
  };

  // Extraemos las variables para usarlas libremente en el return HTML
  const { precioOriginalTotal, descuentoTotal, subtotal, iva, totalAPagar } = calcularResumen();

  // 7. PROCESAR EL PAGO (ENVIAR AL BACKEND Y REDIRIGIR A STRIPE)
  const handlePaymentSubmit = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const successUrl = `${window.location.origin}/payment-success`;
      const cancelUrl = `${window.location.origin}/payment-cancel`;
      
      const response = await paymentService.createCheckoutSession(successUrl, cancelUrl);
      
      if (response.session_url) {
        window.location.href = response.session_url;
      } else {
        throw new Error("No se recibió la URL de Stripe.");
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Error al iniciar el proceso de pago.');
    }
  };

  // 8. RENDERIZADO VISUAL
  if (loading) return <div className="loading">Cargando tu carrito...</div>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Tu Carrito de Compras</h1>

      {/* COMPROBACIONES DE ÉXITO O ERROR */}
      {successMsg && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div className="success-banner" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <FiCheckCircle size={24} /> {successMsg}
          </div>
          <br />
          <button 
            onClick={() => navigate('/')} 
            className="btn-continue" 
            style={{ padding: '12px 30px', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px' }}
          >
            Seguir Comprando
          </button>
        </div>
      )}

      {errorMsg && <div className="error-banner">{errorMsg}</div>}

      {/* SI EL CARRITO ESTÁ VACÍO Y NO HEMOS PAGADO RECIENTEMENTE */}
      {cartItems.length === 0 && !successMsg ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío.</p>
          <button onClick={() => navigate('/')} className="btn-continue">Explorar Juegos</button>
        </div>
      ) : cartItems.length > 0 ? (
        <div className="cart-layout">
          
          {/* LADO IZQUIERDO: LISTA DE JUEGOS AGREGADOS */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.product.image_url || 'https://via.placeholder.com/150'} alt={item.product.name} />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  
                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} className="qty-btn"><FiMinus /></button>
                    <span className="qty-number">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} className="qty-btn"><FiPlus /></button>
                  </div>

                </div>
                <div className="item-price-actions">
                  <span className="item-price">
                    ${(item.product.price * (1 - (item.product.discount_percent / 100)) * item.quantity).toFixed(2)}
                  </span>
                  <button className="btn-remove" onClick={() => handleRemove(item.id)}>
                    <FiTrash2 /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* LADO DERECHO: TICKET / RESUMEN */}
          <div className="cart-summary-section">
            <h2>Resumen del Pedido</h2>
            
            <div className="summary-row">
              <span>Precio Original</span>
              <span>${precioOriginalTotal.toFixed(2)}</span>
            </div>
            
            {/* Solo se muestra si hubo ahorro por ofertas */}
            {descuentoTotal > 0 && (
              <div className="summary-row" style={{ color: '#ffb700', fontWeight: 'bold' }}>
                <span>Descuento Aplicado</span>
                <span>-${descuentoTotal.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>IVA (16%)</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            
            <hr className="summary-divider" />
            
            <div className="summary-row total-row">
              <span>Total a Pagar</span>
              <span>${totalAPagar.toFixed(2)}</span>
            </div>
            
            <button className="btn-checkout" onClick={handlePaymentSubmit}>Proceder al Pago con Stripe</button>
          </div>
        </div>
      ) : null}

      {/* El modal de pago simulado ha sido eliminado para usar Stripe Checkout */}
    </div>
  );
};

export default Cart;