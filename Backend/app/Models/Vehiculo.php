<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehiculo extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'patente',
        'marca',
        'modelo',
        'anio',
        'capacidad_carga_kg',
        'capacidad_volumen_m3',
        'estado',
        'observaciones'
    ];

    protected $casts = [
        'capacidad_carga_kg' => 'decimal:2',
        'capacidad_volumen_m3' => 'decimal:2',
    ];

    public function rutas()
    {
        return $this->hasMany(Ruta::class);
    }

    public function sensores()
    {
        return $this->hasMany(Sensor::class);
    }

    public function camaras()
    {
        return $this->hasMany(Camara::class);
    }

    public function seguimientoGps()
    {
        return $this->hasMany(SeguimientoGps::class);
    }

    public function ultimaPosicion()
    {
        return $this->hasOne(SeguimientoGps::class)->latestOfMany('fecha_registro');
    }

    public function puedeTransportar($peso_kg)
    {
        return $this->capacidad_carga_kg >= $peso_kg && $this->estado === 'disponible';
    }
}
