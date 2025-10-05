<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            $table->string('patente')->unique();
            $table->string('marca');
            $table->string('modelo');
            $table->integer('anio')->nullable();
            $table->decimal('capacidad_carga_kg', 10, 2); // Capacidad máxima en kg
            $table->decimal('capacidad_volumen_m3', 10, 2)->nullable(); // Capacidad en m³
            $table->enum('estado', ['disponible', 'en_ruta', 'mantenimiento', 'fuera_servicio'])->default('disponible');
            $table->text('observaciones')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehiculos');
    }
};
