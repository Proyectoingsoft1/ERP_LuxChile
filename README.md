# ERP LuxChile - Sistema de Gestión Logística

Proyecto universitario - Ingeniería de Software I

## Estructura del Proyecto

ERP_LuxChile/
├── Backend/          # API Laravel
├── Frontend/         # Aplicación React
└── README.md

## Instalación

### Backend (Laravel)

cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve

API: http://localhost:8000/api

### Frontend (React)

cd Frontend
npm install
npm start

App: http://localhost:3000

## Usuarios de Prueba

- Email: juan.perez@empresa.com
- Password: password123

## Equipo

- Backend (Laravel): Vicente
- Frontend (React): [Compañero]

## Repositorio

https://github.com/Proyectoingsoft1/ERP_LuxChile
