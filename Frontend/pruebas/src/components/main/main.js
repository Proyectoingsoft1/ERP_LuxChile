import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import StatCard from "../Dashboard/StatCard";
import RutasTable from "../Dashboard/RutasTable";
import FiltrosRutas from "../Dashboard/FiltrosRutas"; // SCRUM-127
import { getUsuario, isAuthenticated, dashboardService } from '../../services';
import TokenDebug from "../Login/TokenDebug";

function Main() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rutasActivas, setRutasActivas] = useState([]);
  const [rutasFiltradas, setRutasFiltradas] = useState([]); // SCRUM-127
  const [estadisticas, setEstadisticas] = useState(null);
  const [error, setError] = useState('');
  
  // SCRUM-127: Estado de filtros
  const [filtros, setFiltros] = useState({
    estado: 'todas',
    prioridad: 'todas',
    busqueda: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    const usuarioData = getUsuario();
    if (usuarioData) {
      setUsuario(usuarioData);
      cargarDatosDashboard();
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // SCRUM-127: Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros();
  }, [filtros, rutasActivas]);

  const cargarDatosDashboard = async () => {
    try {
      setLoading(true);
      const [rutasData, estadisticasData] = await Promise.all([
        dashboardService.obtenerRutasActivas(),
        dashboardService.obtenerEstadisticas(),
      ]);
      
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

  // SCRUM-127: Funci√≥n para aplicar filtros
  const aplicarFiltros = () => {
    let rutasFiltradas = [...rutasActivas];

    // Filtrar por estado
    if (filtros.estado !== 'todas') {
      rutasFiltradas = rutasFiltradas.filter(
        ruta => ruta.estadoRuta === filtros.estado
      );
    }

    // Filtrar por prioridad
    if (filtros.prioridad !== 'todas') {
      rutasFiltradas = rutasFiltradas.filter(
        ruta => ruta.carga.prioridad === filtros.prioridad
      );
    }

    // Filtrar por b√∫squeda (veh√≠culo o conductor)
    if (filtros.busqueda.trim()) {
      const busquedaLower = filtros.busqueda.toLowerCase();
      rutasFiltradas = rutasFiltradas.filter(ruta =>
        ruta.vehiculo.patente.toLowerCase().includes(busquedaLower) ||
        ruta.vehiculo.marca.toLowerCase().includes(busquedaLower) ||
        ruta.vehiculo.modelo.toLowerCase().includes(busquedaLower) ||
        ruta.conductor.nombre.toLowerCase().includes(busquedaLower)
      );
    }

    setRutasFiltradas(rutasFiltradas);
  };

  // SCRUM-127: Handler para cambio de filtros
  const handleCambioFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleVerDetalle = (ruta) => {
    console.log('Ver detalle de ruta:', ruta);
    alert(`Detalle de ruta #${ruta.id}\nVeh√≠culo: ${ruta.vehiculo.patente}\nDestino: ${ruta.destino}`);
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
          <p style={{ color: '#666', fontSize: '18px' }}>Cargando dashboard...</p>
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
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#2c3e50' }}>
            Ì±ã Hola, {usuario.nombre}
          </h1>
          <p style={{ color: '#7f8c8d', fontSize: '16px', margin: 0 }}>
            Bienvenido al dashboard de {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
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

        {/* Grid de estad√≠sticas */}
        {estadisticas && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
          }}>
            <StatCard
              icon="Ì∫ö"
              title="Total Veh√≠culos"
              value={estadisticas.totales.vehiculos}
              subtitle={`${estadisticas.vehiculos.disponibles} disponibles ‚Ä¢ ${estadisticas.vehiculos.enRuta} en ruta`}
              color="#667eea"
            />
            
            <StatCard
              icon="Ì≥¶"
              title="Total Cargas"
              value={estadisticas.totales.cargas}
              subtitle={`${estadisticas.cargas.pendientes} pendientes ‚Ä¢ ${estadisticas.cargas.enTransito} en tr√°nsito`}
              color="#f39c12"
            />
            
            <StatCard
              icon="Ì∑∫Ô∏è"
              title="Rutas Activas"
              value={estadisticas.rutas.activas}
              subtitle={`${estadisticas.rutas.completadas} completadas`}
              color="#27ae60"
            />
            
            <StatCard
              icon="Ì±•"
              title="Total Usuarios"
              value={estadisticas.totales.usuarios}
              subtitle="Personal registrado en el sistema"
              color="#e74c3c"
            />
          </div>
        )}

        {/* Widget de Rutas Activas */}
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
            <h2 style={{ 
              margin: 0, 
              fontSize: '24px',
              color: '#2c3e50',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              Ì∑∫Ô∏è Rutas Activas
            </h2>
            <span style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '24px',
              fontSize: '15px',
              fontWeight: '700',
            }}>
              {rutasActivas.length} total
            </span>
          </div>

          {/* SCRUM-127: Filtros */}
          <FiltrosRutas
            filtros={filtros}
            onCambioFiltro={handleCambioFiltro}
            totalRutas={rutasFiltradas.length}
          />

          {/* Tabla con rutas filtradas */}
          <RutasTable 
            rutas={rutasFiltradas}
            onVerDetalle={handleVerDetalle}
          />
        </div>

        <TokenDebug />
      </div>
    </div>
  );
}

export default Main;
