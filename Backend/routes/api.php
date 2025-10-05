<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehiculoController;
use App\Http\Controllers\Api\CargaController;
use App\Http\Controllers\Api\RutaController;
use App\Http\Controllers\Api\SensorController;
use App\Http\Controllers\Api\CamaraController;
use App\Http\Controllers\Api\DashboardController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/estadisticas', [DashboardController::class, 'estadisticas']);
        Route::get('/rutas-activas', [DashboardController::class, 'rutasActivas']);
    });

    // Vehículos
    Route::prefix('vehiculos')->group(function () {
        Route::get('/', [VehiculoController::class, 'index']);
        Route::post('/', [VehiculoController::class, 'store']);
        Route::get('/disponibles', [VehiculoController::class, 'disponibles']);
        Route::get('/{id}', [VehiculoController::class, 'show']);
        Route::put('/{id}', [VehiculoController::class, 'update']);
        Route::delete('/{id}', [VehiculoController::class, 'destroy']);
        Route::get('/{id}/posicion', [VehiculoController::class, 'posicionActual']);
        Route::get('/{id}/sensores', [SensorController::class, 'sensoresVehiculo']);
        Route::get('/{id}/camaras', [CamaraController::class, 'camarasVehiculo']);
    });

    // Cargas
    Route::prefix('cargas')->group(function () {
        Route::get('/', [CargaController::class, 'index']);
        Route::post('/', [CargaController::class, 'store']);
        Route::get('/pendientes', [CargaController::class, 'pendientes']);
        Route::get('/{id}', [CargaController::class, 'show']);
        Route::put('/{id}', [CargaController::class, 'update']);
        Route::delete('/{id}', [CargaController::class, 'destroy']);
    });

    // Rutas
    Route::prefix('rutas')->group(function () {
        Route::get('/', [RutaController::class, 'index']);
        Route::post('/', [RutaController::class, 'store']);
        Route::get('/activas', [RutaController::class, 'activas']);
        Route::get('/{id}', [RutaController::class, 'show']);
        Route::put('/{id}', [RutaController::class, 'update']);
        Route::get('/{id}/seguimiento', [RutaController::class, 'seguimiento']);
        Route::post('/{id}/asignar-carga', [RutaController::class, 'asignarCarga']);
    });

    // Sensores
    Route::prefix('sensores')->group(function () {
        Route::get('/{id}/lecturas', [SensorController::class, 'lecturas']);
        Route::post('/{id}/lecturas', [SensorController::class, 'registrarLectura']);
    });

    // Cámaras
    Route::get('/camaras/{id}', [CamaraController::class, 'show']);
});

// Ruta de prueba
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente',
        'version' => '1.0',
        'timestamp' => now()
    ]);
});
