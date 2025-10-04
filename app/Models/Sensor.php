<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sensor extends Model
{
    protected $table = 'sensores';

    protected $fillable = [
        'vehiculo_id',
        'tipo_sensor',
        'ubicacion',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function vehiculo()
    {
        return $this->belongsTo(Vehiculo::class);
    }

    public function lecturas()
    {
        return $this->hasMany(LecturaSensor::class);
    }

    public function ultimaLectura()
    {
        return $this->hasOne(LecturaSensor::class)->latestOfMany('fecha_lectura');
    }
}
