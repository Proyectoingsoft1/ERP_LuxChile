<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('incidentes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ruta_id')->constrained('rutas')->onDelete('cascade');
            $table->foreignId('reportado_por')->constrained('users')->onDelete('cascade');
            $table->enum('tipo', ['accidente', 'retraso', 'falla_mecanica', 'robo', 'dano_carga', 'otro']);
            $table->enum('severidad', ['baja', 'media', 'alta', 'critica'])->default('media');
            $table->text('descripcion');
            $table->enum('estado', ['abierto', 'en_revision', 'resuelto', 'cerrado'])->default('abierto');
            $table->timestamp('fecha_incidente');
            $table->timestamp('fecha_resolucion')->nullable();
            $table->text('acciones_tomadas')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('incidentes');
    }
};