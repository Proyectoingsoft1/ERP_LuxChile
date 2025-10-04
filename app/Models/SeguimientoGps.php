<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeguimientoGps extends Model
{
    protected $table = 'seguimiento_gps';

    protected $fillable = [
        'vehiculo_id',
        'ruta_id',
        'latitud',
        'longitud',
        'velocidad_kmh',
        'altitud_metros',
        'fecha_registro'
    ];

    protected $casts = [
        'latitud' => 'decimal:8',
        'longitud' => 'decimal:8',
        'velocidad_kmh' => 'decimal:2',
        'fecha_registro' => 'datetime',
    ];

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }

    public function ruta()
    {
        return $this->belongsTo(Ruta::class);
    }
}