<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LecturaSensor extends Model
{
    protected $table = 'lecturas_sensores';

    protected $fillable = [
        'sensor_id',
        'ruta_id',
        'valor',
        'unidad',
        'estado',
        'fecha_lectura'
    ];

    protected $casts = [
        'fecha_lectura' => 'datetime',
    ];

    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }

    public function ruta()
    {
        return $this->belongsTo(Ruta::class);
    }
}
