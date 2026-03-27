import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  // 1. ESTADOS DEL FORMULARIO Y NAVEGACIÓN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2. FUNCIÓN PARA PROCESAR EL INICIO DE SESIÓN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password
      });

      // Guardamos el token de seguridad y los datos del usuario en el navegador
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirigimos al inicio de la tienda
      navigate('/');
      
      // Forzamos una recarga para que el navbar actualice su estado (muestre el perfil)
      window.location.reload(); 
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  // 3. RENDERIZADO VISUAL DEL FORMULARIO
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        
        {/* Muestra mensaje de error si las credenciales fallan */}
        {error && <div className="error-msg">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="auth-btn">Entrar</button>
        </form>

        {/* Enlace para ir al registro si no tiene cuenta */}
        <div className="auth-links">
          ¿No tienes una cuenta de SteveGames? 
          <Link to="/registro">Regístrate</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;