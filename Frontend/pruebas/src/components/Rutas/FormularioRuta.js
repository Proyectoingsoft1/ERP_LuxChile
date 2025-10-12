import { useState, useEffect } from 'react';
import { vehiculosService, cargasService, usuariosService, rutasService } from '../../services';

function FormularioRuta({ isOpen, onClose, onRutaCreada }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingOpciones, setLoadingOpciones] = useState(true);

  // Opciones para los dropdowns
  const [vehiculos, setVehiculos] = useState([]);
  const [cargas, setCargas] = useState([]);
  const [conductores, setConductores] = useState([]);

  // Estado del formulario (simplificado, solo manual)
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    vehiculoId: '',
    cargaId: '',
    conductorId: '',
  });

  // Para mostrar información adicional
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [cargaSeleccionada, setCargaSeleccionada] = useState(null);

  useEffect(() => {
    if (isOpen) {
      cargarOpciones();
    }
  }, [isOpen]);

  const cargarOpciones = async () => {
    try {
      setLoadingOpciones(true);
      
      // Cargar vehículos disponibles
      const vehiculosData = await vehiculosService.obtenerTodos();
      const vehiculosDisponibles = vehiculosData.filter(v => v.estado === 'disponible');
      setVehiculos(vehiculosDisponibles);

      // Cargar cargas pendientes
      const cargasData = await cargasService.obtenerTodos({ estado: 'pendiente' });
      setCargas(cargasData);

      // Cargar conductores activos
      const conductoresData = await usuariosService.obtenerConductores();
      setConductores(conductoresData);

      console.log('✅ Opciones cargadas:', {
        vehiculos: vehiculosDisponibles.length,
        cargas: cargasData.length,
        conductores: conductoresData.length
      });
    } catch (err) {
      console.error('❌ Error al cargar opciones:', err);
      setError('Error al cargar las opciones del formulario');
    } finally {
      setLoadingOpciones(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si selecciona un vehículo, guardar info adicional
    if (name === 'vehiculoId') {
      const vehiculo = vehiculos.find(v => v.id === parseInt(value));
      setVehiculoSeleccionado(vehiculo);
    }

    // Si selecciona una carga, guardar info adicional
    if (name === 'cargaId') {
      const carga = cargas.find(c => c.id === parseInt(value));
      setCargaSeleccionada(carga);
    }
  };

  // SCRUM-94: Validar capacidad del vehículo
  const validarCapacidad = () => {
    if (!vehiculoSeleccionado || !cargaSeleccionada) {
      return { valido: true, mensaje: '' };
    }

    const capacidadVehiculo = vehiculoSeleccionado.capacidadCarga;
    const pesoCarga = cargaSeleccionada.peso;

    if (pesoCarga > capacidadVehiculo) {
      return {
        valido: false,
        mensaje: `⚠️ La carga (${pesoCarga} kg) excede la capacidad del vehículo (${capacidadVehiculo} kg)`
      };
    }

    const porcentajeUso = ((pesoCarga / capacidadVehiculo) * 100).toFixed(1);
    return {
      valido: true,
      mensaje: `✅ Capacidad OK (usando ${porcentajeUso}% del vehículo)`,
      porcentaje: porcentajeUso
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.origen || !formData.destino) {
      setError('Debes ingresar origen y destino');
      return;
    }

    if (!formData.vehiculoId || !formData.cargaId || !formData.conductorId) {
      setError('Debes seleccionar vehículo, carga y conductor');
      return;
    }

    // SCRUM-94: Validar capacidad
    const validacion = validarCapacidad();
    if (!validacion.valido) {
      setError(validacion.mensaje);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const dataToSend = {
        vehiculoId: parseInt(formData.vehiculoId),
        cargaId: parseInt(formData.cargaId),
        conductorId: parseInt(formData.conductorId),
        origen: formData.origen.trim(),
        destino: formData.destino.trim(),
      };

      console.log('📤 Creando ruta:', dataToSend);

      const nuevaRuta = await rutasService.crear(dataToSend);
      
      console.log('✅ Ruta creada:', nuevaRuta);

      // Limpiar formulario
      setFormData({
        origen: '',
        destino: '',
        vehiculoId: '',
        cargaId: '',
        conductorId: '',
      });
      setVehiculoSeleccionado(null);
      setCargaSeleccionada(null);

      // Notificar al componente padre
      onRutaCreada();
      
      // Cerrar modal
      onClose();

    } catch (err) {
      console.error('❌ Error al crear ruta:', err);
      setError(err || 'Error al crear la ruta');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const validacion = validarCapacidad();

  return (
    // Overlay del modal
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto',
    }}>
      {/* Modal */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>
            🗺️ Crear Nueva Ruta
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#999',
            }}
          >
            ×
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          {loadingOpciones ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
              <p>Cargando opciones...</p>
            </div>
          ) : (
            <>
              {/* Origen */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  📍 Origen <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="origen"
                  value={formData.origen}
                  onChange={handleChange}
                  placeholder="Ej: Av. Libertador Bernardo O'Higgins 1234, Santiago"
                  required
                  style={inputStyle}
                  disabled={loading}
                />
                <small style={{ color: '#999', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Ingresa la dirección completa de origen
                </small>
              </div>

              {/* Destino */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  🎯 Destino <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="destino"
                  value={formData.destino}
                  onChange={handleChange}
                  placeholder="Ej: Av. Providencia 2000, Providencia"
                  required
                  style={inputStyle}
                  disabled={loading}
                />
                <small style={{ color: '#999', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Ingresa la dirección completa de destino
                </small>
              </div>

              {/* Selección de Vehículo */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  🚛 Vehículo <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <select
                  name="vehiculoId"
                  value={formData.vehiculoId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  disabled={loading || vehiculos.length === 0}
                >
                  <option value="">-- Selecciona un vehículo --</option>
                  {vehiculos.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.patente} - {v.marca} {v.modelo} (Cap: {v.capacidadCarga} kg)
                    </option>
                  ))}
                </select>
                {vehiculos.length === 0 && (
                  <small style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    No hay vehículos disponibles
                  </small>
                )}
              </div>

              {/* Selección de Carga */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  📦 Carga <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <select
                  name="cargaId"
                  value={formData.cargaId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  disabled={loading || cargas.length === 0}
                >
                  <option value="">-- Selecciona una carga --</option>
                  {cargas.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.descripcion} ({c.peso} kg - {c.tipo})
                    </option>
                  ))}
                </select>
                {cargas.length === 0 && (
                  <small style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    No hay cargas pendientes
                  </small>
                )}
              </div>

              {/* SCRUM-94: Validación de capacidad */}
              {vehiculoSeleccionado && cargaSeleccionada && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  backgroundColor: validacion.valido ? '#d4edda' : '#f8d7da',
                  color: validacion.valido ? '#155724' : '#721c24',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  {validacion.mensaje}
                </div>
              )}

              {/* Selección de Conductor */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>
                  👤 Conductor <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <select
                  name="conductorId"
                  value={formData.conductorId}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  disabled={loading || conductores.length === 0}
                >
                  <option value="">-- Selecciona un conductor --</option>
                  {conductores.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.email})
                    </option>
                  ))}
                </select>
                {conductores.length === 0 && (
                  <small style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    No hay conductores disponibles
                  </small>
                )}
              </div>

              {/* Botones */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '32px',
              }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: '#e9ecef',
                    color: '#495057',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={loading || !validacion.valido}
                  style={{
                    flex: 1,
                    padding: '12px 32px',
                    backgroundColor: loading || !validacion.valido ? '#999' : '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading || !validacion.valido ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? '⏳ Creando...' : '✅ Crear Ruta'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '2px solid #dee2e6',
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: 'white',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

export default FormularioRuta;