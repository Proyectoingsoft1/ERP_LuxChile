<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('rutas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_ruta')->unique();
            $table->foreignId('vehiculo_id')->constrained('vehiculos')->onDelete('cascade');
            $table->foreignId('conductor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('asignado_por')->constrained('users')->onDelete('cascade');
            $table->string('punto_origen');
            $table->string('punto_destino');
            $table->text('puntos_intermedios')->nullable(); // JSON con paradas
            $table->decimal('distancia_km', 10, 2)->nullable();
            $table->integer('duracion_estimada_minutos')->nullable();
            $table->enum('estado', ['planificada', 'en_curso', 'completada', 'cancelada'])->default('planificada');
            $table->timestamp('fecha_inicio_programada');
            $table->timestamp('fecha_inicio_real')->nullable();
            $table->timestamp('fecha_fin_programada')->nullable();
            $table->timestamp('fecha_fin_real')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('rutas');
    }
};
