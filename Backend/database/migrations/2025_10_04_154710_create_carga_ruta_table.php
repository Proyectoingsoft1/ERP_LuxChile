<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('carga_ruta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carga_id')->constrained('cargas')->onDelete('cascade');
            $table->foreignId('ruta_id')->constrained('rutas')->onDelete('cascade');
            $table->integer('orden_entrega')->default(1);
            $table->enum('estado_entrega', ['pendiente', 'en_transito', 'entregada', 'fallida'])->default('pendiente');
            $table->timestamp('fecha_entrega')->nullable();
            $table->string('recibido_por')->nullable();
            $table->text('notas_entrega')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('carga_ruta');
    }
};
