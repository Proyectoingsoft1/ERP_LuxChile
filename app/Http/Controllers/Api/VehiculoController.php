<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    public function index()
    {
        $vehiculos = Vehiculo::with(['ultimaPosicion', 'sensores', 'camaras'])
            ->get();

        return response()->json($vehiculos);
    }

    public function show($id)
    {
        $vehiculo = Vehiculo::with([
            'rutas' => function($query) {
                $query->latest()->take(5);
            },
            'sensores.ultimaLectura',
            'camaras',
            'ultimaPosicion'
        ])->findOrFail($id);

        return response()->json($vehiculo);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patente' => 'required|unique:vehiculos',
            'marca' => 'required',
            'modelo' => 'required',
            'anio' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'capacidad_carga_kg' => 'required|numeric|min:0',
            'capacidad_volumen_m3' => 'nullable|numeric|min:0',
            'estado' => 'in:disponible,en_ruta,mantenimiento,fuera_servicio',
            'observaciones' => 'nullable|string'
        ]);

        $vehiculo = Vehiculo::create($validated);

        return response()->json($vehiculo, 201);
    }

    public function update(Request $request, $id)
    {
        $vehiculo = Vehiculo::findOrFail($id);

        $validated = $request->validate([
            'patente' => 'unique:vehiculos,patente,' . $id,
            'marca' => 'sometimes|required',
            'modelo' => 'sometimes|required',
            'anio' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'capacidad_carga_kg' => 'sometimes|numeric|min:0',
            'capacidad_volumen_m3' => 'nullable|numeric|min:0',
            'estado' => 'in:disponible,en_ruta,mantenimiento,fuera_servicio',
            'observaciones' => 'nullable|string'
        ]);

        $vehiculo->update($validated);

        return response()->json($vehiculo);
    }

    public function destroy($id)
    {
        $vehiculo = Vehiculo::findOrFail($id);
        $vehiculo->delete();

        return response()->json([
            'message' => 'Vehículo eliminado exitosamente'
        ]);
    }

    public function posicionActual($id)
    {
        $vehiculo = Vehiculo::with('ultimaPosicion')->findOrFail($id);

        return response()->json([
            'vehiculo_id' => $vehiculo->id,
            'patente' => $vehiculo->patente,
            'posicion' => $vehiculo->ultimaPosicion
        ]);
    }

    public function disponibles()
    {
        $vehiculos = Vehiculo::where('estado', 'disponible')
            ->orderBy('capacidad_carga_kg', 'desc')
            ->get();

        return response()->json($vehiculos);
    }
}
