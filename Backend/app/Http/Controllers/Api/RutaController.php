<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ruta;
use App\Models\Carga;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class RutaController extends Controller
{
    public function index(Request $request)
    {
        $query = Ruta::with([
            'vehiculo',
            'conductor',
            'asignadoPor',
            'cargas'
        ]);

        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('vehiculo_id')) {
            $query->where('vehiculo_id', $request->vehiculo_id);
        }

        $rutas = $query->latest()->paginate(20);

        return response()->json($rutas);
    }

    public function show($id)
    {
        $ruta = Ruta::with([
            'vehiculo.sensores.ultimaLectura',
            'vehiculo.camaras',
            'conductor',
            'asignadoPor',
            'cargas',
            'seguimientoGps' => function($query) {
                $query->latest()->take(50);
            },
            'incidentes'
        ])->findOrFail($id);

        return response()->json($ruta);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_ruta' => 'required|unique:rutas',
            'vehiculo_id' => 'required|exists:vehiculos,id',
            'conductor_id' => 'nullable|exists:users,id',
            'punto_origen' => 'required|string',
            'punto_destino' => 'required|string',
            'puntos_intermedios' => 'nullable|array',
            'distancia_km' => 'nullable|numeric|min:0',
            'duracion_estimada_minutos' => 'nullable|integer|min:0',
            'fecha_inicio_programada' => 'required|date',
            'fecha_fin_programada' => 'nullable|date|after:fecha_inicio_programada',
            'observaciones' => 'nullable|string',
            'cargas' => 'nullable|array',
            'cargas.*' => 'exists:cargas,id'
        ]);

        $vehiculo = Vehiculo::findOrFail($validated['vehiculo_id']);
        
        if ($vehiculo->estado !== 'disponible') {
            return response()->json([
                'message' => 'El vehículo no está disponible'
            ], 422);
        }

        if (isset($validated['cargas'])) {
            $pesoTotal = Carga::whereIn('id', $validated['cargas'])->sum('peso_kg');
            
            if ($pesoTotal > $vehiculo->capacidad_carga_kg) {
                return response()->json([
                    'message' => 'El peso total de las cargas excede la capacidad del vehículo',
                    'peso_total' => $pesoTotal,
                    'capacidad_vehiculo' => $vehiculo->capacidad_carga_kg
                ], 422);
            }
        }

        $validated['asignado_por'] = $request->user()->id;
        $validated['estado'] = 'planificada';

        $cargas = $validated['cargas'] ?? [];
        unset($validated['cargas']);

        $ruta = Ruta::create($validated);

        if (!empty($cargas)) {
            foreach ($cargas as $index => $cargaId) {
                $ruta->cargas()->attach($cargaId, [
                    'orden_entrega' => $index + 1,
                    'estado_entrega' => 'pendiente'
                ]);

                Carga::where('id', $cargaId)->update(['estado' => 'asignada']);
            }
        }

        $vehiculo->update(['estado' => 'en_ruta']);

        return response()->json($ruta->load('cargas'), 201);
    }

    public function update(Request $request, $id)
    {
        $ruta = Ruta::findOrFail($id);

        $validated = $request->validate([
            'estado' => 'in:planificada,en_curso,completada,cancelada',
            'fecha_inicio_real' => 'nullable|date',
            'fecha_fin_real' => 'nullable|date',
            'observaciones' => 'nullable|string'
        ]);

        $ruta->update($validated);

        if (isset($validated['estado']) && $validated['estado'] === 'completada') {
            $ruta->vehiculo->update(['estado' => 'disponible']);
            foreach ($ruta->cargas as $carga) {
                $carga->update(['estado' => 'entregada']);
            }
        }

        return response()->json($ruta);
    }

    public function activas()
    {
        $rutas = Ruta::with([
            'vehiculo.ultimaPosicion',
            'conductor',
            'cargas'
        ])
        ->whereIn('estado', ['planificada', 'en_curso'])
        ->get();

        return response()->json($rutas);
    }

    public function seguimiento($id)
    {
        $ruta = Ruta::with([
            'vehiculo',
            'seguimientoGps' => function($query) {
                $query->orderBy('fecha_registro', 'desc')->take(100);
            }
        ])->findOrFail($id);

        return response()->json([
            'ruta' => $ruta,
            'posiciones' => $ruta->seguimientoGps
        ]);
    }

    public function asignarCarga(Request $request, $id)
    {
        $ruta = Ruta::findOrFail($id);

        $validated = $request->validate([
            'carga_id' => 'required|exists:cargas,id',
            'orden_entrega' => 'required|integer|min:1'
        ]);

        $carga = Carga::findOrFail($validated['carga_id']);
        $pesoActual = $ruta->pesoTotalCargas();
        
        if (($pesoActual + $carga->peso_kg) > $ruta->vehiculo->capacidad_carga_kg) {
            return response()->json([
                'message' => 'No hay capacidad suficiente en el vehículo'
            ], 422);
        }

        $ruta->cargas()->attach($validated['carga_id'], [
            'orden_entrega' => $validated['orden_entrega'],
            'estado_entrega' => 'pendiente'
        ]);

        $carga->update(['estado' => 'asignada']);

        return response()->json([
            'message' => 'Carga asignada exitosamente',
            'ruta' => $ruta->load('cargas')
        ]);
    }
}
