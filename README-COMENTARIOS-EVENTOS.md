# Sistema de Comentarios e Historial de Eventos para Pozos

## 📋 Descripción

Se han implementado dos nuevas funcionalidades para el sistema de gestión de pozos:

1. **Comentarios del Pozo**: Sistema de comentarios con operaciones CRUD completas
2. **Historial de Eventos**: Registro y seguimiento de eventos del pozo (mantenimiento, reparaciones, inspecciones, etc.)

## 🚀 Instalación y Configuración

### 1. Ejecutar las Migraciones en Supabase

Antes de usar las nuevas funcionalidades, debes ejecutar las migraciones SQL en tu base de datos de Supabase:

1. Abre tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **SQL Editor**
3. Abre el archivo `supabase-migrations.sql` que se encuentra en la raíz del proyecto
4. Copia y pega el contenido completo en el editor SQL
5. Haz clic en **Run** para ejecutar las migraciones

Esto creará:
- Tabla `well_comments` para comentarios
- Tabla `well_events` para eventos/historial
- Índices para optimizar las consultas
- Políticas RLS (Row Level Security) para acceso público
- Triggers para actualizar automáticamente las fechas de modificación

### 2. Verificar las Tablas

Después de ejecutar las migraciones, verifica que las tablas se crearon correctamente:

```sql
-- Verificar tabla de comentarios
SELECT * FROM well_comments LIMIT 5;

-- Verificar tabla de eventos
SELECT * FROM well_events LIMIT 5;
```

## 📦 Componentes Creados

### 1. WellComments.jsx
**Ubicación**: `src/components/WellComments.jsx`

**Características**:
- ✅ Listar todos los comentarios de un pozo
- ✅ Agregar nuevos comentarios
- ✅ Editar comentarios existentes
- ✅ Eliminar comentarios
- ✅ Mostrar autor y fecha de creación/edición
- ✅ Interfaz intuitiva con formularios modales

**Props**:
- `wellId` (number): ID del pozo

### 2. WellEventsHistory.jsx
**Ubicación**: `src/components/WellEventsHistory.jsx`

**Características**:
- ✅ Listar todos los eventos de un pozo
- ✅ Registrar nuevos eventos
- ✅ Editar eventos existentes
- ✅ Eliminar eventos
- ✅ Tipos de eventos: mantenimiento, parado, reparación, inspección, otro
- ✅ Estados: activo, completado, cancelado
- ✅ Cálculo automático de duración
- ✅ Colores distintivos por tipo de evento

**Props**:
- `wellId` (number): ID del pozo

## 🎨 Integración en WellDetailPage

Los componentes se han integrado en la página de detalle del pozo (`WellDetailPage.jsx`) en una nueva sección después de las alertas y recomendaciones.

```jsx
{/* Sección de Comentarios e Historial de Eventos */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <WellComments wellId={parseInt(id)} />
  <WellEventsHistory wellId={parseInt(id)} />
</div>
```

## 📊 Estructura de las Tablas

### Tabla: well_comments

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único (PK) |
| well_id | INTEGER | ID del pozo |
| comment_text | TEXT | Contenido del comentario |
| author_name | VARCHAR(255) | Nombre del autor |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

### Tabla: well_events

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único (PK) |
| well_id | INTEGER | ID del pozo |
| event_type | VARCHAR(50) | Tipo: mantenimiento, parado, reparacion, inspeccion, otro |
| event_status | VARCHAR(50) | Estado: activo, completado, cancelado |
| title | VARCHAR(255) | Título del evento |
| description | TEXT | Descripción detallada |
| start_date | TIMESTAMP | Fecha de inicio |
| end_date | TIMESTAMP | Fecha de fin (opcional) |
| author_name | VARCHAR(255) | Nombre del registrador |
| created_at | TIMESTAMP | Fecha de creación del registro |
| updated_at | TIMESTAMP | Fecha de última actualización |

## 🔧 Uso de las Funcionalidades

### Comentarios

1. **Ver comentarios**: Los comentarios se cargan automáticamente al abrir la página del pozo
2. **Agregar comentario**: 
   - Clic en botón "Agregar"
   - Llenar formulario (autor y comentario)
   - Clic en "Publicar"
3. **Editar comentario**: Clic en ícono de lápiz, modificar y guardar
4. **Eliminar comentario**: Clic en ícono de basura y confirmar

### Historial de Eventos

1. **Ver eventos**: Los eventos se cargan automáticamente ordenados por fecha
2. **Registrar evento**:
   - Clic en "Registrar Evento"
   - Seleccionar tipo y estado
   - Ingresar título y descripción
   - Establecer fechas de inicio y fin
   - Clic en "Guardar"
3. **Editar evento**: Clic en ícono de lápiz, modificar y actualizar
4. **Eliminar evento**: Clic en ícono de basura y confirmar

## 🎯 Características Técnicas

### Operaciones CRUD con Supabase

Todos los componentes utilizan el cliente de Supabase para realizar operaciones:

```javascript
// Ejemplo: Obtener comentarios
const { data, error } = await supabase
  .from('well_comments')
  .select('*')
  .eq('well_id', wellId)
  .order('created_at', { ascending: false })

// Ejemplo: Insertar evento
const { data, error } = await supabase
  .from('well_events')
  .insert([{ well_id, event_type, title, ... }])
  .select()
```

### Manejo de Estados

- Loading states durante operaciones
- Error handling con mensajes descriptivos
- Actualización automática de listas después de operaciones CRUD
- Validación de formularios

### UI/UX

- Diseño responsive (grid adaptativo)
- Colores distintivos por tipo de evento
- Badges para estados y tipos
- Iconos de Lucide React
- Formularios modales inline
- Confirmaciones para eliminaciones

## 🔒 Seguridad

Las tablas tienen habilitado RLS (Row Level Security) con políticas que permiten:
- ✅ Lectura pública
- ✅ Inserción pública
- ✅ Actualización pública
- ✅ Eliminación pública

**Nota**: En producción, deberías ajustar estas políticas según tus necesidades de autenticación y autorización.

## 📝 Datos de Ejemplo

El archivo de migraciones incluye datos de ejemplo para el Pozo 12:

**Comentarios**:
- "Revisión mensual completada. Todo en orden."
- "Se detectó una pequeña fuga en la tubería, programar mantenimiento."

**Eventos**:
- Mantenimiento preventivo de bomba (2023-02-10 a 2023-02-25)
- Reparación de tubería (2024-07-05 a 2024-07-08)

## 🐛 Troubleshooting

### Error: "relation well_comments does not exist"
**Solución**: Ejecuta las migraciones SQL en Supabase

### Error: "permission denied for table well_comments"
**Solución**: Verifica que las políticas RLS estén creadas correctamente

### Los componentes no se muestran
**Solución**: Verifica que los imports estén correctos en WellDetailPage.jsx

### Error al cargar datos
**Solución**: Verifica la configuración de Supabase en `.env`:
```
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key
```

## 🚀 Próximas Mejoras Sugeridas

- [ ] Implementar autenticación de usuarios
- [ ] Agregar notificaciones en tiempo real con Supabase Realtime
- [ ] Permitir adjuntar archivos a comentarios y eventos
- [ ] Agregar filtros y búsqueda en comentarios/eventos
- [ ] Implementar paginación para grandes volúmenes de datos
- [ ] Agregar menciones (@usuario) en comentarios
- [ ] Sistema de etiquetas/tags para eventos
- [ ] Exportar historial a PDF/Excel

## 📞 Soporte

Si tienes problemas o preguntas, revisa:
1. La consola del navegador para errores JavaScript
2. Los logs de Supabase en el dashboard
3. Las políticas RLS en Supabase
4. La configuración de variables de entorno

---

**Desarrollado para**: Aquanet - Sistema de Gestión de Pozos
**Fecha**: Diciembre 2024
