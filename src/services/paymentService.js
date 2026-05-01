import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const paymentService = {
    createCheckoutSession: async (successUrl, cancelUrl) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE}/api/payments/create-session`,
            {
                success_url: successUrl,
                cancel_url: cancelUrl
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            }
        );
        return response.data;
    }
};

export default paymentService; // <--- Asegúrate de que esta línea esté presente
