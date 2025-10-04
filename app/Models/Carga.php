<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Carga extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'codigo_seguimiento',
        'descripcion',
        'peso_kg',
        'volumen_m3',
        'origen',
        'destino',
        'tipo_carga',
        'prioridad',
        'estado',
        'creado_por',
        'fecha_creacion',
        'fecha_entrega_estimada',
        'fecha_entrega_real',
        'observaciones'
    ];

    protected $casts = [
        'peso_kg' => 'decimal:2',
        'volumen_m3' => 'decimal:2',
        'fecha_creacion' => 'datetime',
        'fecha_entrega_estimada' => 'datetime',
        'fecha_entrega_real' => 'datetime',
    ];

    public function creador()
    {
        return $this->belongsTo(User::class, 'creado_por');
    }

    public function rutas()
    {
        return $this->belongsToMany(Ruta::class, 'carga_ruta')
            ->withPivot('orden_entrega', 'estado_entrega', 'fecha_entrega', 'recibido_por', 'notas_entrega')
            ->withTimestamps();
    }
}
