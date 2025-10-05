<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incidente extends Model
{
    protected $fillable = [
        'ruta_id',
        'reportado_por',
        'tipo',
        'severidad',
        'descripcion',
        'estado',
        'fecha_incidente',
        'fecha_resolucion',
        'acciones_tomadas'
    ];

    protected $casts = [
        'fecha_incidente' => 'datetime',
        'fecha_resolucion' => 'datetime',
    ];

    public function ruta()
    {
        return $this->belongsTo(Ruta::class);
    }

    public function reportadoPor()
    {
        return $this->belongsTo(User::class, 'reportado_por');
    }
}
