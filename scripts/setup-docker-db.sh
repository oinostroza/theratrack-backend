#!/bin/bash

# Script para configurar la base de datos en Docker
# Uso: ./scripts/setup-docker-db.sh [contenedor_name] [db_name] [db_user] [db_password]

set -e

# Valores por defecto
CONTAINER_NAME=${1:-theratrack-postgres}
DB_NAME=${2:-theratrack}
DB_USER=${3:-postgres}
DB_PASSWORD=${4:-1234}

echo "🐳 Configurando base de datos en Docker..."
echo "   Contenedor: $CONTAINER_NAME"
echo "   Base de datos: $DB_NAME"
echo "   Usuario: $DB_USER"
echo ""

# Verificar si el contenedor existe y está corriendo
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Error: El contenedor '$CONTAINER_NAME' no está corriendo."
    echo ""
    echo "📋 Contenedores disponibles:"
    docker ps --format "   - {{.Names}} ({{.Image}})" || echo "   (ninguno corriendo)"
    echo ""
    echo "💡 Para ver todos los contenedores (incluyendo detenidos):"
    echo "   docker ps -a"
    echo ""
    echo "💡 Para iniciar un contenedor:"
    echo "   docker-compose up -d"
    echo ""
    echo "💡 Uso del script:"
    echo "   ./scripts/setup-docker-db.sh [nombre_contenedor] [db_name] [db_user] [db_password]"
    exit 1
fi

echo "✅ Contenedor encontrado"
echo ""

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
until docker exec $CONTAINER_NAME pg_isready -U $DB_USER > /dev/null 2>&1; do
    echo "   Esperando..."
    sleep 1
done
echo "✅ PostgreSQL está listo"
echo ""

# Crear la base de datos si no existe
echo "📦 Creando base de datos si no existe..."
docker exec -i $CONTAINER_NAME psql -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
docker exec -i $CONTAINER_NAME psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
echo "✅ Base de datos '$DB_NAME' lista"
echo ""

# Crear las tablas
echo "📋 Creando tablas..."
if [ -f "scripts/create-tables.sql" ]; then
    docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME < scripts/create-tables.sql
    echo "✅ Tablas creadas exitosamente"
else
    echo "⚠️  Advertencia: No se encontró scripts/create-tables.sql"
    echo "   Las tablas se crearán automáticamente si tienes synchronize: true en TypeORM"
fi
echo ""

# Preguntar si quiere ejecutar el seed
read -p "¿Deseas ejecutar el script de seed para insertar datos de ejemplo? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "🌱 Ejecutando script de seed..."
    npm run seed
    echo "✅ Seed completado"
else
    echo "⏭️  Saltando seed. Ejecuta 'npm run seed' cuando estés listo."
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📝 Variables de entorno para tu .env:"
echo "   DB_HOST=localhost"
echo "   DB_PORT=5432"
echo "   DB_USERNAME=$DB_USER"
echo "   DB_PASSWORD=$DB_PASSWORD"
echo "   DB_DATABASE=$DB_NAME"

