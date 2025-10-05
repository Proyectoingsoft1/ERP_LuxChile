<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('lecturas_sensores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sensor_id')->constrained('sensores')->onDelete('cascade');
            $table->foreignId('ruta_id')->nullable()->constrained('rutas')->onDelete('set null');
            $table->string('valor'); // temperatura, coordenadas, etc
            $table->string('unidad')->nullable(); // celsius, kg, m/s, etc
            $table->enum('estado', ['normal', 'alerta', 'critico'])->default('normal');
            $table->timestamp('fecha_lectura')->useCurrent();
            $table->timestamps();
        });

        // Índice para consultas rápidas
        Schema::table('lecturas_sensores', function (Blueprint $table) {
            $table->index(['sensor_id', 'fecha_lectura']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('lecturas_sensores');
    }
};
