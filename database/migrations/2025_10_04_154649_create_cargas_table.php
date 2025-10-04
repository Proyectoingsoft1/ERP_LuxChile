<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cargas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_seguimiento')->unique();
            $table->string('descripcion');
            $table->decimal('peso_kg', 10, 2);
            $table->decimal('volumen_m3', 10, 2)->nullable();
            $table->string('origen');
            $table->string('destino');
            $table->enum('tipo_carga', ['fragil', 'peligrosa', 'perecedera', 'estandar'])->default('estandar');
            $table->enum('prioridad', ['baja', 'media', 'alta', 'urgente'])->default('media');
            $table->enum('estado', ['pendiente', 'asignada', 'en_transito', 'entregada', 'cancelada'])->default('pendiente');
            $table->foreignId('creado_por')->constrained('users')->onDelete('cascade');
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->timestamp('fecha_entrega_estimada')->nullable();
            $table->timestamp('fecha_entrega_real')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cargas');
    }
};
