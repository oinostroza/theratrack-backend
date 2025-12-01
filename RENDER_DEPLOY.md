# Guía de Despliegue en Render

Esta guía explica cómo desplegar TheraTrack Backend en Render.com.

## Configuración en Render

### 1. Configuración del Servicio

- **Tipo**: Web Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Environment**: Node

### 2. Variables de Entorno

Configura las siguientes variables de entorno en el dashboard de Render:

```env
# Base de datos PostgreSQL (Render proporciona estas variables automáticamente si usas su PostgreSQL)
DB_HOST=tu-host-postgres
DB_PORT=5432
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-password
DB_DATABASE=theratrack

# JWT
JWT_SECRET=tu-secret-key-super-segura-cambiar-en-produccion

# OpenAI (opcional, solo si usas análisis de emociones)
OPENAI_API_KEY=tu-openai-api-key

# Aplicación
NODE_ENV=production
PORT=10000
```

**Nota**: Render asigna automáticamente el puerto a través de la variable `PORT`. Asegúrate de que tu aplicación use `process.env.PORT`.

### 3. Base de Datos PostgreSQL en Render

1. Crea un servicio PostgreSQL en Render
2. Render te proporcionará automáticamente las variables de entorno:
   - `DATABASE_URL` (formato completo de conexión)
   - O variables individuales: `DB_HOST`, `DB_PORT`, etc.

**Opción A: Usar DATABASE_URL**

Si Render te da `DATABASE_URL`, puedes actualizar `app.module.ts` para usarla:

```typescript
// En app.module.ts
const databaseUrl = configService.get('DATABASE_URL');
if (databaseUrl) {
  // Parse DATABASE_URL
  const dbUrl = new URL(databaseUrl);
  return {
    type: 'postgres',
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port),
    username: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    // ...
  };
}
```

**Opción B: Usar variables individuales**

Usa las variables `DB_HOST`, `DB_PORT`, etc. como están configuradas.

### 4. Solución de Problemas Comunes

#### Error: ERESOLVE could not resolve

**Solución**: Ya está resuelto con el archivo `.npmrc` que incluye `legacy-peer-deps=true`.

Si aún tienes problemas, puedes cambiar el Build Command a:
```
npm install --legacy-peer-deps && npm run build
```

#### Error: Port already in use

**Solución**: Asegúrate de que `main.ts` use `process.env.PORT`:

```typescript
await app.listen(process.env.PORT ?? 3000);
```

#### Error: Database connection failed

**Solución**: 
1. Verifica que las variables de entorno estén correctamente configuradas
2. Asegúrate de que el servicio PostgreSQL esté corriendo
3. Verifica que `synchronize: false` en producción (ya está configurado)

#### Error: Cannot find module

**Solución**: Asegúrate de que el Build Command compile correctamente:
```
npm install && npm run build
```

### 5. Crear Tablas en Producción

**IMPORTANTE**: En producción, `synchronize` debe estar en `false`. Necesitas crear las tablas manualmente.

**Opción A: Usar el script SQL**

1. Conéctate a tu base de datos PostgreSQL de Render
2. Ejecuta el script `scripts/create-tables.sql`

**Opción B: Usar migraciones (recomendado para producción)**

Considera usar migraciones de TypeORM para gestionar el esquema de la base de datos.

### 6. Comandos Útiles

**Ver logs en Render:**
- Ve al dashboard de Render → Tu servicio → Logs

**Reiniciar el servicio:**
- Dashboard → Tu servicio → Manual Deploy → Clear build cache & deploy

**Verificar variables de entorno:**
- Dashboard → Tu servicio → Environment

### 7. Checklist de Despliegue

- [ ] Servicio creado en Render
- [ ] Variables de entorno configuradas
- [ ] Base de datos PostgreSQL creada y conectada
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm run start:prod`
- [ ] Tablas creadas en la base de datos
- [ ] `.npmrc` incluido en el repositorio (para resolver ERESOLVE)
- [ ] `NODE_ENV=production` configurado
- [ ] `synchronize: false` en producción (verificado en código)

### 8. Verificación Post-Despliegue

1. Verifica que el servicio esté corriendo (status: Live)
2. Prueba el endpoint de ping: `https://tu-app.onrender.com/ping-db`
3. Prueba el login: `https://tu-app.onrender.com/auth/login`

### 9. Notas Importantes

- **Free Tier**: Render puede poner tu servicio en "sleep" después de 15 minutos de inactividad. La primera petición después del sleep puede tardar ~30 segundos.
- **Build Time**: El build puede tardar varios minutos, especialmente la primera vez.
- **Logs**: Los logs están disponibles en tiempo real en el dashboard.
- **Variables de Entorno**: Cualquier cambio en variables de entorno requiere un redeploy.

## Troubleshooting

### El servicio no inicia

1. Revisa los logs en Render
2. Verifica que todas las variables de entorno estén configuradas
3. Verifica que la base de datos esté accesible
4. Asegúrate de que el puerto sea dinámico (`process.env.PORT`)

### Error de conexión a la base de datos

1. Verifica las credenciales en las variables de entorno
2. Asegúrate de que el servicio PostgreSQL esté en la misma región
3. Verifica que no haya restricciones de firewall

### Build falla

1. Revisa los logs de build
2. Verifica que `.npmrc` esté en el repositorio
3. Intenta limpiar el cache: Manual Deploy → Clear build cache

