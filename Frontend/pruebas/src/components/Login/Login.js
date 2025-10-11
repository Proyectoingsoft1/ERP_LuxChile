import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../../services';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // SCRUM-78: Errores por campo

  // SCRUM-78: Función de validación de campos
  const validarCampos = () => {
    const errores = {};

    // Validar email
    if (!email.trim()) {
      errores.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errores.email = 'Formato de email inválido';
    }

    // Validar contraseña
    if (!password.trim()) {
      errores.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      errores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFieldErrors(errores);
    return Object.keys(errores).length === 0;
  };

  const handleLogin = async () => {
    // Limpiar errores previos
    setError('');
    setFieldErrors({});

    // SCRUM-78: Validar antes de enviar
    if (!validarCampos()) {
      return;
    }

    try {
      const response = await authService.login(email, password);
      console.log("Inicio de sesión exitoso:", response.usuario);
      navigate('/main', { state: { id: response.usuario.id } });
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError('Usuario o contraseña incorrectos');
    }
  };

  // SCRUM-78: Limpiar error del campo al escribir
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors({ ...fieldErrors, email: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors({ ...fieldErrors, password: '' });
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>��� ERP LuxChile</h1>
      <h2>Inicio de sesión</h2>
      
      {/* Campo Email */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="tu.email@luxchile.com"
          value={email}
          onChange={handleEmailChange}
          style={{
            width: '100%',
            padding: '10px',
            border: fieldErrors.email ? '2px solid #e74c3c' : '2px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
          }}
        />
        {/* SCRUM-78: Mostrar error del campo */}
        {fieldErrors.email && (
          <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px', display: 'block' }}>
            ⚠️ {fieldErrors.email}
          </span>
        )}
      </div>
      
      {/* Campo Contraseña */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={handlePasswordChange}
          style={{
            width: '100%',
            padding: '10px',
            border: fieldErrors.password ? '2px solid #e74c3c' : '2px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
          }}
        />
        {/* SCRUM-78: Mostrar error del campo */}
        {fieldErrors.password && (
          <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px', display: 'block' }}>
            ⚠️ {fieldErrors.password}
          </span>
        )}
      </div>

      {/* Error general */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px',
        }}>
          {error}
        </div>
      )}
      
      <button 
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        ��� Iniciar sesión
      </button>
      
      {/* Credenciales de prueba */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <p><strong>Credenciales de prueba:</strong></p>
        <p>��� juan.perez@luxchile.com</p>
        <p>��� password123</p>
      </div>
    </div>
  );
}

export default Login;
