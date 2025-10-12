import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import { getUsuario, isAuthenticated } from '../../services';
import TokenDebug from "../Login/TokenDebug";

function Main() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SCRUM-80: Verificar autenticaci√≥n al cargar
    if (!isAuthenticated()) {
      console.log('‚ùå No autenticado, redirigiendo a login...');
      navigate('/', { replace: true });
      return;
    }

    // SCRUM-80: Obtener usuario desde localStorage
    const usuarioData = getUsuario();
    
    if (usuarioData) {
      console.log('‚úÖ Usuario autenticado:', usuarioData);
      setUsuario(usuarioData);
    } else {
      console.log('‚ö†Ô∏è No se encontr√≥ usuario, redirigiendo...');
      navigate('/', { replace: true });
    }
    
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>‚è≥ Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1>Ìæâ Bienvenido, {usuario.nombre}</h1>
        
        <div style={{ 
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
        }}>
          <h3>Ì≥ã Informaci√≥n del usuario:</h3>
          <p><strong>Ì±§ Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Ì≥ß Email:</strong> {usuario.email}</p>
          <p><strong>Ìæ≠ Rol:</strong> {usuario.rol}</p>
          <p><strong>Ì∂î ID:</strong> {usuario.id}</p>
          <p><strong>‚úÖ Estado:</strong> {usuario.activo ? 'Activo' : 'Inactivo'}</p>
        </div>
        
        {/* SCRUM-77: Debug del token */}
        <TokenDebug />
      </div>
    </div>
  );
}

export default Main;
