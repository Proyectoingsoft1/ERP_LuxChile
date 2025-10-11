import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../../services';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // ← CAMBIAR de username a email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Validación básica
    if (!email.trim() || !password.trim()) { // ← CAMBIAR username por email
      setError('Por favor ingresa email y contraseña');
      return;
    }

    try {
      // SCRUM-76: Conectar con API
      const response = await authService.login(email, password); // ← CAMBIAR username por email
      
      console.log("Inicio de sesión exitoso:", response.usuario);
      
      navigate('/main', { state: { id: response.usuario.id } });
      
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <h1>Inicio sesion</h1>
      <input
        type="email" // ← CAMBIAR de text a email
        placeholder="Ingresa tu email"
        value={email} // ← CAMBIAR de username a email
        onChange={(e) => setEmail(e.target.value)} // ← CAMBIAR setUsername por setEmail
      />
      <input
        type="password"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Credenciales de prueba */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Credenciales de prueba:</strong></p>
        <p>Email: juan.perez@luxchile.com</p>
        <p>Password: password123</p>
      </div>
    </div>
  );
}

export default Login;
