import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('��� Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.incidente.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.camara.deleteMany();
  await prisma.ruta.deleteMany();
  await prisma.carga.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('✅ Base de datos limpiada');

  // Hash de contraseña común para todos (password123)
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Crear usuarios
  const usuarios = await prisma.usuario.createMany({
    data: [
      // Logística
      { email: 'juan.perez@luxchile.com', password: hashedPassword, nombre: 'Juan Pérez', rol: 'logistica' },
      { email: 'maria.gonzalez@luxchile.com', password: hashedPassword, nombre: 'María González', rol: 'logistica' },
      { email: 'carlos.rojas@luxchile.com', password: hashedPassword, nombre: 'Carlos Rojas', rol: 'logistica' },
      // RRHH
      { email: 'ana.martinez@luxchile.com', password: hashedPassword, nombre: 'Ana Martínez', rol: 'rrhh' },
      { email: 'pedro.silva@luxchile.com', password: hashedPassword, nombre: 'Pedro Silva', rol: 'rrhh' },
      // Seguridad
      { email: 'diego.morales@luxchile.com', password: hashedPassword, nombre: 'Diego Morales', rol: 'seguridad' },
      { email: 'laura.fernandez@luxchile.com', password: hashedPassword, nombre: 'Laura Fernández', rol: 'seguridad' },
    ],
  });

  console.log(`✅ ${usuarios.count} usuarios creados`);

  // Obtener usuarios para las relaciones
  const usuariosCreados = await prisma.usuario.findMany();
  const conductor1 = usuariosCreados.find(u => u.email === 'juan.perez@luxchile.com');
  const conductor2 = usuariosCreados.find(u => u.email === 'carlos.rojas@luxchile.com');
  const seguridad1 = usuariosCreados.find(u => u.email === 'diego.morales@luxchile.com');

  // Crear vehículos
  const vehiculo1 = await prisma.vehiculo.create({
    data: {
      patente: 'ABCD12',
      marca: 'Mercedes-Benz',
      modelo: 'Actros 2651',
      capacidadCarga: 25000,
      estado: 'disponible',
      ubicacionActualLat: -33.4489,
      ubicacionActualLng: -70.6693,
    },
  });

  const vehiculo2 = await prisma.vehiculo.create({
    data: {
      patente: 'EFGH34',
      marca: 'Volvo',
      modelo: 'FH16',
      capacidadCarga: 30000,
      estado: 'en_ruta',
      ubicacionActualLat: -33.0361,
      ubicacionActualLng: -71.6270,
    },
  });

  const vehiculo3 = await prisma.vehiculo.create({
    data: {
      patente: 'IJKL56',
      marca: 'Scania',
      modelo: 'R450',
      capacidadCarga: 20000,
      estado: 'mantenimiento',
      ubicacionActualLat: -33.4489,
      ubicacionActualLng: -70.6693,
    },
  });

  console.log('✅ 3 vehículos creados');

  // Crear cargas
  const carga1 = await prisma.carga.create({
    data: {
      descripcion: 'Alimentos refrigerados',
      peso: 15000,
      tipo: 'refrigerada',
      prioridad: 'alta',
      estado: 'en_transito',
      origen: 'Santiago Centro',
      destino: 'Valparaíso',
    },
  });

  const carga2 = await prisma.carga.create({
    data: {
      descripcion: 'Equipos electrónicos',
      peso: 8000,
      tipo: 'fragil',
      prioridad: 'urgente',
      estado: 'pendiente',
      origen: 'Pudahuel',
      destino: 'Viña del Mar',
    },
  });

  const carga3 = await prisma.carga.create({
    data: {
      descripcion: 'Material de construcción',
      peso: 22000,
      tipo: 'normal',
      prioridad: 'media',
      estado: 'asignada',
      origen: 'Quilicura',
      destino: 'Rancagua',
    },
  });

  console.log('✅ 3 cargas creadas');

  // Crear rutas
  const ruta1 = await prisma.ruta.create({
    data: {
      vehiculoId: vehiculo2.id,
      cargaId: carga1.id,
      conductorId: conductor1.id,
      origen: 'Santiago Centro',
      destino: 'Valparaíso',
      distanciaKm: 120,
      estadoRuta: 'en_curso',
      fechaInicio: new Date(),
      puntosIntermedio: JSON.stringify([
        { lat: -33.4489, lng: -70.6693 },
        { lat: -33.0361, lng: -71.6270 },
      ]),
    },
  });

  const ruta2 = await prisma.ruta.create({
    data: {
      vehiculoId: vehiculo1.id,
      cargaId: carga3.id,
      conductorId: conductor2.id,
      origen: 'Quilicura',
      destino: 'Rancagua',
      distanciaKm: 87,
      estadoRuta: 'planificada',
      puntosIntermedio: JSON.stringify([
        { lat: -33.3618, lng: -70.7262 },
        { lat: -34.1705, lng: -70.7407 },
      ]),
    },
  });

  console.log('✅ 2 rutas creadas');

  // Crear sensores para vehículos
  await prisma.sensor.createMany({
    data: [
      { vehiculoId: vehiculo2.id, tipo: 'temperatura', valor: -18.5, unidad: '°C', estado: 'normal' },
      { vehiculoId: vehiculo2.id, tipo: 'humedad', valor: 65, unidad: '%', estado: 'normal' },
      { vehiculoId: vehiculo1.id, tipo: 'temperatura', valor: 22, unidad: '°C', estado: 'normal' },
      { vehiculoId: vehiculo1.id, tipo: 'vibracion', valor: 2.3, unidad: 'g', estado: 'alerta' },
    ],
  });

  console.log('✅ Sensores creados');

  // Crear cámaras
  await prisma.camara.createMany({
    data: [
      { vehiculoId: vehiculo1.id, ubicacion: 'frontal', estado: 'activa', urlStream: 'https://stream.example.com/cam1' },
      { vehiculoId: vehiculo1.id, ubicacion: 'interior', estado: 'activa', urlStream: 'https://stream.example.com/cam2' },
      { vehiculoId: vehiculo2.id, ubicacion: 'frontal', estado: 'activa', urlStream: 'https://stream.example.com/cam3' },
      { vehiculoId: vehiculo2.id, ubicacion: 'trasera', estado: 'activa', urlStream: 'https://stream.example.com/cam4' },
    ],
  });

  console.log('✅ Cámaras creadas');

  // Crear un incidente
  await prisma.incidente.create({
    data: {
      rutaId: ruta1.id,
      reportadoPor: seguridad1.id,
      tipo: 'retraso',
      descripcion: 'Tráfico intenso en ruta 68',
      gravedad: 'media',
      resuelto: false,
    },
  });

  console.log('✅ Incidente de ejemplo creado');

  console.log('\n��� ¡Seed completado exitosamente!');
  console.log('\n��� Resumen:');
  console.log('   - 7 usuarios (3 logística, 2 RRHH, 2 seguridad)');
  console.log('   - 3 vehículos');
  console.log('   - 3 cargas');
  console.log('   - 2 rutas');
  console.log('   - 4 sensores');
  console.log('   - 4 cámaras');
  console.log('   - 1 incidente\n');
  console.log('��� Credenciales de prueba:');
  console.log('   Email: juan.perez@luxchile.com');
  console.log('   Password: password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
