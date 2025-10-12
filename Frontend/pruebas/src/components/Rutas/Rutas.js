import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { isAuthenticated, rutasService } from '../../services';

function Rutas() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  
  // Estados para rutas del backend
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  
  // Estados para Google Maps
  const [map, setMap] = useState(null);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    // Verificar autenticaci√≥n
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    cargarRutas();
    inicializarMapa();
  }, [navigate]);

  // SCRUM-91: Cargar rutas desde el backend
  const cargarRutas = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await rutasService.obtenerTodos();
      console.log('‚úÖ Rutas obtenidas:', data);

      setRutas(data);
    } catch (err) {
      console.error('‚ùå Error al cargar rutas:', err);
      setError(err || 'Error al cargar rutas');
    } finally {
      setLoading(false);
    }
  };

  // SCRUM-95: Inicializar Google Maps
  const inicializarMapa = () => {
    if (!window.google || map) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const actual = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUbicacionActual(actual);

        const newMap = new window.google.maps.Map(mapRef.current, {
          center: actual,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        const renderer = new window.google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: false,
        });

        setMap(newMap);
        setDirectionsRenderer(renderer);

        // Marcador de ubicaci√≥n actual
        new window.google.maps.Marker({
          position: actual,
          map: newMap,
          title: 'Mi Ubicaci√≥n',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          },
        });
      },
      (error) => {
        console.error('Error obteniendo ubicaci√≥n:', error);
        // Si falla, usar Santiago como centro por defecto
        const santiago = { lat: -33.4489, lng: -70.6693 };
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: santiago,
          zoom: 13,
        });
        const renderer = new window.google.maps.DirectionsRenderer();
        renderer.setMap(newMap);
        setMap(newMap);
        setDirectionsRenderer(renderer);
      }
    );
  };

  // SCRUM-92 + 95: Mostrar ruta en el mapa al hacer click
  const handleVerRutaEnMapa = async (ruta) => {
    if (!map || !directionsRenderer) return;

    setRutaSeleccionada(ruta);

    const directionsService = new window.google.maps.DirectionsService();

    // Usar las direcciones de origen y destino de la ruta
    directionsService.route(
      {
        origin: ruta.origen,
        destination: ruta.destino,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          
          // Hacer scroll al mapa
          mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.error('Error al calcular ruta:', status);
          alert('No se pudo calcular la ruta en el mapa');
        }
      }
    );
  };

  const limpiarMapa = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }
    setRutaSeleccionada(null);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{ fontSize: '48px' }}>‚è≥</div>
          <p style={{ color: '#666', fontSize: '18px' }}>Cargando rutas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#2c3e50' }}>
            Ì∑∫Ô∏è Gesti√≥n de Rutas
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '16px', margin: 0 }}>
            Administra las rutas de transporte y entregas
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>‚ö†Ô∏è</span>
            <span>{error}</span>
          </div>
        )}

        {/* SCRUM-95: Mapa de Google */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
              Ì∑∫Ô∏è Mapa de Rutas
            </h2>
            {rutaSeleccionada && (
              <button
                onClick={limpiarMapa}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Ì∑ëÔ∏è Limpiar Mapa
              </button>
            )}
          </div>

          {rutaSeleccionada && (
            <div style={{
              padding: '12px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              color: '#1565c0',
            }}>
              Ì≥ç Mostrando ruta: <strong>{rutaSeleccionada.origen}</strong> ‚Üí <strong>{rutaSeleccionada.destino}</strong>
            </div>
          )}

          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: '450px',
              borderRadius: '12px',
              border: '2px solid #e9ecef',
            }}
          />
        </div>

        {/* SCRUM-91 + 92: Lista de rutas */}
        <div style={{
          backgroundColor: 'white',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #f0f0f0',
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>
              Lista de Rutas
            </h2>
            <span style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '24px',
              fontSize: '15px',
              fontWeight: '700',
            }}>
              {rutas.length} {rutas.length === 1 ? 'ruta' : 'rutas'}
            </span>
          </div>

          {rutas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>Ì∑∫Ô∏è</div>
              <h3 style={{ color: '#666', fontWeight: '400' }}>No hay rutas registradas</h3>
              <p style={{ fontSize: '14px' }}>Crea la primera ruta para comenzar</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {rutas.map((ruta) => (
                <div
                  key={ruta.id}
                  style={{
                    padding: '20px',
                    border: rutaSeleccionada?.id === ruta.id ? '2px solid #667eea' : '2px solid #e9ecef',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    backgroundColor: rutaSeleccionada?.id === ruta.id ? '#f8f9ff' : 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleVerRutaEnMapa(ruta)}
                  onMouseEnter={(e) => {
                    if (rutaSeleccionada?.id !== ruta.id) {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (rutaSeleccionada?.id !== ruta.id) {
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr',
                    gap: '20px',
                    alignItems: 'center',
                  }}>
                    {/* Origen ‚Üí Destino */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        Ruta
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                        Ì≥ç {ruta.origen}
                      </div>
                      <div style={{ fontSize: '14px', color: '#7f8c8d', margin: '4px 0' }}>
                        ‚Üì
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                        ÌæØ {ruta.destino}
                      </div>
                      {ruta.distanciaKm && (
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          Ì≥è {ruta.distanciaKm} km
                        </div>
                      )}
                    </div>

                    {/* Veh√≠culo */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        Veh√≠culo
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#667eea' }}>
                        Ì∫õ {ruta.vehiculo.patente}
                      </div>
                      <div style={{ fontSize: '13px', color: '#7f8c8d' }}>
                        {ruta.vehiculo.marca} {ruta.vehiculo.modelo}
                      </div>
                    </div>

                    {/* Carga */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        Carga
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                        Ì≥¶ {ruta.carga.descripcion}
                      </div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        ‚öñÔ∏è {ruta.carga.peso} kg
                      </div>
                    </div>

                    {/* Estado */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        backgroundColor: 
                          ruta.estadoRuta === 'planificada' ? '#e3f2fd' :
                          ruta.estadoRuta === 'en_curso' ? '#fff3cd' :
                          ruta.estadoRuta === 'completada' ? '#d4edda' :
                          ruta.estadoRuta === 'cancelada' ? '#f8d7da' : '#e9ecef',
                        color:
                          ruta.estadoRuta === 'planificada' ? '#1565c0' :
                          ruta.estadoRuta === 'en_curso' ? '#856404' :
                          ruta.estadoRuta === 'completada' ? '#155724' :
                          ruta.estadoRuta === 'cancelada' ? '#721c24' : '#495057',
                      }}>
                        {ruta.estadoRuta === 'planificada' ? 'Ì≥ã Planificada' :
                         ruta.estadoRuta === 'en_curso' ? 'Ì∫õ En Curso' :
                         ruta.estadoRuta === 'completada' ? '‚úÖ Completada' :
                         ruta.estadoRuta === 'cancelada' ? '‚ùå Cancelada' :
                         ruta.estadoRuta}
                      </div>
                    </div>
                  </div>

                  {/* Conductor */}
                  {ruta.conductor && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #f0f0f0',
                      fontSize: '13px',
                      color: '#7f8c8d',
                    }}>
                      Ì±§ Conductor: <strong style={{ color: '#2c3e50' }}>{ruta.conductor.nombre}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Rutas;
