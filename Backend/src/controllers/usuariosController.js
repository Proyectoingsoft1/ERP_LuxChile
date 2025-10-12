import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerUsuarios = async (req, res) => {
  try {
    const { rol, activo } = req.query;
    
    const where = {};
    if (rol) where.rol = rol;
    if (activo !== undefined) where.activo = activo === 'true';

    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
      },
      orderBy: { nombre: 'asc' },
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
