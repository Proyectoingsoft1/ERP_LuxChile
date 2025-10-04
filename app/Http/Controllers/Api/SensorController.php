<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sensor;
use App\Models\LecturaSensor;
use Illuminate\Http\Request;

class SensorController extends Controller
{
    public function sensoresVehiculo($vehiculoId)
    {
        $sensores = Sensor::where('vehiculo_id', $vehiculoId)
            ->with('ultimaLectura')
            ->get();

        return response()->json($sensores);
    }

    public function lecturas($sensorId)
    {
        $lecturas = LecturaSensor::where('sensor_id', $sensorId)
            ->orderBy('fecha_lectura', 'desc')
            ->take(100)
            ->get();

        return response()->json($lecturas);
    }

    public function registrarLectura(Request $request, $sensorId)
    {
        $sensor = Sensor::findOrFail($sensorId);

        $validated = $request->validate([
            'valor' => 'required|string',
            'unidad' => 'nullable|string',
            'estado' => 'in:normal,alerta,critico',
            'ruta_id' => 'nullable|exists:rutas,id'
        ]);

        $validated['sensor_id'] = $sensorId;
        $validated['fecha_lectura'] = now();

        $lectura = LecturaSensor::create($validated);

        return response()->json($lectura, 201);
    }
}
