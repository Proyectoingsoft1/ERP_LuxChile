<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'telefono',
        'departamento',
        'activo'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'activo' => 'boolean',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function cargasCreadas()
    {
        return $this->hasMany(Carga::class, 'creado_por');
    }

    public function rutasAsignadas()
    {
        return $this->hasMany(Ruta::class, 'asignado_por');
    }

    public function rutasComoConductor()
    {
        return $this->hasMany(Ruta::class, 'conductor_id');
    }

    public function incidentesReportados()
    {
        return $this->hasMany(Incidente::class, 'reportado_por');
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'usuario_id');
    }
}
