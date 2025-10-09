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



Primera Vez (Solo una vez por PC)
bash# 1. Clonar el repositorio
git clone https://github.com/Proyectoingsoft1/ERP_LuxChile.git
cd ERP_LuxChile

# 2. Instalar dependencias de Laravel
composer install

# 3. Copiar el archivo de configuración
cp .env.example .env

# 4. Generar la clave de la aplicación
php artisan key:generate

# 5. Configurar la base de datos en .env
# Abrir .env y modificar:
DB_DATABASE=erp_logistica
DB_USERNAME=root  # O el usuario que tengan en la universidad
DB_PASSWORD=      # La contraseña de MySQL

# 6. Crear la base de datos (si no existe)
mysql -u root -p -e "CREATE DATABASE erp_logistica;"

# 7. Ejecutar migraciones y seeders
php artisan migrate:fresh --seed

# 8. Iniciar el servidor Laravel
php artisan serve
Cada Vez que Trabajen (Días siguientes)
bash# 1. Ir a la carpeta del proyecto
cd ERP_LuxChile

# 2. Traer los últimos cambios
git pull origin main

# 3. Actualizar dependencias si hay cambios
composer install

# 4. Ejecutar migraciones nuevas (si las hay)
php artisan migrate

# 5. Iniciar el servidor
php artisan serve
El servidor correrá en http://localhost:8000

Importante: Antes de Irte
bash# Guardar tus cambios
git add .
git commit -m "Descripción de lo que hiciste"
git push origin main