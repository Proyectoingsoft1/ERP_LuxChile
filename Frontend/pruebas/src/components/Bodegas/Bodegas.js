import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import VehiculoCard from './VehiculoCard'; // SCRUM-87
import { isAuthenticated, vehiculosService } from '../../services';

function Bodegas() {
  const navigate = useNavigate();
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vistaActual, setVistaActual] = useState('grid'); // grid o tabla

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    cargarVehiculos();
  }, [navigate]);

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

  // SCRUM-87: Handlers para acciones
  const handleVerDetalle = (vehiculo) => {
    console.log('Ver detalle:', vehiculo);
    alert(`Detalle del vehículo\n\nPatente: ${vehiculo.patente}\nMarca: ${vehiculo.marca} ${vehiculo.modelo}\nCapacidad: ${vehiculo.capacidadCarga} kg\nEstado: ${vehiculo.estado}`);
  };

  const handleEditar = (vehiculo) => {
    console.log('Editar:', vehiculo);
    alert(`Función editar vehículo ${vehiculo.patente}\n(Próximamente)`);
  };

  const handleEliminar = async (vehiculo) => {
    if (!window.confirm(`¿Estás seguro de eliminar el vehículo ${vehiculo.patente}?`)) {
      return;
    }

    try {
      await vehiculosService.eliminar(vehiculo.id);
      alert('Vehículo eliminado correctamente');
      cargarVehiculos(); // Recargar lista
    } catch (err) {
      alert(`Error al eliminar: ${err}`);
    }
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#2c3e50' }}>
              ��� Gestión de Vehículos
            </h1>
            <p style={{ color: '#7f8c8d', fontSize: '16px', margin: 0 }}>
              Administra la flota de vehículos de la empresa
            </p>
          </div>

          {/* Botón agregar vehículo */}
          <button
            onClick={() => alert('Formulario agregar vehículo (Próximamente)')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            <span style={{ fontSize: '20px' }}>➕</span>
            Agregar Vehículo
          </button>
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

        {/* Contador y selector de vista */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '16px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: '15px', color: '#666' }}>
            ��� <strong style={{ color: '#2c3e50' }}>{vehiculos.length}</strong> {vehiculos.length === 1 ? 'vehículo registrado' : 'vehículos registrados'}
          </div>

          {/* Toggle vista (para futura implementación) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setVistaActual('grid')}
              style={{
                padding: '8px 16px',
                backgroundColor: vistaActual === 'grid' ? '#667eea' : '#e9ecef',
                color: vistaActual === 'grid' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ��� Cards
            </button>
            <button
              onClick={() => setVistaActual('tabla')}
              style={{
                padding: '8px 16px',
                backgroundColor: vistaActual === 'tabla' ? '#667eea' : '#e9ecef',
                color: vistaActual === 'tabla' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ��� Tabla
            </button>
          </div>
        </div>

        {/* SCRUM-87: Grid de vehículos con VehiculoCard */}
        {vehiculos.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '60px 20px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>���</div>
            <h3 style={{ color: '#666', fontWeight: '400', marginBottom: '10px' }}>
              No hay vehículos registrados
            </h3>
            <p style={{ fontSize: '14px', color: '#999' }}>
              Agrega el primer vehículo para comenzar
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
          }}>
            {vehiculos.map((vehiculo) => (
              <VehiculoCard
                key={vehiculo.id}
                vehiculo={vehiculo}
                onVerDetalle={handleVerDetalle}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bodegas;
