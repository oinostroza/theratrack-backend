# Configuración de PostgreSQL en Docker

Esta guía explica cómo configurar la conexión de TheraTrack para usar PostgreSQL en Docker.

## Opciones para crear las tablas

### Opción 1: Usar TypeORM Synchronize (Recomendado para desarrollo)

TypeORM puede crear automáticamente las tablas cuando la aplicación se inicia si `synchronize: true` está habilitado.

**Ventajas:**
- Automático, no requiere scripts adicionales
- Las tablas se crean basándose en las entidades TypeORM
- Ideal para desarrollo

**Pasos:**

1. Asegúrate de que en `app.module.ts` tengas:
   ```typescript
   synchronize: configService.get('NODE_ENV') !== 'production',
   ```

2. Configura las variables de entorno en `.env`:
   ```env
   DB_HOST=localhost  # o la IP de tu contenedor Docker
   DB_PORT=5432       # o el puerto mapeado de Docker
   DB_USERNAME=postgres
   DB_PASSWORD=tu_password
   DB_DATABASE=theratrack
   NODE_ENV=development
   ```

3. Inicia tu contenedor Docker de PostgreSQL

4. Inicia la aplicación NestJS - las tablas se crearán automáticamente

5. Ejecuta el script de seed:
   ```bash
   npm run seed
   ```

### Opción 2: Crear tablas manualmente con SQL

Si prefieres crear las tablas manualmente (recomendado para producción):

**Pasos:**

1. Crea la base de datos en PostgreSQL:
   ```sql
   CREATE DATABASE theratrack;
   ```

2. Ejecuta el script de creación de tablas:
   ```bash
   # Desde el contenedor Docker
   docker exec -i tu_contenedor_postgres psql -U postgres -d theratrack < scripts/create-tables.sql
   
   # O desde tu máquina local si tienes psql instalado
   psql -h localhost -p 5432 -U postgres -d theratrack -f scripts/create-tables.sql
   ```

3. Ejecuta el script de seed:
   ```bash
   npm run seed
   ```

## Configuración de Docker

### Ejemplo de docker-compose.yml

Crea un archivo `docker-compose.yml` en la raíz del proyecto:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: theratrack-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: tu_password_seguro
      POSTGRES_DB: theratrack
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/create-tables.sql:/docker-entrypoint-initdb.d/01-create-tables.sql
      - ./scripts/seed-data.sql:/docker-entrypoint-initdb.d/02-seed-data.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Iniciar Docker Compose

```bash
# Iniciar el contenedor
docker-compose up -d

# Ver logs
docker-compose logs -f postgres

# Detener el contenedor
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Esto borra los datos)
docker-compose down -v
```

### Conectar a un contenedor Docker existente

Si ya tienes un contenedor Docker de PostgreSQL corriendo:

1. **Encuentra el nombre del contenedor:**
   
   ```bash
   # Ver todos los contenedores (corriendo y detenidos)
   docker ps -a
   
   # Solo ver los nombres de los contenedores
   docker ps --format "{{.Names}}"
   
   # Ver contenedores con formato tabla (más legible)
   docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
   
   # Buscar solo contenedores de PostgreSQL
   docker ps -a | grep postgres
   
   # Si usas docker-compose
   docker-compose ps
   ```
   
   El nombre del contenedor aparece en la columna **NAMES** o **CONTAINER NAME**.
   
   Ejemplo de salida:
   ```
   NAMES                  IMAGE                 STATUS              PORTS
   theratrack-postgres    postgres:15-alpine    Up 2 hours          0.0.0.0:5432->5432/tcp
   ```
   
   En este caso, el nombre del contenedor es: `theratrack-postgres`

2. Obtén la IP del contenedor:
   ```bash
   docker inspect tu_contenedor_postgres | grep IPAddress
   ```

3. O mapea el puerto del contenedor a tu máquina local:
   ```bash
   # Si el contenedor no tiene el puerto mapeado, puedes recrearlo con:
   docker run -d \
     --name theratrack-postgres \
     -e POSTGRES_PASSWORD=tu_password \
     -e POSTGRES_DB=theratrack \
     -p 5432:5432 \
     postgres:15-alpine
   ```

4. Actualiza tu archivo `.env`:
   ```env
   DB_HOST=localhost  # Si el puerto está mapeado
   # O
   DB_HOST=172.17.0.2  # IP del contenedor (puede variar)
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=tu_password
   DB_DATABASE=theratrack
   ```

## Verificación

### Verificar conexión

1. Prueba la conexión desde la aplicación:
   ```bash
   # Inicia la aplicación
   npm run start:dev
   
   # Visita http://localhost:3000/ping-db
   ```

2. O conecta directamente con psql:
   ```bash
   docker exec -it tu_contenedor_postgres psql -U postgres -d theratrack
   ```

### Verificar tablas creadas

```sql
-- Dentro de psql
\dt

-- O
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Resumen

**El script de seed (`seed-data.ts`) NO crea las tablas**, solo inserta datos. Tienes dos opciones:

1. **TypeORM Synchronize**: Las tablas se crean automáticamente al iniciar la app (solo desarrollo)
2. **Script SQL**: Ejecuta `create-tables.sql` manualmente antes del seed

Para producción, siempre usa la Opción 2 (crear tablas manualmente) y desactiva `synchronize`.

