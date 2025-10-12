import apiClient from '../config/api';

const usuariosService = {
  /**
   * Obtener todos los usuarios
   * @param {string} rol - Filtro opcional por rol
   * @param {boolean} activo - Filtro opcional por estado activo
   */
  obtenerTodos: async (rol = null, activo = null) => {
    try {
      const params = {};
      if (rol) params.rol = rol;
      if (activo !== null) params.activo = activo;
      
      const response = await apiClient.get('/usuarios', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener usuarios';
    }
  },

  /**
   * Obtener solo conductores (usuarios activos)
   */
  obtenerConductores: async () => {
    try {
      const response = await apiClient.get('/usuarios', {
        params: { activo: true }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener conductores';
    }
  },
};

export default usuariosService;
