<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Camara extends Model
{
    protected $fillable = [
        'vehiculo_id',
        'nombre',
        'ubicacion',
        'url_stream',
        'activa'
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }
}
