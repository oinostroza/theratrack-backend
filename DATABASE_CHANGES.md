# 📊 Cambios en la Base de Datos - Sistema de Mascotas

## Resumen

Se han agregado nuevas entidades y tablas para el sistema de cuidado de mascotas (PetTrack) al backend existente de TheraTrack.

## 🆕 Nuevas Entidades Creadas

### 1. Pet (Mascota)
- **Tabla**: `pets`
- **ID**: UUID
- **Campos**:
  - `id` (UUID, PK)
  - `name` (VARCHAR)
  - `species` (VARCHAR)
  - `breed` (VARCHAR, nullable)
  - `age` (INTEGER, nullable)
  - `owner_id` (INTEGER, FK → user.id)
  - `photo_url` (TEXT, nullable)
  - `created_at`, `updated_at`

### 2. CareSession (Sesión de Cuidado)
- **Tabla**: `care_sessions`
- **ID**: UUID
- **Campos**:
  - `id` (UUID, PK)
  - `pet_id` (UUID, FK → pets.id)
  - `sitter_id` (INTEGER, FK → user.id)
  - `start_time` (TIMESTAMP)
  - `end_time` (TIMESTAMP, nullable)
  - `status` (ENUM: 'scheduled', 'in-progress', 'completed', 'cancelled')
  - `notes` (TEXT, nullable)
  - `created_at`, `updated_at`

### 3. SessionReport (Reporte de Sesión)
- **Tabla**: `session_reports`
- **ID**: UUID
- **Campos**:
  - `id` (UUID, PK)
  - `care_session_id` (UUID, FK → care_sessions.id)
  - `pet_id` (UUID, FK → pets.id)
  - `sitter_id` (INTEGER, FK → user.id)
  - `report_date` (DATE)
  - `activities` (TEXT[])
  - `notes` (TEXT)
  - `mood` (ENUM: 'happy', 'calm', 'anxious', 'playful', 'tired', nullable)
  - `feeding` (JSONB, nullable)
  - `medication` (JSONB, nullable)
  - `created_at`, `updated_at`

### 4. Location (Ubicación)
- **Tabla**: `locations`
- **ID**: UUID
- **Campos**:
  - `id` (UUID, PK)
  - `name` (VARCHAR)
  - `address` (TEXT)
  - `latitude` (DECIMAL(10,8))
  - `longitude` (DECIMAL(11,8))
  - `pet_id` (UUID, FK → pets.id, nullable)
  - `owner_id` (INTEGER, FK → user.id)
  - `type` (ENUM: 'home', 'vet', 'grooming', 'park', 'other')
  - `notes` (TEXT, nullable)
  - `created_at`, `updated_at`

### 5. Photo (Foto)
- **Tabla**: `photos`
- **ID**: UUID
- **Campos**:
  - `id` (UUID, PK)
  - `url` (TEXT)
  - `thumbnail_url` (TEXT, nullable)
  - `pet_id` (UUID, FK → pets.id, nullable)
  - `care_session_id` (UUID, FK → care_sessions.id, nullable)
  - `session_report_id` (UUID, FK → session_reports.id, nullable)
  - `uploaded_by` (INTEGER, FK → user.id)
  - `description` (TEXT, nullable)
  - `tags` (TEXT[], nullable)
  - `created_at`, `updated_at`

## 🔄 Cambios en Entidades Existentes

### User (Usuario)
- **Cambio**: Se agregaron nuevos roles al enum `UserRole`:
  - `OWNER = 'owner'`
  - `SITTER = 'sitter'`
- **Roles disponibles ahora**: `patient`, `therapist`, `owner`, `sitter`

## 📝 Scripts Actualizados

### 1. `create-tables.sql`
- ✅ Agregadas las 5 nuevas tablas
- ✅ Actualizado CHECK constraint de `user.role` para incluir 'owner' y 'sitter'
- ✅ Agregados índices para mejorar rendimiento
- ✅ Agregados comentarios en las tablas

### 2. `seed.service.ts`
- ✅ Actualizado `createTables()` para incluir nuevas tablas
- ✅ Actualizado `seedUsers()` para incluir usuarios owner y sitter
- ✅ Nuevo método `seedPets()` - Crea 8 mascotas de ejemplo
- ✅ Nuevo método `seedCareSessions()` - Crea 15 sesiones de cuidado
- ✅ Nuevo método `seedSessionReports()` - Crea reportes para sesiones completadas
- ✅ Nuevo método `seedLocations()` - Crea 5 ubicaciones de ejemplo
- ✅ Nuevo método `seedPhotos()` - Crea 4 fotos de ejemplo
- ✅ Nuevo método `seedPetsData()` - Ejecuta todos los seeds de mascotas
- ✅ Actualizado `seedAll()` para incluir datos de mascotas

### 3. `seed.controller.ts`
- ✅ Nuevo endpoint `POST /seed/pets` - Seed solo mascotas
- ✅ Nuevo endpoint `POST /seed/pets-data` - Seed completo de datos de mascotas
- ✅ Actualizado endpoint `POST /seed/init` - Ahora incluye datos de mascotas

### 4. `app.module.ts`
- ✅ Agregadas las nuevas entidades al array de `entities` en TypeORM

## 🗂️ Archivos Creados

1. `src/entities/pet.entity.ts`
2. `src/entities/care-session.entity.ts`
3. `src/entities/session-report.entity.ts`
4. `src/entities/location.entity.ts`
5. `src/entities/photo.entity.ts`

## 🗂️ Archivos Modificados

1. `src/entities/user.entity.ts` - Agregados roles owner y sitter
2. `src/entities/index.ts` - Exportadas nuevas entidades
3. `scripts/create-tables.sql` - Agregadas nuevas tablas
4. `src/modules/seed/seed.service.ts` - Agregados métodos de seed
5. `src/modules/seed/seed.controller.ts` - Agregados endpoints
6. `src/app.module.ts` - Registradas nuevas entidades

## 🚀 Cómo Usar

### Inicializar Base de Datos Completa
```bash
POST /seed/init
```
Crea todas las tablas y seeda datos de terapia + mascotas.

### Solo Crear Tablas
```bash
POST /seed/tables
```

### Seed Solo Datos de Mascotas
```bash
POST /seed/pets-data
```

### Seed Solo Mascotas
```bash
POST /seed/pets
```

## 📊 Datos de Seed Incluidos

### Usuarios
- 3 usuarios con rol `owner`
- 2 usuarios con rol `sitter`

### Mascotas
- 8 mascotas de ejemplo (perros y gatos)

### Sesiones de Cuidado
- 15 sesiones distribuidas en diferentes fechas y estados

### Reportes de Sesiones
- Reportes para sesiones completadas con actividades, alimentación y medicación

### Ubicaciones
- 5 ubicaciones (casa, veterinaria, parque, peluquería)

### Fotos
- 4 fotos de ejemplo

## ⚠️ Notas Importantes

1. **IDs**: Las nuevas entidades usan UUID para sus IDs, mientras que User usa INTEGER (SERIAL)
2. **Relaciones**: Todas las relaciones con User usan INTEGER (owner_id, sitter_id, uploaded_by)
3. **Extensiones**: Se requiere la extensión `uuid-ossp` de PostgreSQL (se crea automáticamente en createTables)
4. **Compatibilidad**: Los cambios son compatibles con el sistema existente de terapia

## ✅ Verificación

Para verificar que todo está correcto:
1. Ejecutar `POST /seed/init`
2. Verificar que no haya errores
3. Verificar que las tablas se crearon correctamente
4. Verificar que los datos de seed se insertaron

