import { useEffect, useState } from 'react';
import { getToken, getUsuario } from '../../services';

function TokenDebug() {
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    // SCRUM-77: Leer token desde localStorage
    const token = getToken();
    const usuario = getUsuario();

    if (token && usuario) {
      setTokenInfo({
        hasToken: true,
        tokenLength: token.length,
        usuario: usuario,
      });
    }
  }, []);

  // Solo mostrar en development
  if (process.env.NODE_ENV !== 'development' || !tokenInfo) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <strong>Ì¥ê SCRUM-77: Token Debug</strong>
      <div style={{ marginTop: '8px' }}>
        ‚úÖ Token en localStorage: S√≠ ({tokenInfo.tokenLength} caracteres)
      </div>
      <div style={{ marginTop: '4px' }}>
        Ì±§ Usuario: {tokenInfo.usuario.nombre}
      </div>
      <div style={{ marginTop: '4px', fontSize: '10px', color: '#666' }}>
        (Solo visible en desarrollo)
      </div>
    </div>
  );
}

export default TokenDebug;
