import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService, getUsuario } from '../../services';

function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // SCRUM-81: Cargar usuario desde localStorage
  useEffect(() => {
    const usuarioData = getUsuario();
    if (usuarioData) {
      setUsuario(usuarioData);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Â¿EstÃ¡s seguro de cerrar sesiÃ³n?')) {
      authService.logout();
    }
  };

  return (
    <nav style={{
      backgroundColor: '#667eea',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      {/* Logo / TÃ­tulo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <h2 
          style={{ 
            color: 'white', 
            margin: 0, 
            cursor: 'pointer',
            fontSize: '22px',
          }}
          onClick={() => navigate('/main')}
        >
          íºš ERP LuxChile
        </h2>
      </div>
      
      {/* Usuario y Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* SCRUM-81: Mostrar nombre del usuario */}
        {usuario && (
          <div style={{
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 15px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
          }}>
            <span style={{ fontSize: '18px' }}>í±¤</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                {usuario.nombre}
              </span>
              <span style={{ fontSize: '11px', opacity: 0.9 }}>
                {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
              </span>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          íºª Cerrar sesiÃ³n
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
