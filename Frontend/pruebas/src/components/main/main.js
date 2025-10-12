import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import { getUsuario, isAuthenticated, dashboardService } from '../../services';
import TokenDebug from "../Login/TokenDebug";

function Main() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rutasActivas, setRutasActivas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null); // SCRUM-125
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    const usuarioData = getUsuario();
    if (usuarioData) {
      setUsuario(usuarioData);
      cargarDatosDashboard(); // SCRUM-125: Cargar todo
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // SCRUM-125: Cargar rutas activas y estad√≠sticas
  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      
      // Cargar ambos en paralelo
      const [rutasData, estadisticasData] = await Promise.all([
        dashboardService.obtenerRutasActivas(),
        dashboardService.obtenerEstadisticas(),
      ]);
      
      console.log('‚úÖ Datos del dashboard obtenidos');
      setRutasActivas(rutasData);
      setEstadisticas(estadisticasData);
      setError('');
    } catch (err) {
      console.error('‚ùå Error al cargar dashboard:', err);
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
          <p>‚è≥ Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>Ìæâ Bienvenido, {usuario.nombre}</h1>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
            Dashboard principal - {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}>
            ‚ö†Ô∏è {error}
          </div>
        )}

        {/* SCRUM-125: Tarjetas de Estad√≠sticas */}
        {estadisticas && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            {/* Tarjeta: Total Veh√≠culos */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #667eea',
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                Ì∫ö Total Veh√≠culos
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
                {estadisticas.totales.vehiculos}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ‚úÖ {estadisticas.vehiculos.disponibles} disponibles ‚Ä¢ 
                Ì∫õ {estadisticas.vehiculos.enRuta} en ruta
              </div>
            </div>

            {/* Tarjeta: Total Cargas */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #f39c12',
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                Ì≥¶ Total Cargas
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
                {estadisticas.totales.cargas}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ‚è≥ {estadisticas.cargas.pendientes} pendientes ‚Ä¢ 
                Ì∫ö {estadisticas.cargas.enTransito} en tr√°nsito
              </div>
            </div>

            {/* Tarjeta: Rutas Activas */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #27ae60',
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                Ì∑∫Ô∏è Rutas Activas
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
                {estadisticas.rutas.activas}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ‚úÖ {estadisticas.rutas.completadas} completadas
              </div>
            </div>

            {/* Tarjeta: Usuarios/Trabajadores */}
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderLeft: '4px solid #e74c3c',
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                Ì±• Total Usuarios
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#333', marginBottom: '10px' }}>
                {estadisticas.totales.usuarios}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Personal registrado en el sistema
              </div>
            </div>
          </div>
        )}

        {/* Secci√≥n de Rutas Activas */}
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ margin: 0 }}>Ì∑∫Ô∏è Rutas Activas</h2>
            <span style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              {rutasActivas.length} activas
            </span>
          </div>

          {rutasActivas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>Ì∫õ</div>
              <p>No hay rutas activas en este momento</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Veh√≠culo</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Carga</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Conductor</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Origen ‚Üí Destino</th>
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
                            {ruta.carga.prioridad === 'urgente' && ' Ì¥¥'}
                            {ruta.carga.prioridad === 'alta' && ' Ìø†'}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>{ruta.conductor.nombre}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontSize: '14px' }}>
                          Ì≥ç {ruta.origen} ‚Üí Ì≥ç {ruta.destino}
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

        <TokenDebug />
      </div>
    </div>
  );
}

export default Main;
