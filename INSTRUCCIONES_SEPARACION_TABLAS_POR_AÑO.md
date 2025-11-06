# Instrucciones: Separación de Tablas por Año

## 📋 Resumen de Cambios

Se ha implementado la funcionalidad para separar las tablas de lecturas semanales por año. Ahora cada año tiene su propia tabla en Supabase:

- **2025**: `lecturas_semana` (tabla original, sin sufijo)
- **2024**: `lecturas_semana2024` (nueva tabla)

## 🗄️ Paso 1: Crear la Tabla en Supabase

Necesitas ejecutar el script SQL en tu instancia de Supabase para crear la tabla del año 2024.

### Cómo ejecutar:

1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor** en el menú lateral
3. Crea una nueva query
4. Copia y pega el contenido del archivo: `supabase_lecturas_semana2024.sql`
5. Ejecuta el script (botón "Run" o Ctrl+Enter)

El script creará:
- ✅ Tabla `lecturas_semana2024` con la misma estructura que `lecturas_semana`
- ✅ Índices para optimizar las consultas
- ✅ Trigger para actualizar automáticamente el campo `updated_at`
- ✅ Políticas de seguridad (RLS) para usuarios autenticados
- ✅ Dos semanas de ejemplo con datos de 2024

## 🔧 Archivos Modificados

### 1. **Nuevos Archivos**

#### `supabase_lecturas_semana2024.sql`
Script SQL para crear la tabla del año 2024.

#### `src/utils/tableHelpers.js`
Utilidad que contiene:
- `getTableNameByYear(year)`: Retorna el nombre de tabla según el año
- `AVAILABLE_YEARS`: Array con los años disponibles ['2024', '2025']
- `DEFAULT_YEAR`: Año por defecto ('2025')

### 2. **Archivos Modificados**

#### `src/pages/AddWeeklyReadingsPage.jsx`
**Cambios implementados:**
- ✅ Importación de utilidades de `tableHelpers`
- ✅ Nuevo estado `selectedYear` para el año seleccionado
- ✅ Selector de año en la UI (dropdown)
- ✅ Todas las queries a Supabase ahora usan `getTableNameByYear(selectedYear)`
- ✅ Al cambiar el año, se reinicia la selección de semana

**Ubicación de cambios:**
- Línea ~23: Import de tableHelpers
- Línea ~27: Estado selectedYear
- Línea ~44: useEffect actualizado para recargar al cambiar año
- Líneas ~51-55: fetchExistingWeeks usa tabla dinámica
- Líneas ~89-94: loadWeekReadings usa tabla dinámica
- Líneas ~187-201: saveReadings usa tabla dinámica
- Líneas ~243-248: copyPreviousWeekReadings usa tabla dinámica
- Líneas ~313-321: createNewWeek usa tabla dinámica
- Líneas ~398-414: Selector de año en la UI

#### `src/pages/ConsumptionPage.jsx`
**Cambios implementados:**
- ✅ Importación de utilidades de `tableHelpers`
- ✅ Nuevo estado `selectedYearForReadings` para lecturas semanales
- ✅ Selector de año en la sección de tablas detalladas
- ✅ Query a Supabase usa `getTableNameByYear(selectedYearForReadings)`
- ✅ Al cambiar el año, se recargan las lecturas semanales

**Ubicación de cambios:**
- Línea ~31: Import de tableHelpers
- Línea ~41: Estado selectedYearForReadings
- Línea ~58: useEffect actualizado para recargar al cambiar año
- Líneas ~65-70: fetchWeeklyReadings usa tabla dinámica
- Líneas ~570-588: Título y selector de año en la UI

## 📊 Cómo Funciona

### Patrón de Nombres de Tabla

```javascript
// Año 2025 (por defecto) → 'lecturas_semana'
getTableNameByYear('2025') // 'lecturas_semana'

// Año 2024 → 'lecturas_semana2024'
getTableNameByYear('2024') // 'lecturas_semana2024'

// Futuros años seguirán el patrón: 'lecturas_semana' + año
getTableNameByYear('2026') // 'lecturas_semana2026'
```

### Flujo de Uso

1. **En AddWeeklyReadingsPage:**
   - Usuario selecciona el año (2024 o 2025)
   - Sistema carga las semanas disponibles de la tabla correspondiente
   - Usuario ingresa/edita lecturas
   - Sistema guarda en la tabla del año seleccionado

2. **En ConsumptionPage:**
   - Usuario selecciona el año en la sección de "Detalle por Punto de Medición"
   - Sistema carga las lecturas semanales de la tabla correspondiente
   - Se muestran las tablas con los datos del año seleccionado

## 🚀 Agregar Más Años

Para agregar soporte para un nuevo año (ejemplo: 2023):

1. **Crear script SQL:**
   ```bash
   # Copiar el archivo y renombrarlo
   cp supabase_lecturas_semana2024.sql supabase_lecturas_semana2023.sql
   ```

2. **Modificar el script:**
   - Cambiar todas las referencias de `lecturas_semana2024` a `lecturas_semana2023`
   - Actualizar los comentarios
   - Actualizar las fechas de ejemplo

3. **Ejecutar en Supabase** (ver Paso 1)

4. **Agregar el año a la configuración:**
   ```javascript
   // En src/utils/tableHelpers.js
   export const AVAILABLE_YEARS = ['2023', '2024', '2025']
   ```

## ✅ Verificación

Después de ejecutar el script SQL, verifica que:

1. ✅ La tabla `lecturas_semana2024` existe en Supabase
2. ✅ Las políticas RLS están habilitadas
3. ✅ Existen 2 semanas de ejemplo en la tabla
4. ✅ El selector de año aparece en AddWeeklyReadingsPage
5. ✅ El selector de año aparece en ConsumptionPage
6. ✅ Al cambiar de año, se cargan datos diferentes

### Comandos de Verificación SQL:

```sql
-- Verificar que la tabla existe
SELECT * FROM public.lecturas_semana2024 LIMIT 5;

-- Verificar las semanas de ejemplo
SELECT numero_semana, fecha_inicio, fecha_fin 
FROM public.lecturas_semana2024 
ORDER BY numero_semana;

-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename = 'lecturas_semana2024';
```

## 🎯 Características Implementadas

- ✅ Tabla separada por año (lecturas_semana2024)
- ✅ Selector de año en AddWeeklyReadingsPage
- ✅ Selector de año en ConsumptionPage
- ✅ Queries dinámicas según año seleccionado
- ✅ Misma estructura de datos para todas las tablas
- ✅ Políticas de seguridad (RLS) configuradas
- ✅ Datos de ejemplo para pruebas
- ✅ Utilidad reutilizable para futuros años

## 📝 Notas Importantes

1. **Por defecto, el año 2025 usa la tabla sin sufijo** (`lecturas_semana`)
2. **Otros años usan sufijo** (ejemplo: `lecturas_semana2024`)
3. **Los datos NO se copian automáticamente** entre años
4. **Cada año mantiene su propio historial** de semanas
5. **La numeración de semanas se reinicia** cada año (empieza en 1)

## 🐛 Troubleshooting

### Error: "relation 'lecturas_semana2024' does not exist"
- **Solución:** Ejecuta el script SQL en Supabase (Paso 1)

### No se cargan datos al cambiar de año
- **Solución:** Verifica que la tabla del año seleccionado tiene datos

### Error de permisos RLS
- **Solución:** Verifica que las políticas RLS estén habilitadas y correctamente configuradas

## 📧 Soporte

Si encuentras algún problema durante la implementación, verifica:
1. Que el script SQL se ejecutó sin errores
2. Que las políticas RLS están activas
3. Que el usuario está autenticado
4. Los logs de la consola del navegador

---

**Implementado por:** Cascade AI
**Fecha:** Noviembre 2025
**Versión:** 1.0
