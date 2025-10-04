<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use App\Models\Carga;
use App\Models\Ruta;
use App\Models\Incidente;

class DashboardController extends Controller
{
    public function estadisticas()
    {
        $stats = [
            'vehiculos' => [
                'total' => Vehiculo::count(),
                'disponibles' => Vehiculo::where('estado', 'disponible')->count(),
                'en_ruta' => Vehiculo::where('estado', 'en_ruta')->count(),
                'mantenimiento' => Vehiculo::where('estado', 'mantenimiento')->count(),
            ],
            'cargas' => [
                'total' => Carga::count(),
                'pendientes' => Carga::where('estado', 'pendiente')->count(),
                'en_transito' => Carga::where('estado', 'en_transito')->count(),
                'entregadas_hoy' => Carga::where('estado', 'entregada')
                    ->whereDate('fecha_entrega_real', today())->count(),
            ],
            'rutas' => [
                'total' => Ruta::count(),
                'activas' => Ruta::whereIn('estado', ['planificada', 'en_curso'])->count(),
                'completadas_hoy' => Ruta::where('estado', 'completada')
                    ->whereDate('fecha_fin_real', today())->count(),
            ],
            'incidentes' => [
                'abiertos' => Incidente::where('estado', 'abierto')->count(),
                'criticos' => Incidente::where('severidad', 'critica')
                    ->where('estado', '!=', 'cerrado')->count(),
            ]
        ];

        return response()->json($stats);
    }

    public function rutasActivas()
    {
        $rutas = Ruta::with([
            'vehiculo.ultimaPosicion',
            'conductor',
            'cargas'
        ])
        ->whereIn('estado', ['planificada', 'en_curso'])
        ->get()
        ->map(function($ruta) {
            return [
                'id' => $ruta->id,
                'codigo' => $ruta->codigo_ruta,
                'vehiculo' => $ruta->vehiculo->patente,
                'conductor' => $ruta->conductor->name ?? 'Sin asignar',
                'origen' => $ruta->punto_origen,
                'destino' => $ruta->punto_destino,
                'estado' => $ruta->estado,
                'cargas_count' => $ruta->cargas->count(),
                'posicion_actual' => $ruta->vehiculo->ultimaPosicion,
            ];
        });

        return response()->json($rutas);
    }
}
