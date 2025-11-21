# 🌊 Sistema PTAR - Planta de Tratamiento de Aguas Residuales

## 📋 Descripción General

Sistema completo para gestión de datos de la Planta de Tratamiento de Aguas Residuales (PTAR), incluyendo:
- Tabla SQL única para todos los años
- Script generador de INSERTs desde Excel
- Configuración para Excel to SQL Converter
- Vistas SQL para análisis (anual, mensual, trimestral)

---

## 📂 Archivos Creados

### 1. **supabase_ptar_lecturas.sql** 
Archivo SQL principal que contiene:
- ✅ Definición de tabla `lecturas_ptar` con todos los campos
- ✅ Índices para optimización de consultas
- ✅ Triggers para actualización automática de timestamps
- ✅ Row Level Security (RLS) políticas
- ✅ Vistas de análisis:
  - `vista_ptar_resumen_anual` - Resumen por año
  - `vista_ptar_resumen_mensual` - Resumen por mes
  - `vista_ptar_resumen_trimestral` - Resumen por trimestre

### 2. **inserts_ptar_lecturas.sql**
Archivo SQL con los INSERTs generados desde el Excel:
- ✅ 32 registros de datos reales
- ✅ Rango de fechas: 2023-12-31 a 2024-01-31
- ✅ Manejo de conflictos con `ON CONFLICT DO UPDATE`
- ✅ Transacciones para inserción segura

### 3. **src/config/excelToSqlConfigs.js** (Actualizado)
Configuración agregada para PTAR:
- ✅ Campos de PTAR definidos (`camposPTAR`)
- ✅ Configuración `ptar` en `excelToSqlConfigs`
- ✅ Función helper `getPTARConfig()`
- ✅ Icono: ♻️
- ✅ Color: green

---

## 🗂️ Estructura de la Tabla

### Tabla: `lecturas_ptar`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | BIGSERIAL | ID único autoincremental |
| `fecha` | DATE | Fecha de la lectura (UNIQUE) |
| `hora` | VARCHAR(20) | Hora de la lectura |
| `medidor_entrada` | DECIMAL(12,2) | Medidor de entrada (m³) |
| `medidor_salida` | DECIMAL(12,2) | Medidor de salida (m³) |
| `ar` | DECIMAL(12,2) | Agua Residual (m³) |
| `at` | DECIMAL(12,2) | Agua Tratada (m³) |
| `recirculacion` | DECIMAL(12,2) | Agua de recirculación (m³) |
| `total_dia` | DECIMAL(12,2) | Total del día (m³) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

**Constraint único:** `unique_fecha_ptar` en campo `fecha`

---

## 🚀 Cómo Usar

### 1️⃣ Crear la Base de Datos

Ejecuta el archivo SQL en tu Supabase:

```bash
# Opción 1: Desde Supabase Dashboard
# - Ve a SQL Editor
# - Copia y pega el contenido de supabase_ptar_lecturas.sql
# - Ejecuta

# Opción 2: Desde CLI
supabase db push < supabase_ptar_lecturas.sql
```

### 2️⃣ Insertar Datos Iniciales

```bash
# Ejecuta los INSERTs
supabase db push < inserts_ptar_lecturas.sql
```

### 3️⃣ Verificar Instalación

```sql
-- Verificar tabla
SELECT * FROM lecturas_ptar LIMIT 10;

-- Ver resumen anual
SELECT * FROM vista_ptar_resumen_anual;

-- Ver resumen mensual
SELECT * FROM vista_ptar_resumen_mensual 
WHERE año = 2024;

-- Ver resumen trimestral
SELECT * FROM vista_ptar_resumen_trimestral 
WHERE año = 2024;
```

---

## 📊 Formato del Excel

El Excel de PTAR debe tener las siguientes columnas:

| Columna | Descripción | Ejemplo |
|---------|-------------|---------|
| Fecha | Fecha de la lectura | 2024-01-15 |
| Hora | Hora de la lectura | 9:00 AM |
| Medidor Entrada | Lectura del medidor de entrada | 58416.03 |
| Medidor salida | Lectura del medidor de salida | 2854730.0 |
| AR | Agua Residual del día | 150.5 |
| AT | Agua Tratada del día | 145.2 |
| Recirculacion | Agua de recirculación | 10.3 |
| Total día | Total procesado | 155.8 |

**Formato:** Horizontal (una fila por día)

---

## 🌐 Usar la Aplicación Web (Recomendado)

La forma más fácil de generar INSERTs es usar la aplicación web:

1. **Accede a la ruta:** `/excel-to-sql/ptar`
2. **Sube tu archivo Excel** con el formato correcto
3. **Descarga el SQL generado** o cópialo al portapapeles
4. **Ejecuta en Supabase**

### Ventajas de la App Web:
- ✅ No necesitas Python instalado
- ✅ Interfaz visual intuitiva
- ✅ Validación automática de datos
- ✅ Preview del SQL antes de descargar
- ✅ Estadísticas del procesamiento
- ✅ Manejo automático de conflictos (ON CONFLICT)

---

## 🔧 Generar INSERTs con Script Python

Si prefieres usar Python directamente:

### Script Python (Auto-generado)

```python
import pandas as pd
from datetime import datetime

excel_file = r'ruta\al\archivo\PTAR.xlsx'
output_file = r'inserts_ptar_nuevo.sql'

df = pd.read_excel(excel_file, sheet_name='Hoja 1')
df.columns = ['Fecha', 'Hora', 'Medidor_Entrada', 'Medidor_Salida', 
              'AR', 'AT', 'Recirculacion', 'Total_Dia']

df = df[df['Fecha'].notna()]
df['Fecha'] = pd.to_datetime(df['Fecha'], errors='coerce')
df = df[df['Fecha'].notna()]

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("BEGIN;\n\n")
    
    for index, row in df.iterrows():
        fecha = row['Fecha'].strftime('%Y-%m-%d')
        hora = f"'{row['Hora']}'" if pd.notna(row['Hora']) else 'NULL'
        medidor_entrada = row['Medidor_Entrada'] if pd.notna(row['Medidor_Entrada']) else 'NULL'
        medidor_salida = row['Medidor_Salida'] if pd.notna(row['Medidor_Salida']) else 'NULL'
        ar = row['AR'] if pd.notna(row['AR']) else 'NULL'
        at = row['AT'] if pd.notna(row['AT']) else 'NULL'
        recirculacion = row['Recirculacion'] if pd.notna(row['Recirculacion']) else 'NULL'
        total_dia = row['Total_Dia'] if pd.notna(row['Total_Dia']) else 'NULL'
        
        f.write(f"""INSERT INTO public.lecturas_ptar (fecha, hora, medidor_entrada, medidor_salida, ar, at, recirculacion, total_dia)
VALUES ('{fecha}', {hora}, {medidor_entrada}, {medidor_salida}, {ar}, {at}, {recirculacion}, {total_dia})
ON CONFLICT (fecha) DO UPDATE SET
    hora = EXCLUDED.hora,
    medidor_entrada = EXCLUDED.medidor_entrada,
    medidor_salida = EXCLUDED.medidor_salida,
    ar = EXCLUDED.ar,
    at = EXCLUDED.at,
    recirculacion = EXCLUDED.recirculacion,
    total_dia = EXCLUDED.total_dia;\n\n""")
    
    f.write("COMMIT;\n")

print(f"✅ INSERTs generados: {output_file}")
```

---

## 📈 Consultas Útiles

### Obtener eficiencia por mes
```sql
SELECT 
    periodo,
    total_agua_residual_m3,
    total_agua_tratada_m3,
    eficiencia_promedio_porcentaje
FROM vista_ptar_resumen_mensual
WHERE año = 2024
ORDER BY mes;
```

### Obtener datos diarios de un mes específico
```sql
SELECT 
    fecha,
    hora,
    ar AS agua_residual,
    at AS agua_tratada,
    CASE 
        WHEN ar > 0 THEN ROUND((at / ar) * 100, 2)
        ELSE NULL 
    END AS eficiencia_porcentaje
FROM lecturas_ptar
WHERE EXTRACT(YEAR FROM fecha) = 2024
  AND EXTRACT(MONTH FROM fecha) = 1
ORDER BY fecha;
```

### Obtener resumen trimestral con comparación
```sql
SELECT 
    año,
    trimestre_label,
    total_agua_tratada_m3,
    eficiencia_promedio_porcentaje,
    LAG(total_agua_tratada_m3) OVER (ORDER BY año, trimestre) AS trimestre_anterior,
    ROUND(
        ((total_agua_tratada_m3 - LAG(total_agua_tratada_m3) OVER (ORDER BY año, trimestre)) 
        / LAG(total_agua_tratada_m3) OVER (ORDER BY año, trimestre)) * 100, 
        2
    ) AS variacion_porcentaje
FROM vista_ptar_resumen_trimestral
ORDER BY año DESC, trimestre DESC;
```

---

## 🎯 Configuración de Excel to SQL Converter

En la aplicación web, la configuración de PTAR está disponible como:

```javascript
{
  tipo: 'ptar',
  año: 'todos',
  nombreTabla: 'lecturas_ptar',
  campos: ['fecha', 'hora', 'medidor_entrada', 'medidor_salida', 
           'ar', 'at', 'recirculacion', 'total_dia'],
  titulo: 'Excel a SQL - Lecturas Diarias PTAR',
  descripcion: 'Convierte datos de lecturas diarias de PTAR (formato horizontal) a sentencias SQL INSERT',
  nombreArchivoSql: 'inserts_ptar_lecturas.sql',
  icono: '♻️',
  color: 'green'
}
```

---

## ⚠️ Notas Importantes

1. **Tabla Única**: A diferencia de las tablas de agua y gas que están separadas por año, PTAR usa una sola tabla para todos los años.

2. **Constraint de Fecha**: Existe un constraint `UNIQUE` en el campo `fecha`, por lo que no se pueden insertar dos registros con la misma fecha.

3. **Vistas Automáticas**: Las vistas de resumen se actualizan automáticamente cuando se insertan nuevos datos.

4. **Row Level Security**: La tabla tiene RLS habilitado. Los usuarios autenticados pueden leer, insertar, actualizar y eliminar registros.

5. **Triggers**: El campo `updated_at` se actualiza automáticamente cuando se modifica un registro.

---

## 📝 Historial de Cambios

- **2024-11-21**: Creación inicial del sistema PTAR
  - Tabla SQL con todas las columnas y vistas
  - Script generador de INSERTs Python
  - Configuración de Excel to SQL
  - 32 registros iniciales (2023-12-31 a 2024-01-31)
  - **Aplicación web Excel to SQL** para PTAR (♻️)
  - Soporte para formato horizontal en `ExcelToSqlConverter`
  - Ruta web: `/excel-to-sql/ptar`

---

## 🔗 Archivos Relacionados

### SQL y Base de Datos
- `supabase_ptar_lecturas.sql` - Definición de tabla y vistas
- `inserts_ptar_lecturas.sql` - INSERTs de datos iniciales

### Aplicación Web
- `src/pages/ExcelToSql/ExcelToSqlPTAR.jsx` - Página Excel to SQL para PTAR
- `src/components/ExcelToSqlConverter.jsx` - Componente conversor (con soporte horizontal)
- `src/config/excelToSqlConfigs.js` - Configuración del convertidor
- `src/lib/datos_ptar.json` - Datos JSON para gráficas
- `src/pages/PTARPage.jsx` - Página web de visualización PTAR
- `src/App.jsx` - Ruta: `/excel-to-sql/ptar`

---

## 🆘 Soporte

Si necesitas ayuda o tienes preguntas sobre el sistema PTAR:
1. Revisa este README
2. Consulta los comentarios en los archivos SQL
3. Verifica las vistas de ejemplo
4. Ejecuta las consultas de prueba

---

**✅ Sistema PTAR completamente configurado y listo para usar** 🎉
