import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../../services';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false); // SCRUM-79: Estado de loading

  const validarCampos = () => {
    const errores = {};

    if (!email.trim()) {
      errores.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errores.email = 'Formato de email inválido';
    }

    if (!password.trim()) {
      errores.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      errores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setFieldErrors(errores);
    return Object.keys(errores).length === 0;
  };

  const handleLogin = async () => {
    setError('');
    setFieldErrors({});

    if (!validarCampos()) {
      return;
    }

    setLoading(true); // SCRUM-79: Iniciar loading

    try {
      const response = await authService.login(email, password);
      console.log("✅ Login exitoso:", response.usuario);
      navigate('/main', { state: { id: response.usuario.id } });
      
    } catch (err) {
      // SCRUM-79: Mostrar mensajes de error específicos del backend
      console.error("❌ Error en login:", err);
      
      // Determinar tipo de error
      if (typeof err === 'string') {
        // Error del backend (credenciales incorrectas, etc.)
        setError(err);
      } else if (err.message && err.message.includes('Network')) {
        // Error de conexión
        setError('⚠️ No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      } else {
        // Error genérico
        setError('❌ Error al iniciar sesión. Por favor, intenta nuevamente.');
      }
      
    } finally {
      setLoading(false); // SCRUM-79: Terminar loading
    }
  };

  // Permitir login con Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (fieldErrors.email) {
      setFieldErrors({ ...fieldErrors, email: '' });
    }
    // SCRUM-79: Limpiar error general al escribir
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors({ ...fieldErrors, password: '' });
    }
    // SCRUM-79: Limpiar error general al escribir
    if (error) setError('');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>��� ERP LuxChile</h1>
      <h2>Inicio de sesión</h2>
      
      {/* Campo Email */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="tu.email@luxchile.com"
          value={email}
          onChange={handleEmailChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            border: fieldErrors.email ? '2px solid #e74c3c' : '2px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            backgroundColor: loading ? '#f5f5f5' : 'white',
            cursor: loading ? 'not-allowed' : 'text',
          }}
        />
        {fieldErrors.email && (
          <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px', display: 'block' }}>
            ⚠️ {fieldErrors.email}
          </span>
        )}
      </div>
      
      {/* Campo Contraseña */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            border: fieldErrors.password ? '2px solid #e74c3c' : '2px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            backgroundColor: loading ? '#f5f5f5' : 'white',
            cursor: loading ? 'not-allowed' : 'text',
          }}
        />
        {fieldErrors.password && (
          <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px', display: 'block' }}>
            ⚠️ {fieldErrors.password}
          </span>
        )}
      </div>

      {/* SCRUM-79: Error general mejorado */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #fcc',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}
      
      {/* SCRUM-79: Botón con estado de loading */}
      <button 
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#999' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s',
        }}
      >
        {loading ? '⏳ Iniciando sesión...' : '��� Iniciar sesión'}
      </button>
      
      {/* Credenciales de prueba */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        fontSize: '12px', 
        color: '#666', 
        textAlign: 'center',
      }}>
        <p style={{ margin: '5px 0' }}><strong>Credenciales de prueba:</strong></p>
        <p style={{ margin: '5px 0' }}>��� juan.perez@luxchile.com</p>
        <p style={{ margin: '5px 0' }}>��� password123</p>
      </div>
    </div>
  );
}

export default Login;
