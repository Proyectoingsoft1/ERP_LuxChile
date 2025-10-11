import apiClient, { setToken, setUsuario, removeToken, removeUsuario } from '../config/api';

const authService = {
  /**
   * Iniciar sesión
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, usuario } = response.data;
      
      // Guardar token y usuario
      setToken(token);
      setUsuario(usuario);
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al iniciar sesión';
    }
  },

  /**
   * Registrar nuevo usuario
   */
  registro: async (userData) => {
    try {
      const response = await apiClient.post('/auth/registro', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al registrar usuario';
    }
  },

  /**
   * Obtener perfil del usuario
   */
  obtenerPerfil: async () => {
    try {
      const response = await apiClient.get('/auth/perfil');
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error al obtener perfil';
    }
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    removeToken();
    removeUsuario();
    window.location.href = '/';
  },
};

export default authService;
