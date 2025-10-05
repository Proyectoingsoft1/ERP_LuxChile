<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ruta extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'codigo_ruta',
        'vehiculo_id',
        'conductor_id',
        'asignado_por',
        'punto_origen',
        'punto_destino',
        'puntos_intermedios',
        'distancia_km',
        'duracion_estimada_minutos',
        'estado',
        'fecha_inicio_programada',
        'fecha_inicio_real',
        'fecha_fin_programada',
        'fecha_fin_real',
        'observaciones'
    ];

    protected $casts = [
        'puntos_intermedios' => 'array',
        'distancia_km' => 'decimal:2',
        'fecha_inicio_programada' => 'datetime',
        'fecha_inicio_real' => 'datetime',
        'fecha_fin_programada' => 'datetime',
        'fecha_fin_real' => 'datetime',
    ];

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }

    public function conductor()
    {
        return $this->belongsTo(User::class, 'conductor_id');
    }

    public function asignadoPor()
    {
        return $this->belongsTo(User::class, 'asignado_por');
    }

    public function cargas()
    {
        return $this->belongsToMany(Carga::class, 'carga_ruta')
            ->withPivot('orden_entrega', 'estado_entrega', 'fecha_entrega', 'recibido_por', 'notas_entrega')
            ->withTimestamps();
    }

    public function lecturasSensores()
    {
        return $this->hasMany(LecturaSensor::class);
    }

    public function seguimientoGps()
    {
        return $this->hasMany(SeguimientoGps::class);
    }

    public function incidentes()
    {
        return $this->hasMany(Incidente::class);
    }

    public function pesoTotalCargas()
    {
        return $this->cargas()->sum('peso_kg');
    }
}