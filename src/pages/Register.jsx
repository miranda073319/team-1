import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  // 1. ESTADOS DEL FORMULARIO Y NAVEGACIÓN
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 2. FUNCIÓN PARA PROCESAR EL REGISTRO
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Enviamos los datos del nuevo usuario al backend
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password
      }, {
        // Aseguramos que Laravel entienda que enviamos y esperamos formato JSON
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Guardamos credenciales e ingresamos automáticamente (Auto-Login)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirigimos a la página principal y recargamos
      navigate('/');
      window.location.reload();
      
    } catch (err) {
      // 3. MANEJO DE ERRORES DEL BACKEND
      // Si Laravel manda un mensaje específico (ej. "El correo ya existe"), lo mostramos
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Hubo un error al registrarse. Verifica tus datos.');
      }
    }
  };

  // 4. RENDERIZADO VISUAL DEL FORMULARIO
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Crear Cuenta</h2>
        
        {/* Muestra mensaje de error si el registro falla */}
        {error && <div className="error-msg">{error}</div>}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Nombre de Usuario</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. StevePlayer"
            />
          </div>

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
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button type="submit" className="auth-btn">Registrarse</button>
        </form>

        {/* Enlace para volver al login si ya tiene cuenta */}
        <div className="auth-links">
          ¿Ya tienes cuenta? 
          <Link to="/login">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;