<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('seguimiento_gps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehiculo_id')->constrained('vehiculos')->onDelete('cascade');
            $table->foreignId('ruta_id')->nullable()->constrained('rutas')->onDelete('set null');
            $table->decimal('latitud', 10, 8);
            $table->decimal('longitud', 11, 8);
            $table->decimal('velocidad_kmh', 5, 2)->nullable();
            $table->integer('altitud_metros')->nullable();
            $table->timestamp('fecha_registro')->useCurrent();
            $table->timestamps();
        });

        // Índice para consultas de posición en tiempo real
        Schema::table('seguimiento_gps', function (Blueprint $table) {
            $table->index(['vehiculo_id', 'fecha_registro']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('seguimiento_gps');
    }
};
