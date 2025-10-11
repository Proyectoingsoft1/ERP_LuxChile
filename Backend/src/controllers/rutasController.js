import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerRutas = async (req, res) => {
  try {
    const { estadoRuta } = req.query;

    const where = estadoRuta ? { estadoRuta } : {};

    const rutas = await prisma.ruta.findMany({
      where,
      include: {
        vehiculo: { select: { id: true, patente: true, marca: true, modelo: true, estado: true } },
        carga: true,
        conductor: { select: { id: true, nombre: true, email: true } },
        incidentes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(rutas);
  } catch (error) {
    console.error('Error al obtener rutas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const obtenerRutaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const ruta = await prisma.ruta.findUnique({
      where: { id: parseInt(id) },
      include: {
        vehiculo: {
          include: {
            sensores: { orderBy: { timestamp: 'desc' }, take: 10 },
            camaras: true,
          },
        },
        carga: true,
        conductor: { select: { id: true, nombre: true, email: true, rol: true } },
        incidentes: {
          include: {
            reportante: { select: { nombre: true, email: true } },
          },
        },
      },
    });

    if (!ruta) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    res.json(ruta);
  } catch (error) {
    console.error('Error al obtener ruta:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const crearRuta = async (req, res) => {
  try {
    const { vehiculoId, cargaId, conductorId, origen, destino, distanciaKm, puntosIntermedio } = req.body;

    if (!vehiculoId || !cargaId || !conductorId || !origen || !destino) {
      return res.status(400).json({ 
        error: 'Campos requeridos: vehiculoId, cargaId, conductorId, origen, destino' 
      });
    }

    // Verificar que el vehículo existe y está disponible
    const vehiculo = await prisma.vehiculo.findUnique({
      where: { id: parseInt(vehiculoId) },
    });

    if (!vehiculo) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    if (vehiculo.estado === 'mantenimiento') {
      return res.status(400).json({ error: 'El vehículo está en mantenimiento' });
    }

    // Verificar que la carga existe y está pendiente o asignada
    const carga = await prisma.carga.findUnique({
      where: { id: parseInt(cargaId) },
    });

    if (!carga) {
      return res.status(404).json({ error: 'Carga no encontrada' });
    }

    if (!['pendiente', 'asignada'].includes(carga.estado)) {
      return res.status(400).json({ error: `La carga está en estado: ${carga.estado}` });
    }

    // Verificar capacidad del vehículo
    if (carga.peso > vehiculo.capacidadCarga) {
      return res.status(400).json({ 
        error: 'La carga excede la capacidad del vehículo',
        pesoRequerido: carga.peso,
        capacidadVehiculo: vehiculo.capacidadCarga,
      });
    }

    // Crear la ruta en una transacción
    const nuevaRuta = await prisma.$transaction(async (tx) => {
      // Crear ruta
      const ruta = await tx.ruta.create({
        data: {
          vehiculoId: parseInt(vehiculoId),
          cargaId: parseInt(cargaId),
          conductorId: parseInt(conductorId),
          origen,
          destino,
          distanciaKm: distanciaKm ? parseFloat(distanciaKm) : null,
          puntosIntermedio: puntosIntermedio ? JSON.stringify(puntosIntermedio) : null,
        },
        include: {
          vehiculo: { select: { patente: true, marca: true, modelo: true } },
          carga: true,
          conductor: { select: { nombre: true, email: true } },
        },
      });

      // Actualizar estado de la carga
      await tx.carga.update({
        where: { id: parseInt(cargaId) },
        data: { estado: 'asignada' },
      });

      // Actualizar estado del vehículo
      await tx.vehiculo.update({
        where: { id: parseInt(vehiculoId) },
        data: { estado: 'en_ruta' },
      });

      return ruta;
    });

    res.status(201).json(nuevaRuta);
  } catch (error) {
    console.error('Error al crear ruta:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const actualizarRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estadoRuta, distanciaKm, fechaInicio, fechaFin } = req.body;

    const rutaActualizada = await prisma.ruta.update({
      where: { id: parseInt(id) },
      data: {
        ...(estadoRuta && { estadoRuta }),
        ...(distanciaKm && { distanciaKm: parseFloat(distanciaKm) }),
        ...(fechaInicio && { fechaInicio: new Date(fechaInicio) }),
        ...(fechaFin && { fechaFin: new Date(fechaFin) }),
      },
      include: {
        vehiculo: true,
        carga: true,
        conductor: { select: { nombre: true, email: true } },
      },
    });

    // Si la ruta se completa, actualizar estados
    if (estadoRuta === 'completada') {
      await prisma.$transaction([
        prisma.carga.update({
          where: { id: rutaActualizada.cargaId },
          data: { estado: 'entregada' },
        }),
        prisma.vehiculo.update({
          where: { id: rutaActualizada.vehiculoId },
          data: { estado: 'disponible' },
        }),
      ]);
    }

    res.json(rutaActualizada);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    console.error('Error al actualizar ruta:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const eliminarRuta = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.ruta.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Ruta eliminada exitosamente' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    console.error('Error al eliminar ruta:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
