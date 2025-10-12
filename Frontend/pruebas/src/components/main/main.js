import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import { getUsuario, isAuthenticated, dashboardService } from '../../services';
import TokenDebug from "../Login/TokenDebug";

function Main() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rutasActivas, setRutasActivas] = useState([]); // SCRUM-85
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      console.log('❌ No autenticado, redirigiendo a login...');
      navigate('/', { replace: true });
      return;
    }

    // Obtener usuario
    const usuarioData = getUsuario();
    if (usuarioData) {
      console.log('✅ Usuario autenticado:', usuarioData);
      setUsuario(usuarioData);
      cargarRutasActivas(); // SCRUM-85: Cargar rutas activas
    } else {
      console.log('⚠️ No se encontró usuario, redirigiendo...');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // SCRUM-85: Función para cargar rutas activas
  const cargarRutasActivas = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.obtenerRutasActivas();
      console.log('✅ Rutas activas obtenidas:', data);
      setRutasActivas(data);
      setError('');
    } catch (err) {
      console.error('❌ Error al cargar rutas activas:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>⏳ Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header del Dashboard */}
        <div style={{ marginBottom: '30px' }}>
          <h1>� Bienvenido, {usuario.nombre}</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Dashboard principal - {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
          </p>
        </div>

        {/* Error si existe */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* SCRUM-85: Sección de Rutas Activas */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '30px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ margin: 0 }}>�️ Rutas Activas</h2>
            <span style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              {rutasActivas.length} activas
            </span>
          </div>

          {rutasActivas.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No hay rutas activas en este momento
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Vehículo</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Carga</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Conductor</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Origen → Destino</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rutasActivas.map((ruta) => (
                    <tr key={ruta.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '600' }}>{ruta.vehiculo.patente}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {ruta.vehiculo.marca} {ruta.vehiculo.modelo}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div>{ruta.carga.descripcion}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {ruta.carga.peso.toLocaleString()} kg
                            {ruta.carga.prioridad === 'urgente' && ' �'}
                            {ruta.carga.prioridad === 'alta' && ' �'}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>{ruta.conductor.nombre}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontSize: '14px' }}>
                          � {ruta.origen} → � {ruta.destino}
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: ruta.estadoRuta === 'en_curso' ? '#d4edda' : '#fff3cd',
                          color: ruta.estadoRuta === 'en_curso' ? '#155724' : '#856404',
                        }}>
                          {ruta.estadoRuta === 'en_curso' ? 'En Curso' : 'Planificada'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Debug del token */}
        <TokenDebug />
      </div>
    </div>
  );
}

export default Main;
