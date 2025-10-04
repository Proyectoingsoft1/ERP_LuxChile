import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa nombre y contraseña');
      return;
    }

    try {
      const response = await axios.get("https://api.sheetbest.com/sheets/edc9c453-f29b-4b27-8fd2-2d14e54c8358");
      const users = response.data;

      const matchedUser = users.find(user =>
        user.nombre === username && user.clave === password
      );

      if (matchedUser) {
        console.log("Inicio de sesión exitoso:"+matchedUser.id);
        navigate('/main', { state: { id: matchedUser.id } });
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h1>Inicio sesion</h1>
      <input
        type="text"
        placeholder="Ingresa tu nombre"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Ingresa tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;

