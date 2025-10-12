function VehiculoCard({ vehiculo, onVerDetalle, onEditar, onEliminar }) {
  const getEstadoColor = (estado) => {
    const colores = {
      disponible: { bg: '#d4edda', color: '#155724', icon: '‚úÖ' },
      en_ruta: { bg: '#fff3cd', color: '#856404', icon: 'Ì∫õ' },
      mantenimiento: { bg: '#f8d7da', color: '#721c24', icon: 'Ì¥ß' },
    };
    return colores[estado] || colores.disponible;
  };

  const estadoStyle = getEstadoColor(vehiculo.estado);

  return (
    <div style={{
      backgroundColor: 'white',
      border: '2px solid #e9ecef',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      e.currentTarget.style.borderColor = '#667eea';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = '#e9ecef';
    }}
    >
      {/* Barra superior con estado */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: estadoStyle.bg,
      }} />

      {/* Header del card */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '8px',
          }}>
            {vehiculo.patente}
          </div>
          <div style={{
            fontSize: '16px',
            color: '#7f8c8d',
            fontWeight: '500',
          }}>
            {vehiculo.marca} {vehiculo.modelo}
          </div>
        </div>

        {/* Badge de estado */}
        <div style={{
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          backgroundColor: estadoStyle.bg,
          color: estadoStyle.color,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>{estadoStyle.icon}</span>
          <span style={{ textTransform: 'capitalize' }}>
            {vehiculo.estado.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Informaci√≥n del veh√≠culo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
            Capacidad de carga
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2c3e50' }}>
            ‚öñÔ∏è {vehiculo.capacidadCarga.toLocaleString()} kg
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>
            Ubicaci√≥n actual
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
            {vehiculo.ubicacionActualLat && vehiculo.ubicacionActualLng ? (
              <span>Ì≥ç Rastreando</span>
            ) : (
              <span style={{ color: '#95a5a6' }}>Ì≥ç Sin ubicaci√≥n</span>
            )}
          </div>
        </div>
      </div>

      {/* Informaci√≥n adicional */}
      {vehiculo.sensores && vehiculo.sensores.length > 0 && (
        <div style={{
          padding: '12px',
          backgroundColor: '#e8f4fd',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#004085',
        }}>
          Ì¥ç {vehiculo.sensores.length} sensores activos
        </div>
      )}

      {vehiculo.rutas && vehiculo.rutas.length > 0 && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '13px',
          color: '#856404',
        }}>
          Ì≥ã {vehiculo.rutas.length} {vehiculo.rutas.length === 1 ? 'ruta asignada' : 'rutas asignadas'}
        </div>
      )}

      {/* Acciones */}
      <div style={{
        display: 'flex',
        gap: '10px',
        paddingTop: '16px',
        borderTop: '1px solid #e9ecef',
      }}>
        <button
          onClick={() => onVerDetalle(vehiculo)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
        >
          Ì±ÅÔ∏è Ver detalle
        </button>

        <button
          onClick={() => onEditar(vehiculo)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e22'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
        >
          ‚úèÔ∏è
        </button>

        <button
          onClick={() => onEliminar(vehiculo)}
          style={{
            padding: '10px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          Ì∑ëÔ∏è
        </button>
      </div>
    </div>
  );
}

export default VehiculoCard;
