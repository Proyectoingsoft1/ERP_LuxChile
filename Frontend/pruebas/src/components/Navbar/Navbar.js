import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Â¿EstÃ¡s seguro de cerrar sesiÃ³n?')) {
      authService.logout();
      // authService.logout() ya redirige a '/'
    }
  };

  return (
    <nav style={{
      backgroundColor: '#667eea',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <h2 style={{ color: 'white', margin: 0 }}>íºš ERP LuxChile</h2>
      
      <div>
        <button
          onClick={() => navigate('/main')}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '8px 15px',
            marginRight: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          í¿  Inicio
        </button>
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          íºª Cerrar sesiÃ³n
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
