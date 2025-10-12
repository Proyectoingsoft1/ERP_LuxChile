import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import FiltrosVehiculos from './FiltrosVehiculos';
import { isAuthenticated, vehiculosService } from '../../services';

function Bodegas() {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // SCRUM-88: Estado para filtros
  const [filtros, setFiltros] = useState({
    estado: 'todos',
    busqueda: '',
    ordenar: 'reciente'
  });

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    cargarVehiculos();
  }, [navigate]);

  // SCRUM-86: Función para cargar vehículos
  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await vehiculosService.obtenerTodos();
      console.log('✅ Vehículos obtenidos:', data);

      setVehiculos(data);
    } catch (err) {
      console.error('❌ Error al cargar vehículos:', err);
      setError(err || 'Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  };

  // SCRUM-88: Función para cambiar filtros
  const handleCambioFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // SCRUM-88: Aplicar filtros y ordenamiento
  const vehiculosFiltrados = vehiculos
    .filter(vehiculo => {
      // Filtro por estado
      if (filtros.estado !== 'todos' && vehiculo.estado !== filtros.estado) {
        return false;
      }
      
      // Filtro por búsqueda (patente, marca o modelo)
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        return (
          vehiculo.patente.toLowerCase().includes(busqueda) ||
          vehiculo.marca.toLowerCase().includes(busqueda) ||
          vehiculo.modelo.toLowerCase().includes(busqueda)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Ordenamiento
      switch (filtros.ordenar) {
        case 'patente':
          return a.patente.localeCompare(b.patente);
        case 'capacidad':
          return b.capacidadCarga - a.capacidadCarga;
        case 'reciente':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

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
          <div style={{ fontSize: '48px' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '18px' }}>Cargando vehículos...</p>
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
            Gestión de Vehículos
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '16px', margin: 0 }}>
            Administra la flota de vehículos de la empresa
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
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* SCRUM-88: Componente de Filtros */}
        <FiltrosVehiculos 
          filtros={filtros}
          onCambioFiltro={handleCambioFiltro}
          totalVehiculos={vehiculosFiltrados.length}
        />

        {/* Contenedor principal */}
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
              Lista de Vehículos
            </h2>
            <span style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '24px',
              fontSize: '15px',
              fontWeight: '700',
            }}>
              {vehiculos.length} {vehiculos.length === 1 ? 'vehículo' : 'vehículos'}
            </span>
          </div>

          {/* Lista de vehículos filtrados */}
          {vehiculosFiltrados.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>���</div>
              <h3 style={{ color: '#666', fontWeight: '400' }}>
                {vehiculos.length === 0 
                  ? 'No hay vehículos registrados' 
                  : 'No se encontraron vehículos con estos filtros'}
              </h3>
              <p style={{ fontSize: '14px' }}>
                {vehiculos.length === 0 
                  ? 'Agrega el primer vehículo para comenzar'
                  : 'Intenta cambiar los filtros de búsqueda'}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '16px',
            }}>
              {vehiculosFiltrados.map((vehiculo) => (
                <div
                  key={vehiculo.id}
                  style={{
                    padding: '20px',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#667eea';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e9ecef';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
                      {vehiculo.patente}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {vehiculo.marca} {vehiculo.modelo}
                    </div>
                    <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                      Capacidad: {vehiculo.capacidadCarga.toLocaleString()} kg
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      backgroundColor: 
                        vehiculo.estado === 'disponible' ? '#d4edda' :
                        vehiculo.estado === 'en_ruta' ? '#fff3cd' :
                        vehiculo.estado === 'mantenimiento' ? '#f8d7da' : '#e9ecef',
                      color:
                        vehiculo.estado === 'disponible' ? '#155724' :
                        vehiculo.estado === 'en_ruta' ? '#856404' :
                        vehiculo.estado === 'mantenimiento' ? '#721c24' : '#495057',
                    }}>
                      {vehiculo.estado === 'disponible' ? '✅ Disponible' :
                       vehiculo.estado === 'en_ruta' ? '��� En Ruta' :
                       vehiculo.estado === 'mantenimiento' ? '��� Mantenimiento' :
                       vehiculo.estado}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bodegas;
