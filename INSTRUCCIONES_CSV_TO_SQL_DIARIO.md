# 📊 CSV a SQL - Lecturas Diarias

## 🎯 Descripción

Esta funcionalidad convierte archivos CSV/Excel de lecturas diarias de agua en sentencias SQL INSERT listas para ejecutar en la base de datos PostgreSQL/Supabase.

## 🚀 Cómo usar

### 1. Crear la tabla en la base de datos

Primero, ejecuta el script `lecturas_diarias_create_table.sql` en tu base de datos:

```bash
psql -U tu_usuario -d tu_base_de_datos -f lecturas_diarias_create_table.sql
```

O copia y pega el contenido del archivo en el SQL Editor de Supabase.

### 2. Acceder a la funcionalidad

1. Abre la aplicación BlueMetrics
2. En el menú lateral, ve a **"Administración de Datos"**
3. Haz clic en **"CSV a SQL Diario"**
4. La ruta es: `http://localhost:5173/csv-to-sql-daily`

### 3. Preparar tu archivo CSV

El archivo CSV debe tener el siguiente formato:

#### Estructura de columnas (18 columnas en total):

| Columna | Nombre Original | Nombre en DB | Tipo | Ejemplo |
|---------|----------------|--------------|------|---------|
| A | mes año | mes_anio | VARCHAR | "mayo 2022" |
| B | dia hora | dia_hora | VARCHAR | "Lun01 09:00" |
| C | Consumo | consumo | DECIMAL | 540 |
| D | General pozos | general_pozos | DECIMAL | 10,064 |
| E | Pozo 3 | pozo_3 | DECIMAL | 220,989 |
| F | Pozo 8 | pozo_8 | DECIMAL | 512,603.20 |
| G | Pozo 15 | pozo_15 | DECIMAL | 306,556.90 |
| H | Pozo 4 | pozo_4 | DECIMAL | 0 |
| I | A y D | a_y_d | DECIMAL | 0 |
| J | Campus 8"" | campus_8 | DECIMAL | 13,724 |
| K | A7-CC | a7_cc | DECIMAL | 769,833.58 |
| L | Megacentral | megacentral | DECIMAL | 62,882 |
| M | Planta Física | planta_fisica | DECIMAL | 16,673 |
| N | Residencias | residencias | DECIMAL | 40,032 |
| O | Pozo7 | pozo7 | DECIMAL | 0 |
| P | Pozo11 | pozo11 | DECIMAL | 0 |
| Q | Pozo 12 | pozo_12 | DECIMAL | 0 |
| R | Pozo 14 | pozo_14 | DECIMAL | 0 |

#### Formato de números:
- ✅ Acepta: `64,373` (coma como decimal) → se convierte a `64.373`
- ✅ Acepta: `509,983.40` (coma y punto) → se convierte a `509983.40`
- ✅ Acepta: `0` o vacío → se convierte a `NULL`
- ✅ Acepta: números con comillas dobles `"18,404"`

### 4. Procesar el archivo

1. Haz clic en **"Seleccionar archivo"**
2. Elige tu archivo CSV o Excel (.csv, .xlsx, .xls)
3. (Opcional) Modifica el nombre de la tabla si deseas usar otro nombre
4. Haz clic en **"⚡ Generar SQL"**

### 5. Obtener el resultado

Una vez procesado, verás:

- ✅ Mensaje de éxito con el número de registros procesados
- 📊 Estadísticas del proceso
- 💻 El código SQL generado en el panel derecho

### 6. Usar el SQL generado

Tienes dos opciones:

#### Opción A: Copiar al portapapeles
1. Haz clic en **"📋 Copiar"**
2. Pega el código en el SQL Editor de Supabase o tu cliente SQL favorito
3. Ejecuta el script

#### Opción B: Descargar archivo
1. Haz clic en **"💾 Descargar"**
2. Se descargará un archivo `inserts_lecturas_diarias.sql`
3. Ejecuta el archivo en tu base de datos:

```bash
psql -U tu_usuario -d tu_base_de_datos -f inserts_lecturas_diarias.sql
```

## 📝 Ejemplo de SQL generado

```sql
-- INSERT para tabla lecturas_diarias
-- Total de registros: 1337
-- Generado automáticamente

BEGIN;

INSERT INTO public.lecturas_diarias (
  mes_anio, dia_hora, consumo, general_pozos, pozo_3, pozo_8, 
  pozo_15, pozo_4, a_y_d, campus_8, a7_cc, megacentral, 
  planta_fisica, residencias, pozo7, pozo11, pozo_12, pozo_14
) VALUES
  ('mayo 2022', 'Lun01 09:00', 540, 10064, 220989, 512603.20, 306556.90, 
   0, 0, 13724, 769833.58, 62882, 16673, 40032, 0, 0, 0, 0),
  ('mayo 2022', 'mar02 9:00', 530, 10117, 220989, 512858.80, 306602.20, 
   0, 0, 13737, 769905.84, 62920, 16695, 40043, 0, 0, 0, 0),
  -- ... más registros
;

COMMIT;
```

## ⚠️ Notas importantes

1. **Conversión de decimales**: El sistema convierte automáticamente las comas a puntos decimales
2. **Valores NULL**: Los ceros y valores vacíos se convierten a NULL en la base de datos
3. **Formato de fechas**: Respeta el formato original del CSV (mes año y dia hora como texto)
4. **Transacciones**: El SQL generado usa `BEGIN/COMMIT` para garantizar atomicidad
5. **Duplicados**: No hay validación de duplicados, asegúrate de no insertar datos repetidos

## 🔍 Troubleshooting

### Error: "El archivo está vacío"
- Verifica que el CSV tenga datos después del header
- Asegúrate de que el archivo no esté corrupto

### Error: "No se encontraron datos válidos para procesar"
- Revisa que las columnas A y B tengan datos (mes_anio y dia_hora)
- Verifica que no sea solo el header sin datos

### Los números no se convierten correctamente
- El sistema acepta formatos con coma decimal (español)
- Si tienes problemas, verifica que los números no tengan caracteres especiales

### Error al ejecutar el SQL en la base de datos
- Verifica que la tabla `lecturas_diarias` exista
- Asegúrate de tener permisos de INSERT
- Revisa que los tipos de datos coincidan con la definición de la tabla

## 📚 Archivos relacionados

- **Componente**: `src/pages/CsvToSqlDailyPage.jsx`
- **Ruta**: `/csv-to-sql-daily`
- **CREATE TABLE**: `lecturas_diarias_create_table.sql`
- **Documentación**: Este archivo

## 🎨 Características

- ✅ Soporte para CSV y Excel (.csv, .xlsx, .xls)
- ✅ Conversión automática de formatos numéricos
- ✅ Manejo inteligente de valores NULL
- ✅ Generación optimizada de SQL (un solo INSERT)
- ✅ Interfaz intuitiva con feedback visual
- ✅ Descarga de archivo SQL
- ✅ Copiar al portapapeles
- ✅ Estadísticas del proceso
- ✅ Validación de datos
- ✅ Compatible con PostgreSQL/Supabase

## 👨‍💻 Desarrollador

Adaptado de la funcionalidad Excel to SQL existente para el formato horizontal de lecturas diarias.
