<?php

// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Vehiculo;
use App\Models\Carga;
use App\Models\Ruta;
use App\Models\Sensor;
use App\Models\Camara;
use App\Models\SeguimientoGps;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // 1. Crear Roles
        $roleLogistica = Role::create([
            'nombre' => 'Logística',
            'descripcion' => 'Personal del área de logística'
        ]);

        $roleRRHH = Role::create([
            'nombre' => 'Recursos Humanos',
            'descripcion' => 'Personal de recursos humanos'
        ]);

        $roleSeguridad = Role::create([
            'nombre' => 'Seguridad',
            'descripcion' => 'Personal de seguridad'
        ]);

        // 2. Crear Usuarios
        $adminLogistica = User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan.perez@empresa.com',
            'password' => Hash::make('password123'),
            'role_id' => $roleLogistica->id,
            'telefono' => '+56912345678',
            'departamento' => 'logistica',
            'activo' => true
        ]);

        $coordinadorLogistica = User::create([
            'name' => 'María González',
            'email' => 'maria.gonzalez@empresa.com',
            'password' => Hash::make('password123'),
            'role_id' => $roleLogistica->id,
            'telefono' => '+56987654321',
            'departamento' => 'logistica',
            'activo' => true
        ]);

        $conductorUno = User::create([
            'name' => 'Carlos Ramírez',
            'email' => 'carlos.ramirez@empresa.com',
            'password' => Hash::make('password123'),
            'role_id' => $roleLogistica->id,
            'telefono' => '+56923456789',
            'departamento' => 'logistica',
            'activo' => true
        ]);

        $conductorDos = User::create([
            'name' => 'Pedro Silva',
            'email' => 'pedro.silva@empresa.com',
            'password' => Hash::make('password123'),
            'role_id' => $roleLogistica->id,
            'telefono' => '+56934567890',
            'departamento' => 'logistica',
            'activo' => true
        ]);

        $seguridad = User::create([
            'name' => 'Ana Torres',
            'email' => 'ana.torres@empresa.com',
            'password' => Hash::make('password123'),
            'role_id' => $roleSeguridad->id,
            'telefono' => '+56945678901',
            'departamento' => 'seguridad',
            'activo' => true
        ]);

        $rrhh = User::create([
            'name' => 'Roberto Muñoz',
            'email' => 'roberto.munoz@empresa.com',
            'password' => Hash::make('password123'),
            'role_id' => $roleRRHH->id,
            'telefono' => '+56956789012',
            'departamento' => 'rrhh',
            'activo' => true
        ]);

        // 3. Crear Vehículos
        $vehiculoUno = Vehiculo::create([
            'patente' => 'ABCD12',
            'marca' => 'Mercedes-Benz',
            'modelo' => 'Actros 2042',
            'anio' => 2020,
            'capacidad_carga_kg' => 15000.00,
            'capacidad_volumen_m3' => 45.00,
            'estado' => 'disponible',
            'observaciones' => 'Vehículo en óptimas condiciones'
        ]);

        $vehiculoDos = Vehiculo::create([
            'patente' => 'EFGH34',
            'marca' => 'Volvo',
            'modelo' => 'FH 460',
            'anio' => 2021,
            'capacidad_carga_kg' => 18000.00,
            'capacidad_volumen_m3' => 50.00,
            'estado' => 'disponible',
            'observaciones' => 'Mantenimiento al día'
        ]);

        $vehiculoTres = Vehiculo::create([
            'patente' => 'IJKL56',
            'marca' => 'Scania',
            'modelo' => 'R 450',
            'anio' => 2019,
            'capacidad_carga_kg' => 12000.00,
            'capacidad_volumen_m3' => 40.00,
            'estado' => 'en_ruta',
            'observaciones' => 'Actualmente en ruta hacia Valparaíso'
        ]);

        $vehiculoCuatro = Vehiculo::create([
            'patente' => 'MNOP78',
            'marca' => 'Freightliner',
            'modelo' => 'Cascadia',
            'anio' => 2022,
            'capacidad_carga_kg' => 20000.00,
            'capacidad_volumen_m3' => 55.00,
            'estado' => 'disponible',
            'observaciones' => 'Vehículo nuevo'
        ]);

        // 4. Crear Sensores para los vehículos
        $sensores = [
            // Vehículo 1
            ['vehiculo_id' => $vehiculoUno->id, 'tipo_sensor' => 'temperatura', 'ubicacion' => 'interior_carga', 'activo' => true],
            ['vehiculo_id' => $vehiculoUno->id, 'tipo_sensor' => 'humedad', 'ubicacion' => 'interior_carga', 'activo' => true],
            ['vehiculo_id' => $vehiculoUno->id, 'tipo_sensor' => 'gps', 'ubicacion' => 'cabina', 'activo' => true],
            ['vehiculo_id' => $vehiculoUno->id, 'tipo_sensor' => 'presion', 'ubicacion' => 'ruedas', 'activo' => true],
            
            // Vehículo 2
            ['vehiculo_id' => $vehiculoDos->id, 'tipo_sensor' => 'temperatura', 'ubicacion' => 'interior_carga', 'activo' => true],
            ['vehiculo_id' => $vehiculoDos->id, 'tipo_sensor' => 'gps', 'ubicacion' => 'cabina', 'activo' => true],
            ['vehiculo_id' => $vehiculoDos->id, 'tipo_sensor' => 'acelerometro', 'ubicacion' => 'chasis', 'activo' => true],
            
            // Vehículo 3
            ['vehiculo_id' => $vehiculoTres->id, 'tipo_sensor' => 'temperatura', 'ubicacion' => 'interior_carga', 'activo' => true],
            ['vehiculo_id' => $vehiculoTres->id, 'tipo_sensor' => 'gps', 'ubicacion' => 'cabina', 'activo' => true],
            ['vehiculo_id' => $vehiculoTres->id, 'tipo_sensor' => 'humedad', 'ubicacion' => 'interior_carga', 'activo' => true],
            
            // Vehículo 4
            ['vehiculo_id' => $vehiculoCuatro->id, 'tipo_sensor' => 'temperatura', 'ubicacion' => 'interior_carga', 'activo' => true],
            ['vehiculo_id' => $vehiculoCuatro->id, 'tipo_sensor' => 'gps', 'ubicacion' => 'cabina', 'activo' => true],
        ];

        foreach ($sensores as $sensor) {
            Sensor::create($sensor);
        }

        // 5. Crear Cámaras para los vehículos
        $camaras = [
            ['vehiculo_id' => $vehiculoUno->id, 'nombre' => 'Cámara Frontal', 'ubicacion' => 'frontal', 'url_stream' => 'https://stream.ejemplo.com/cam1', 'activa' => true],
            ['vehiculo_id' => $vehiculoUno->id, 'nombre' => 'Cámara Carga', 'ubicacion' => 'interior_carga', 'url_stream' => 'https://stream.ejemplo.com/cam2', 'activa' => true],
            
            ['vehiculo_id' => $vehiculoDos->id, 'nombre' => 'Cámara Frontal', 'ubicacion' => 'frontal', 'url_stream' => 'https://stream.ejemplo.com/cam3', 'activa' => true],
            ['vehiculo_id' => $vehiculoDos->id, 'nombre' => 'Cámara Trasera', 'ubicacion' => 'trasera', 'url_stream' => 'https://stream.ejemplo.com/cam4', 'activa' => true],
            
            ['vehiculo_id' => $vehiculoTres->id, 'nombre' => 'Cámara Frontal', 'ubicacion' => 'frontal', 'url_stream' => 'https://stream.ejemplo.com/cam5', 'activa' => true],
            ['vehiculo_id' => $vehiculoTres->id, 'nombre' => 'Cámara Carga', 'ubicacion' => 'interior_carga', 'url_stream' => 'https://stream.ejemplo.com/cam6', 'activa' => true],
            
            ['vehiculo_id' => $vehiculoCuatro->id, 'nombre' => 'Cámara Frontal', 'ubicacion' => 'frontal', 'url_stream' => 'https://stream.ejemplo.com/cam7', 'activa' => true],
            ['vehiculo_id' => $vehiculoCuatro->id, 'nombre' => 'Cámara Carga', 'ubicacion' => 'interior_carga', 'url_stream' => 'https://stream.ejemplo.com/cam8', 'activa' => true],
        ];

        foreach ($camaras as $camara) {
            Camara::create($camara);
        }

        // 6. Crear Cargas
        $cargaUno = Carga::create([
            'codigo_seguimiento' => 'CRG-2024-001',
            'descripcion' => 'Electrónica - Notebooks y periféricos',
            'peso_kg' => 500.00,
            'volumen_m3' => 3.50,
            'origen' => 'Santiago, Chile',
            'destino' => 'Valparaíso, Chile',
            'tipo_carga' => 'fragil',
            'prioridad' => 'alta',
            'estado' => 'asignada',
            'creado_por' => $adminLogistica->id,
            'fecha_entrega_estimada' => now()->addDays(2),
        ]);

        $cargaDos = Carga::create([
            'codigo_seguimiento' => 'CRG-2024-002',
            'descripcion' => 'Alimentos no perecederos',
            'peso_kg' => 1200.00,
            'volumen_m3' => 8.00,
            'origen' => 'Santiago, Chile',
            'destino' => 'Concepción, Chile',
            'tipo_carga' => 'estandar',
            'prioridad' => 'media',
            'estado' => 'asignada',
            'creado_por' => $coordinadorLogistica->id,
            'fecha_entrega_estimada' => now()->addDays(3),
        ]);

        $cargaTres = Carga::create([
            'codigo_seguimiento' => 'CRG-2024-003',
            'descripcion' => 'Productos farmacéuticos',
            'peso_kg' => 300.00,
            'volumen_m3' => 2.00,
            'origen' => 'Santiago, Chile',
            'destino' => 'La Serena, Chile',
            'tipo_carga' => 'perecedera',
            'prioridad' => 'urgente',
            'estado' => 'en_transito',
            'creado_por' => $adminLogistica->id,
            'fecha_entrega_estimada' => now()->addDay(),
        ]);

        $cargaCuatro = Carga::create([
            'codigo_seguimiento' => 'CRG-2024-004',
            'descripcion' => 'Repuestos automotrices',
            'peso_kg' => 800.00,
            'volumen_m3' => 5.00,
            'origen' => 'Santiago, Chile',
            'destino' => 'Temuco, Chile',
            'tipo_carga' => 'estandar',
            'prioridad' => 'media',
            'estado' => 'pendiente',
            'creado_por' => $coordinadorLogistica->id,
            'fecha_entrega_estimada' => now()->addDays(4),
        ]);

        $cargaCinco = Carga::create([
            'codigo_seguimiento' => 'CRG-2024-005',
            'descripcion' => 'Material de construcción',
            'peso_kg' => 3500.00,
            'volumen_m3' => 15.00,
            'origen' => 'Santiago, Chile',
            'destino' => 'Rancagua, Chile',
            'tipo_carga' => 'estandar',
            'prioridad' => 'baja',
            'estado' => 'pendiente',
            'creado_por' => $adminLogistica->id,
            'fecha_entrega_estimada' => now()->addDays(5),
        ]);

        // 7. Crear Rutas
        $rutaUno = Ruta::create([
            'codigo_ruta' => 'RTA-2024-001',
            'vehiculo_id' => $vehiculoUno->id,
            'conductor_id' => $conductorUno->id,
            'asignado_por' => $adminLogistica->id,
            'punto_origen' => 'Santiago, Chile',
            'punto_destino' => 'Valparaíso, Chile',
            'puntos_intermedios' => ['Quilpué', 'Villa Alemana'],
            'distancia_km' => 120.00,
            'duracion_estimada_minutos' => 90,
            'estado' => 'en_curso',
            'fecha_inicio_programada' => now()->subHour(),
            'fecha_inicio_real' => now()->subMinutes(50),
            'fecha_fin_programada' => now()->addMinutes(40),
        ]);

        $rutaDos = Ruta::create([
            'codigo_ruta' => 'RTA-2024-002',
            'vehiculo_id' => $vehiculoDos->id,
            'conductor_id' => $conductorDos->id,
            'asignado_por' => $coordinadorLogistica->id,
            'punto_origen' => 'Santiago, Chile',
            'punto_destino' => 'Concepción, Chile',
            'puntos_intermedios' => ['Rancagua', 'Talca', 'Chillán'],
            'distancia_km' => 500.00,
            'duracion_estimada_minutos' => 360,
            'estado' => 'planificada',
            'fecha_inicio_programada' => now()->addHours(2),
            'fecha_fin_programada' => now()->addHours(8),
        ]);

        $rutaTres = Ruta::create([
            'codigo_ruta' => 'RTA-2024-003',
            'vehiculo_id' => $vehiculoTres->id,
            'conductor_id' => $conductorUno->id,
            'asignado_por' => $adminLogistica->id,
            'punto_origen' => 'Santiago, Chile',
            'punto_destino' => 'La Serena, Chile',
            'puntos_intermedios' => ['Los Vilos', 'Ovalle'],
            'distancia_km' => 470.00,
            'duracion_estimada_minutos' => 330,
            'estado' => 'en_curso',
            'fecha_inicio_programada' => now()->subHours(2),
            'fecha_inicio_real' => now()->subHours(2),
            'fecha_fin_programada' => now()->addHours(3),
        ]);

        // 8. Asignar cargas a rutas (tabla intermedia)
        $rutaUno->cargas()->attach($cargaUno->id, [
            'orden_entrega' => 1,
            'estado_entrega' => 'en_transito',
        ]);

        $rutaDos->cargas()->attach($cargaDos->id, [
            'orden_entrega' => 1,
            'estado_entrega' => 'pendiente',
        ]);

        $rutaTres->cargas()->attach($cargaTres->id, [
            'orden_entrega' => 1,
            'estado_entrega' => 'en_transito',
        ]);

        // 9. Crear datos de seguimiento GPS (simulados)
        // Ruta 1 - En tránsito a Valparaíso
        SeguimientoGps::create([
            'vehiculo_id' => $vehiculoUno->id,
            'ruta_id' => $rutaUno->id,
            'latitud' => -33.3470,
            'longitud' => -71.2167,
            'velocidad_kmh' => 85.50,
            'altitud_metros' => 120,
            'fecha_registro' => now()->subMinutes(10),
        ]);

        SeguimientoGps::create([
            'vehiculo_id' => $vehiculoUno->id,
            'ruta_id' => $rutaUno->id,
            'latitud' => -33.3520,
            'longitud' => -71.2300,
            'velocidad_kmh' => 88.00,
            'altitud_metros' => 115,
            'fecha_registro' => now()->subMinutes(5),
        ]);

        SeguimientoGps::create([
            'vehiculo_id' => $vehiculoUno->id,
            'ruta_id' => $rutaUno->id,
            'latitud' => -33.3580,
            'longitud' => -71.2450,
            'velocidad_kmh' => 82.30,
            'altitud_metros' => 110,
            'fecha_registro' => now(),
        ]);

        // Ruta 3 - En tránsito a La Serena
        SeguimientoGps::create([
            'vehiculo_id' => $vehiculoTres->id,
            'ruta_id' => $rutaTres->id,
            'latitud' => -31.8500,
            'longitud' => -71.2400,
            'velocidad_kmh' => 95.00,
            'altitud_metros' => 200,
            'fecha_registro' => now()->subMinutes(15),
        ]);

        SeguimientoGps::create([
            'vehiculo_id' => $vehiculoTres->id,
            'ruta_id' => $rutaTres->id,
            'latitud' => -31.8200,
            'longitud' => -71.2100,
            'velocidad_kmh' => 92.50,
            'altitud_metros' => 180,
            'fecha_registro' => now(),
        ]);

        echo "\n✅ Base de datos poblada exitosamente!\n";
        echo "📧 Usuarios creados (password: password123):\n";
        echo "   - juan.perez@empresa.com (Logística)\n";
        echo "   - maria.gonzalez@empresa.com (Logística)\n";
        echo "   - carlos.ramirez@empresa.com (Conductor)\n";
        echo "   - pedro.silva@empresa.com (Conductor)\n";
        echo "   - ana.torres@empresa.com (Seguridad)\n";
        echo "   - roberto.munoz@empresa.com (RRHH)\n";
        echo "🚛 4 Vehículos creados\n";
        echo "📦 5 Cargas creadas\n";
        echo "🗺️  3 Rutas creadas (2 en curso, 1 planificada)\n";
        echo "📡 12 Sensores configurados\n";
        echo "📹 8 Cámaras instaladas\n\n";
    }
}
