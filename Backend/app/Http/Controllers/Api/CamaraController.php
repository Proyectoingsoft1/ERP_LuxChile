<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Camara;

class CamaraController extends Controller
{
    public function camarasVehiculo($vehiculoId)
    {
        $camaras = Camara::where('vehiculo_id', $vehiculoId)
            ->where('activa', true)
            ->get();

        return response()->json($camaras);
    }

    public function show($id)
    {
        $camara = Camara::with('vehiculo')->findOrFail($id);

        return response()->json($camara);
    }
}
