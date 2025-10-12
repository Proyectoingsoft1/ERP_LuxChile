function FiltrosRutas({ filtros, onCambioFiltro, totalRutas }) {
  return (
    <div style={{
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      flexWrap: 'wrap',
      alignItems: 'center',
    }}>
      {/* Filtro por Estado */}
      <div style={{ flex: '1 1 200px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#555',
        }}>
          Ì≥ä Estado de Ruta
        </label>
        <select
          value={filtros.estado}
          onChange={(e) => onCambioFiltro('estado', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
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
          <option value="todas">Todas las rutas</option>
          <option value="en_curso">Ì∫õ En Curso</option>
          <option value="planificada">Ì≥ã Planificadas</option>
        </select>
      </div>

      {/* Filtro por Prioridad */}
      <div style={{ flex: '1 1 200px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#555',
        }}>
          ÌæØ Prioridad
        </label>
        <select
          value={filtros.prioridad}
          onChange={(e) => onCambioFiltro('prioridad', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
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
          <option value="todas">Todas las prioridades</option>
          <option value="urgente">Ì¥¥ Urgente</option>
          <option value="alta">Ìø† Alta</option>
          <option value="media">Ì¥µ Media</option>
          <option value="baja">Ìø¢ Baja</option>
        </select>
      </div>

      {/* B√∫squeda */}
      <div style={{ flex: '1 1 250px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '6px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#555',
        }}>
          Ì¥ç Buscar
        </label>
        <input
          type="text"
          placeholder="Veh√≠culo o conductor..."
          value={filtros.busqueda}
          onChange={(e) => onCambioFiltro('busqueda', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
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

      {/* Bot√≥n limpiar filtros */}
      <div style={{ flex: '0 0 auto', alignSelf: 'flex-end' }}>
        <button
          onClick={() => {
            onCambioFiltro('estado', 'todas');
            onCambioFiltro('prioridad', 'todas');
            onCambioFiltro('busqueda', '');
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
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          Ì¥Ñ Limpiar
        </button>
      </div>

      {/* Contador de resultados */}
      <div style={{
        flex: '1 1 100%',
        marginTop: '10px',
        padding: '12px 16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>
          Ì≥ã <strong>{totalRutas}</strong> {totalRutas === 1 ? 'ruta encontrada' : 'rutas encontradas'}
        </span>
        {(filtros.estado !== 'todas' || filtros.prioridad !== 'todas' || filtros.busqueda) && (
          <span style={{ color: '#667eea', fontWeight: '600' }}>
            Filtros activos ‚úì
          </span>
        )}
      </div>
    </div>
  );
}

export default FiltrosRutas;
