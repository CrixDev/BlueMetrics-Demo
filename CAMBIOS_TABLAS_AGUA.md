# Cambios en Tablas de Agua y Excel to SQL

## Fecha: 22 de Noviembre 2025

## Resumen de Cambios

Se han actualizado las tablas de agua y las configuraciones de Excel to SQL para corregir errores y mejorar la estructura.

---

## 1. Nuevas Tablas SQL Creadas

### Tablas de Lecturas:
- ✅ `Lecturas_Semana_Agua_2023` - Lecturas semanales de agua 2023
- ✅ `Lecturas_Semana_Agua_2024` - Lecturas semanales de agua 2024
- ✅ `Lecturas_Semana_Agua_2025` - Lecturas semanales de agua 2025

### Tablas de Consumo:
- ✅ `Lecturas_Semana_Agua_consumo_2023` - Consumo semanal de agua 2023
- ✅ `Lecturas_Semana_Agua_consumo_2024` - Consumo semanal de agua 2024
- ✅ `Lecturas_Semana_Agua_consumo_2025` - Consumo semanal de agua 2025

---

## 2. Cambios en la Estructura de Campos

### ❌ Campo Eliminado:
- **`total_pozos_riego`** - Este campo fue eliminado porque era incorrecto. No existe un medidor de "total pozos riego".

### ✅ Prefijo "L_" Agregado:
Todos los campos ahora tienen el prefijo `L_` para identificarlos como campos de lectura:

**Ejemplos:**
- `numero_semana` → `L_numero_semana`
- `fecha_inicio` → `L_fecha_inicio`
- `medidor_general_pozos` → `L_medidor_general_pozos`
- `pozo_11` → `L_pozo_11`
- etc.

### ✅ Campo Correcto:
- **`L_medidor_general_pozos`** - Representa el Medidor General de los pozos 7, 12, 11 y 14 / TOTAL POZOS

---

## 3. Archivos SQL Actualizados

### Archivos Creados:
```
supabase_Lecturas_Semana_Agua_2023.sql
supabase_Lecturas_Semana_Agua_2024.sql
supabase_Lecturas_Semana_Agua_2025.sql
supabase_Lecturas_Semana_Agua_consumo_2023.sql
supabase_Lecturas_Semana_Agua_consumo_2024.sql
supabase_Lecturas_Semana_Agua_consumo_2025.sql
```

### Archivos Antiguos (Pueden eliminarse):
```
supabase_lecturas_Semanales_Agua2023.sql
supabase_lecturas_Semanales_Agua2024.sql
supabase_lecturas_Semanales_Agua2025.sql
```

---

## 4. Configuración Excel to SQL Actualizada

### Archivo: `src/config/excelToSqlConfigs.js`

#### Cambios Realizados:

1. **Array `camposAgua` actualizado:**
   - ✅ Todos los campos tienen prefijo `L_`
   - ❌ Eliminado `total_pozos_riego`
   - ✅ Total de 166 campos (antes 167)

2. **Nuevas configuraciones agregadas:**
   - `agua_2023` → Tabla: `Lecturas_Semana_Agua_2023`
   - `agua_consumo_2023` → Tabla: `Lecturas_Semana_Agua_consumo_2023`
   - `agua_2024` → Tabla: `Lecturas_Semana_Agua_2024`
   - `agua_consumo_2024` → Tabla: `Lecturas_Semana_Agua_consumo_2024`
   - `agua_2025` → Tabla: `Lecturas_Semana_Agua_2025`
   - `agua_consumo_2025` → Tabla: `Lecturas_Semana_Agua_consumo_2025`

---

## 5. Estructura Completa de Campos

### Campos Principales (Total: 166):

#### Metadata (3):
- L_numero_semana
- L_fecha_inicio
- L_fecha_fin

#### Pozos de Agua Potable (6):
- L_medidor_general_pozos *(Medidor General pozos 7, 12, 11 y 14)*
- L_pozo_11
- L_pozo_14
- L_pozo_12
- L_pozo_7
- L_pozo_3

#### Pozos de Riego (3):
- L_pozo_4_riego
- L_pozo_8_riego
- L_pozo_15_riego

#### Circuito 8" Campus (69 campos)
#### Circuito 6" Residencias (12 campos)
#### Circuito 4" A7-CE (10 campos)
#### Circuito Planta Física (9 campos)
#### Circuito Megacentral (2 campos)
#### Riego PTAR (6 campos)
#### Purgas y Evaporación (12 campos)
#### Agua de Ciudad (17 campos)

---

## 6. Cómo Usar Excel to SQL

### Para Lecturas:
1. Ir a la página correspondiente (ej: Excel to SQL Agua 2023)
2. Subir archivo Excel con formato vertical
3. El sistema generará INSERTs para `Lecturas_Semana_Agua_2023`

### Para Consumo:
1. Ir a la página de consumo correspondiente
2. Subir archivo Excel con formato vertical
3. El sistema generará INSERTs para `Lecturas_Semana_Agua_consumo_2023`

---

## 7. Notas Importantes

⚠️ **IMPORTANTE:**
- Las tablas antiguas (`lecturas_semana2023`, `lecturas_semana2024`, `lecturas_semana2025`) ya NO se usan
- Usar las nuevas tablas con prefijo `L_` en todos los campos
- El campo `total_pozos_riego` NO existe y NO debe usarse
- `L_medidor_general_pozos` es el campo correcto para el medidor general

✅ **Características de las nuevas tablas:**
- Row Level Security (RLS) habilitado
- Triggers para actualizar `L_updated_at` automáticamente
- Índices para optimización de consultas
- Políticas de seguridad para usuarios autenticados

---

## 8. Próximos Pasos

1. ✅ Eliminar archivos SQL antiguos (opcional)
2. ✅ Ejecutar los nuevos scripts SQL en Supabase
3. ✅ Actualizar cualquier código que referencie las tablas antiguas
4. ✅ Probar la funcionalidad de Excel to SQL con las nuevas configuraciones

---

**Fecha de actualización:** 22 de Noviembre 2025
**Responsable:** Sistema de IA - Cascade
