# Guía de Docker Compose para TheraTrack

Esta guía explica cómo usar Docker Compose para gestionar PostgreSQL en TheraTrack.

## ¿Qué es Docker Compose?

Docker Compose es una herramienta que permite definir y ejecutar aplicaciones Docker multi-contenedor usando un archivo YAML. Simplifica la gestión de contenedores, volúmenes y redes.

## Archivo docker-compose.yml

El archivo `docker-compose.yml` define los servicios (contenedores) que necesitas. Para TheraTrack, incluye:

- **postgres**: Contenedor de PostgreSQL con configuración predefinida

## Comandos Principales

### 1. Iniciar el contenedor

```bash
# Iniciar en segundo plano (detached mode)
docker-compose up -d

# Iniciar y ver los logs
docker-compose up
```

### 2. Ver el estado de los contenedores

```bash
# Ver contenedores gestionados por docker-compose
docker-compose ps

# Ver todos los contenedores (incluyendo otros)
docker ps
```

### 3. Ver los logs

```bash
# Ver logs del servicio postgres
docker-compose logs postgres

# Ver logs en tiempo real (seguimiento)
docker-compose logs -f postgres

# Ver todos los logs
docker-compose logs
```

### 4. Detener el contenedor

```bash
# Detener los contenedores (mantiene los datos)
docker-compose stop

# Detener y eliminar contenedores (mantiene los datos)
docker-compose down

# Detener y eliminar contenedores Y volúmenes (⚠️ BORRA LOS DATOS)
docker-compose down -v
```

### 5. Reiniciar el contenedor

```bash
# Reiniciar los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart postgres
```

### 6. Ejecutar comandos dentro del contenedor

```bash
# Conectarse a PostgreSQL con psql
docker-compose exec postgres psql -U postgres -d theratrack

# Ejecutar un comando SQL
docker-compose exec postgres psql -U postgres -d theratrack -c "SELECT COUNT(*) FROM patients;"

# Ejecutar un script SQL
docker-compose exec -T postgres psql -U postgres -d theratrack < scripts/create-tables.sql
```

## Configuración Inicial

### Paso 1: Crear el archivo docker-compose.yml

El archivo ya está creado en `theratrack-backend/docker-compose.yml`. Puedes editarlo para cambiar:
- Contraseña de PostgreSQL
- Puerto (si 5432 ya está en uso)
- Nombre del contenedor

### Paso 2: Iniciar el contenedor

```bash
cd theratrack-backend
docker-compose up -d
```

### Paso 3: Verificar que está corriendo

```bash
docker-compose ps
```

Deberías ver algo como:
```
NAME                  IMAGE               COMMAND                  SERVICE    CREATED         STATUS          PORTS
theratrack-postgres   postgres:15-alpine  "docker-entrypoint.s…"   postgres   X seconds ago   Up X seconds    0.0.0.0:5432->5432/tcp
```

### Paso 4: Crear las tablas

```bash
# Opción 1: Usar el script automatizado
./scripts/setup-docker-db.sh theratrack-postgres

# Opción 2: Ejecutar manualmente
docker-compose exec -T postgres psql -U postgres -d theratrack < scripts/create-tables.sql
```

### Paso 5: Configurar el .env

Crea o actualiza el archivo `.env` en `theratrack-backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_DATABASE=theratrack
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
OPENAI_API_KEY=your-openai-api-key-here
```

### Paso 6: Ejecutar el seed

```bash
npm run seed
```

## Migrar desde un contenedor existente

Si ya tienes un contenedor `teslodb` corriendo y quieres migrar a docker-compose:

### Opción A: Usar el contenedor existente

1. Detén el contenedor existente:
   ```bash
   docker stop teslodb
   ```

2. Inicia docker-compose:
   ```bash
   docker-compose up -d
   ```

3. Si necesitas migrar datos, puedes hacer un dump y restore (ver sección de backup)

### Opción B: Cambiar el nombre en docker-compose.yml

Si quieres mantener tu contenedor `teslodb`, puedes editar `docker-compose.yml`:

```yaml
services:
  postgres:
    container_name: teslodb  # Cambiar aquí
    # ... resto de la configuración
```

## Gestión de Datos

### Backup de la base de datos

```bash
# Crear un backup
docker-compose exec postgres pg_dump -U postgres theratrack > backup_$(date +%Y%m%d_%H%M%S).sql

# O usando docker exec directamente
docker exec theratrack-postgres pg_dump -U postgres theratrack > backup.sql
```

### Restaurar desde un backup

```bash
# Restaurar un backup
docker-compose exec -T postgres psql -U postgres -d theratrack < backup.sql
```

### Ver el tamaño de la base de datos

```bash
docker-compose exec postgres psql -U postgres -d theratrack -c "
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'theratrack';
"
```

## Solución de Problemas

### El puerto 5432 ya está en uso

Edita `docker-compose.yml` y cambia el puerto:

```yaml
ports:
  - "5433:5432"  # Usa 5433 en tu máquina, 5432 en el contenedor
```

Luego actualiza tu `.env`:
```env
DB_PORT=5433
```

### El contenedor no inicia

```bash
# Ver logs detallados
docker-compose logs postgres

# Verificar el estado
docker-compose ps

# Reiniciar
docker-compose restart postgres
```

### Limpiar todo y empezar de nuevo

```bash
# ⚠️ CUIDADO: Esto borra todos los datos
docker-compose down -v
docker-compose up -d
```

### Verificar conexión

```bash
# Desde la aplicación
npm run start:dev
# Visita http://localhost:3000/ping-db

# Desde la línea de comandos
docker-compose exec postgres psql -U postgres -d theratrack -c "SELECT 1;"
```

## Comandos Útiles Adicionales

```bash
# Ver uso de recursos
docker-compose top

# Reconstruir el contenedor (si cambias la imagen)
docker-compose up -d --force-recreate postgres

# Ver la configuración actual
docker-compose config

# Escalar servicios (si tuvieras múltiples instancias)
docker-compose up -d --scale postgres=1
```

## Ventajas de usar Docker Compose

1. **Configuración como código**: Todo está en un archivo YAML versionable
2. **Reproducible**: Cualquiera puede levantar el mismo entorno
3. **Simple**: Un solo comando para iniciar/detener todo
4. **Gestión de volúmenes**: Los datos persisten automáticamente
5. **Fácil de compartir**: El equipo puede usar la misma configuración

## Próximos Pasos

Una vez que tengas docker-compose funcionando:

1. ✅ Contenedor corriendo: `docker-compose ps`
2. ✅ Tablas creadas: Ejecuta `create-tables.sql` o usa `synchronize: true`
3. ✅ Datos de ejemplo: Ejecuta `npm run seed`
4. ✅ Aplicación conectada: Verifica con `npm run start:dev`

