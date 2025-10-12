import BadgeEstado from './BadgeEstado';

function FiltrosVehiculos({ filtros, onCambioFiltro, totalVehiculos }) {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      marginBottom: '24px',
    }}>
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
      }}>
        {/* Filtro por Estado */}
        <div style={{ flex: '1 1 200px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#555',
          }}>
            Estado del Veh√≠culo
          </label>
          <select
            value={filtros.estado}
            onChange={(e) => onCambioFiltro('estado', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
          >
            <option value="todos">Ì≥ã Todos los estados</option>
            <option value="disponible">‚úÖ Disponible</option>
            <option value="en_ruta">Ì∫õ En Ruta</option>
            <option value="mantenimiento">Ì¥ß Mantenimiento</option>
          </select>
        </div>

        {/* B√∫squeda por patente/marca */}
        <div style={{ flex: '1 1 250px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#555',
          }}>
            Ì¥ç Buscar Veh√≠culo
          </label>
          <input
            type="text"
            placeholder="Patente, marca o modelo..."
            value={filtros.busqueda}
            onChange={(e) => onCambioFiltro('busqueda', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
          />
        </div>

        {/* Ordenar por */}
        <div style={{ flex: '1 1 200px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#555',
          }}>
            ‚¨áÔ∏è Ordenar por
          </label>
          <select
            value={filtros.ordenar}
            onChange={(e) => onCambioFiltro('ordenar', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '2px solid #dee2e6',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
          >
            <option value="reciente">Ìµê M√°s recientes</option>
            <option value="patente">Ì¥§ Patente (A-Z)</option>
            <option value="capacidad">‚öñÔ∏è Mayor capacidad</option>
          </select>
        </div>

        {/* Bot√≥n limpiar */}
        <div style={{ flex: '0 0 auto' }}>
          <button
            onClick={() => {
              onCambioFiltro('estado', 'todos');
              onCambioFiltro('busqueda', '');
              onCambioFiltro('ordenar', 'reciente');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              height: '42px',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
          >
            Ì∑ëÔ∏è Limpiar
          </button>
        </div>
      </div>

      {/* Contador de resultados con badges de estado */}
      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: '#666' }}>
            <strong style={{ color: '#2c3e50' }}>{totalVehiculos}</strong> {totalVehiculos === 1 ? 'veh√≠culo encontrado' : 'veh√≠culos encontrados'}
          </span>

          {/* SCRUM-90: Mostrar badge del filtro activo */}
          {filtros.estado !== 'todos' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#999' }}>Filtrando por:</span>
              <BadgeEstado estado={filtros.estado} size="small" />
            </div>
          )}
        </div>

        {(filtros.estado !== 'todos' || filtros.busqueda || filtros.ordenar !== 'reciente') && (
          <span style={{
            color: '#667eea',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>‚úì</span>
            Filtros activos
          </span>
        )}
      </div>
    </div>
  );
}

export default FiltrosVehiculos;
