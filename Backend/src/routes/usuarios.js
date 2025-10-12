import express from 'express';
import { obtenerUsuarios } from '../controllers/usuariosController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verificarToken, obtenerUsuarios);

export default router;
