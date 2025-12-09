# 📤 Configuración para Subida de Excel - Instrucciones

## 🎯 Objetivo
Permitir que los clientes suban archivos Excel y los datos se inserten automáticamente en la base de datos sin necesidad de configuraciones adicionales.

## ⚙️ Configuración Inicial (Solo una vez)

### Paso 1: Ejecutar Script SQL en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **SQL Editor** (en el menú lateral)
3. Crea una nueva query
4. Copia y pega el contenido del archivo `supabase_setup_bulk_insert.sql`
5. Haz clic en **Run** para ejecutar el script

### Paso 2: Verificar la Configuración

Después de ejecutar el script, verifica que todo esté correcto:

```sql
-- Verificar que la función existe
SELECT routine_name 
FROM information_schema.routines
WHERE routine_name = 'insert_bulk_data';

-- Verificar políticas RLS
SELECT tablename, policyname 
FROM pg_policies
WHERE tablename LIKE '%Lecturas%';
```

## 🚀 Uso para Clientes

Una vez configurado, los clientes pueden:

1. **Ir a la sección "Importación Excel/SQL"** en el sidebar
2. **Seleccionar el tipo de lectura** (Agua 2023, Gas 2024, etc.)
3. **Cargar su archivo Excel** con el formato correcto
4. **Hacer clic en "Generar SQL"** para procesar el archivo
5. **Hacer clic en "Insertar en Base de Datos"** para subir los datos automáticamente

## 📋 Formato de Excel Requerido

### Para Lecturas de Agua (Formato Vertical)

```
| Nombres de Campos    | Semana 1 | Semana 2 | Semana 3 | ...
|---------------------|----------|----------|----------|----
| L_numero_semana     | 1        | 2        | 3        | ...
| L_fecha_inicio      | 2023-01-01 | 2023-01-08 | ... | ...
| L_fecha_fin         | 2023-01-07 | 2023-01-14 | ... | ...
| L_pozo_11           | 1234.5   | 1245.2   | ...     | ...
| ...                 | ...      | ...      | ...     | ...
```

### Para Lecturas de Gas (Formato Vertical)

```
| Nombres de Campos    | Semana 1 | Semana 2 | Semana 3 | ...
|---------------------|----------|----------|----------|----
| numero_semana       | 1        | 2        | 3        | ...
| fecha_inicio        | 2023-01-01 | 2023-01-08 | ... | ...
| fecha_fin           | 2023-01-07 | 2023-01-14 | ... | ...
| domo_cultural       | 1234.5   | 1245.2   | ...     | ...
| ...                 | ...      | ...      | ...     | ...
```

### Para Lecturas PTAR (Formato Horizontal)

```
| fecha      | hora  | medidor_entrada | medidor_salida | ar   | at   | ...
|------------|-------|-----------------|----------------|------|------|----
| 2023-01-01 | 08:00 | 1234.5          | 1200.3         | 34.2 | 30.1 | ...
| 2023-01-01 | 16:00 | 1245.2          | 1210.5         | 34.7 | 30.5 | ...
| ...        | ...   | ...             | ...            | ...  | ...  | ...
```

## 🔒 Seguridad

- ✅ Solo usuarios **autenticados** pueden insertar datos
- ✅ La función usa **SECURITY DEFINER** para ejecutarse con permisos seguros
- ✅ Los nombres de tablas están **sanitizados** para prevenir SQL injection
- ✅ Las políticas RLS protegen las tablas de accesos no autorizados

## 🐛 Solución de Problemas

### Error: "Could not find the table in the schema cache"

**Causa:** La tabla no está expuesta en la API de Supabase.

**Solución:** Ejecuta el script `supabase_setup_bulk_insert.sql` que crea las políticas RLS necesarias.

### Error: "Could not find the function insert_bulk_data"

**Causa:** La función RPC no fue creada correctamente.

**Solución:** 
1. Ve al SQL Editor de Supabase
2. Ejecuta el script `supabase_setup_bulk_insert.sql`
3. Verifica que la función existe con la query de verificación

### Error: "Permission denied"

**Causa:** El usuario no tiene permisos para insertar en la tabla.

**Solución:** Verifica que las políticas RLS estén creadas correctamente:

```sql
-- Ver políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'Lecturas_Semana_Agua_2023';
```

### Los datos no se insertan pero no hay error

**Causa:** Puede haber un problema con el formato de los datos.

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca mensajes de error en la consola
3. Verifica que los nombres de columnas coincidan exactamente con la tabla

## 📞 Soporte

Si después de seguir estas instrucciones sigues teniendo problemas:

1. Verifica los logs en la consola del navegador (F12)
2. Revisa los logs de Supabase en el Dashboard
3. Asegúrate de que las tablas existen y tienen la estructura correcta
4. Verifica que el usuario esté autenticado correctamente

## 🎉 ¡Listo!

Una vez configurado, los clientes podrán subir archivos Excel sin problemas y los datos se insertarán automáticamente en la base de datos.
