<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Carga;
use Illuminate\Http\Request;

class CargaController extends Controller
{
    public function index(Request $request)
    {
        $query = Carga::with(['creador', 'rutas']);

        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('prioridad')) {
            $query->where('prioridad', $request->prioridad);
        }

        $cargas = $query->latest()->paginate(20);

        return response()->json($cargas);
    }

    public function show($id)
    {
        $carga = Carga::with([
            'creador',
            'rutas.vehiculo',
            'rutas.conductor'
        ])->findOrFail($id);

        return response()->json($carga);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_seguimiento' => 'required|unique:cargas',
            'descripcion' => 'required|string',
            'peso_kg' => 'required|numeric|min:0',
            'volumen_m3' => 'nullable|numeric|min:0',
            'origen' => 'required|string',
            'destino' => 'required|string',
            'tipo_carga' => 'in:fragil,peligrosa,perecedera,estandar',
            'prioridad' => 'in:baja,media,alta,urgente',
            'fecha_entrega_estimada' => 'nullable|date|after:now',
            'observaciones' => 'nullable|string'
        ]);

        $validated['creado_por'] = $request->user()->id;
        $validated['estado'] = 'pendiente';

        $carga = Carga::create($validated);

        return response()->json($carga, 201);
    }

    public function update(Request $request, $id)
    {
        $carga = Carga::findOrFail($id);

        $validated = $request->validate([
            'codigo_seguimiento' => 'unique:cargas,codigo_seguimiento,' . $id,
            'descripcion' => 'sometimes|required|string',
            'peso_kg' => 'sometimes|numeric|min:0',
            'volumen_m3' => 'nullable|numeric|min:0',
            'origen' => 'sometimes|required|string',
            'destino' => 'sometimes|required|string',
            'tipo_carga' => 'in:fragil,peligrosa,perecedera,estandar',
            'prioridad' => 'in:baja,media,alta,urgente',
            'estado' => 'in:pendiente,asignada,en_transito,entregada,cancelada',
            'fecha_entrega_estimada' => 'nullable|date',
            'fecha_entrega_real' => 'nullable|date',
            'observaciones' => 'nullable|string'
        ]);

        $carga->update($validated);

        return response()->json($carga);
    }

    public function destroy($id)
    {
        $carga = Carga::findOrFail($id);
        $carga->delete();

        return response()->json([
            'message' => 'Carga eliminada exitosamente'
        ]);
    }

    public function pendientes()
    {
        $cargas = Carga::where('estado', 'pendiente')
            ->orderBy('prioridad')
            ->orderBy('fecha_entrega_estimada')
            ->get();

        return response()->json($cargas);
    }
}
