export { default as authService } from './authService';
export { default as vehiculosService } from './vehiculosService';
export { default as cargasService } from './cargasService';
export { default as rutasService } from './rutasService';
export { default as dashboardService } from './dashboardService'; // ← NUEVO

export { getToken, setToken, removeToken, getUsuario, setUsuario, isAuthenticated } from '../config/api';
