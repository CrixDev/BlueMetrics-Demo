# Sistema de Comentarios de Lecturas

## Descripción General

Se ha implementado un sistema completo de comentarios para las lecturas de puntos de medición en la página de **Análisis de Consumo** (`ConsumptionPage.jsx`). Este sistema permite agregar, editar y visualizar comentarios específicos para cada lectura semanal de cada punto de medición.

## Características Principales

### 1. **Tabla de Base de Datos**
- **Nombre**: `reading_comments`
- **Ubicación**: Supabase
- **Estructura**:
  - `id`: UUID (Primary Key)
  - `year`: INTEGER (Año de la lectura)
  - `week_number`: INTEGER (Número de semana)
  - `point_id`: VARCHAR(100) (ID del punto de medición)
  - `comment`: TEXT (Contenido del comentario)
  - `author`: VARCHAR(100) (Nombre del autor)
  - `created_at`: TIMESTAMPTZ
  - `updated_at`: TIMESTAMPTZ

### 2. **Restricción Única**
La tabla tiene una restricción única en la combinación `(year, week_number, point_id)`, lo que significa que:
- Solo puede haber **un comentario por punto de medición por semana**
- Si se intenta agregar un comentario duplicado, se actualiza el existente (UPSERT)

### 3. **Integración en la UI**

#### Columna "Comentario"
- Se **reemplazó** la columna "Tipo" por la columna "Comentario"
- Muestra el comentario existente (si hay) con el nombre del autor
- Botón de acción para agregar/editar comentarios

#### Dialog de Comentarios
- **Agregar**: Botón con icono `+` cuando no hay comentario
- **Editar**: Botón con icono de lápiz cuando ya existe un comentario
- Campos:
  - **Autor**: Campo de texto opcional (por defecto: "Anónimo")
  - **Comentario**: Campo de texto obligatorio (textarea)
- Validación: No permite guardar comentarios vacíos

## Instalación y Configuración

### 1. Ejecutar la Migración SQL

Ejecuta el archivo de migración en tu proyecto de Supabase:

```bash
# Archivo: supabase-migration-reading-comments.sql
```

**Pasos**:
1. Abre el Dashboard de Supabase
2. Ve a **SQL Editor**
3. Copia y pega el contenido del archivo `supabase-migration-reading-comments.sql`
4. Ejecuta la migración

### 2. Verificar Políticas RLS

La migración incluye políticas de Row Level Security (RLS) que permiten:
- ✅ Lectura a usuarios autenticados
- ✅ Inserción a usuarios autenticados
- ✅ Actualización a usuarios autenticados
- ✅ Eliminación a usuarios autenticados

### 3. Componentes Modificados

#### `ConsumptionTable.jsx`
- ✅ Importación de `Dialog` y `supabase`
- ✅ Estados para manejar comentarios
- ✅ Funciones para cargar y guardar comentarios
- ✅ Columna "Comentario" en lugar de "Tipo"
- ✅ Dialog para agregar/editar comentarios

#### `ConsumptionPage.jsx`
- ✅ Prop `selectedYear` pasado a `ConsumptionTable`

## Uso

### Agregar un Comentario

1. Navega a **Análisis de Consumo** → **Detalle por Punto de Medición**
2. Selecciona el año y la semana deseados
3. En la tabla, busca el punto de medición
4. Haz clic en el botón **+** en la columna "Comentario"
5. Ingresa tu nombre (opcional) y el comentario
6. Haz clic en **Guardar**

### Editar un Comentario

1. En la tabla, busca el punto de medición con comentario
2. Haz clic en el botón de **lápiz** en la columna "Comentario"
3. Modifica el comentario o el autor
4. Haz clic en **Guardar**

### Visualizar Comentarios

Los comentarios se muestran directamente en la tabla:
- **Texto del comentario**: Máximo 2 líneas (truncado con `line-clamp-2`)
- **Autor**: Mostrado debajo del comentario en texto más pequeño
- **Indicador de carga**: Spinner mientras se cargan los comentarios

## Ventajas del Diseño

### 1. **Eficiencia de Almacenamiento**
- ❌ **NO** se crean registros para todas las combinaciones posibles de año-semana-punto
- ✅ **SOLO** se almacenan comentarios cuando realmente existen
- Esto evita tener miles de registros NULL en la base de datos

### 2. **Relación Flexible**
- Los comentarios están relacionados por:
  - `year`: Año de la lectura
  - `week_number`: Número de semana
  - `point_id`: ID del punto de medición
- No hay claves foráneas rígidas, lo que permite flexibilidad

### 3. **Performance**
- Índices optimizados para consultas rápidas:
  - `idx_reading_comments_year_week`: Para filtrar por año y semana
  - `idx_reading_comments_point_id`: Para filtrar por punto
  - `idx_reading_comments_created_at`: Para ordenar por fecha

### 4. **UX Mejorada**
- Visualización inline de comentarios
- Edición rápida con Dialog
- Indicadores visuales claros (iconos diferentes para agregar vs editar)
- Feedback de carga y guardado

## Datos de Ejemplo

La migración incluye algunos comentarios de ejemplo:

```sql
INSERT INTO public.reading_comments (year, week_number, point_id, comment, author) VALUES
  (2024, 45, 'pozo_11', 'Lectura verificada, consumo normal', 'Juan Pérez'),
  (2024, 45, 'residencias_10_15', 'Incremento debido a evento especial en residencias', 'María García'),
  (2024, 46, 'pozo_12', 'Mantenimiento programado, lectura estimada', 'Carlos López');
```

Puedes eliminar o comentar estas líneas si no deseas datos de ejemplo.

## Troubleshooting

### Error: "relation 'reading_comments' does not exist"
- **Solución**: Ejecuta la migración SQL en Supabase

### Error: "permission denied for table reading_comments"
- **Solución**: Verifica que las políticas RLS estén habilitadas y configuradas correctamente

### Los comentarios no se cargan
- **Solución**: 
  1. Verifica la conexión a Supabase
  2. Revisa la consola del navegador para errores
  3. Verifica que el año y semana seleccionados tengan comentarios

### No puedo guardar comentarios
- **Solución**:
  1. Verifica que el comentario no esté vacío
  2. Revisa los permisos de la tabla en Supabase
  3. Verifica la consola del navegador para errores de red

## Próximas Mejoras (Opcional)

- [ ] Agregar opción para eliminar comentarios
- [ ] Historial de cambios de comentarios
- [ ] Notificaciones cuando se agregan comentarios
- [ ] Filtrar tabla por puntos con/sin comentarios
- [ ] Exportar comentarios a CSV/Excel
- [ ] Búsqueda de comentarios por texto
- [ ] Menciones de usuarios (@usuario)
- [ ] Adjuntar archivos a comentarios

## Conclusión

El sistema de comentarios de lecturas está completamente funcional y listo para usar. Permite una gestión eficiente de anotaciones específicas por lectura, mejorando la trazabilidad y documentación del sistema de monitoreo de consumo de agua.
