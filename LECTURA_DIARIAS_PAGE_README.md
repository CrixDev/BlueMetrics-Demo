# 📊 Página de Lecturas Diarias

## 🎯 Descripción

La página **Lecturas Diarias** es una interfaz completa para visualizar, analizar y gestionar los datos de consumo diario de agua almacenados en la tabla `lecturas_diarias` de Supabase.

## 🚀 Acceso

- **URL**: `http://localhost:5173/lecturas-diarias`
- **Menú**: Gestión Hídrica → Lecturas Diarias
- **Componente**: `src/pages/DailyReadingsPage.jsx`

## ✨ Características

### 📈 Visualización de Datos

1. **Estadísticas Generales**
   - Total de registros
   - Consumo total
   - Consumo promedio
   - Consumo máximo
   - Consumo mínimo

2. **Gráficos Interactivos**
   - **Consumo Diario**: Gráfico de línea mostrando el consumo de los últimos 30 registros
   - **General Pozos**: Gráfico de línea con lecturas del medidor general
   - **Promedio por Pozo**: Gráfico de barras con el promedio de cada pozo
   - **Distribución por Zona**: Gráfico de pastel mostrando la distribución entre zonas

3. **Tabla de Datos**
   - Tabla completa con todas las lecturas
   - Paginación (20 registros por página)
   - Columnas principales: Mes/Año, Día/Hora, Consumo, General Pozos, Campus 8, A7-CC, Megacentral, Planta Física, Residencias

### 🔍 Funcionalidades

#### Filtros
- **Filtro por mes**: Dropdown para filtrar lecturas por mes/año específico
- Opción "Todos los meses" para ver todos los registros
- Contador de registros encontrados

#### Acciones
- **🔄 Actualizar**: Recargar datos desde Supabase
- **📥 Exportar CSV**: Descargar todos los datos filtrados en formato CSV
- Navegación por páginas en la tabla

#### Navegación
- **Paginación automática**: 20 registros por página
- Botones Anterior/Siguiente
- Indicador de página actual
- Contador de registros mostrados

### 📊 Gráficos Implementados

#### 1. Consumo Diario (Línea)
- Muestra tendencia de consumo en los últimos 30 registros
- Eje X: Fecha (día/hora)
- Eje Y: Consumo
- Color: Azul (#0088FE)

#### 2. General Pozos (Línea)
- Muestra lecturas del medidor general en los últimos 30 registros
- Eje X: Fecha (día/hora)
- Eje Y: Lectura
- Color: Verde (#00C49F)

#### 3. Promedio por Pozo (Barras)
- Calcula el promedio de lectura de cada pozo
- Filtra pozos con valor > 0
- Colores variados para cada barra
- Incluye: Pozos 3, 4, 7, 8, 11, 12, 14, 15

#### 4. Distribución por Zona (Pastel)
- Muestra proporción de consumo por zona
- Incluye: Campus 8, A7-CC, Megacentral, Planta Física, Residencias, A y D
- Etiquetas con nombre y valor
- Colores diferenciados

### 🔄 Estados de la Aplicación

#### Loading (Cargando)
```
┌─────────────────────────┐
│   🔄 Loading spinner    │
│ "Cargando lecturas..."  │
└─────────────────────────┘
```

#### Error
```
┌─────────────────────────────────┐
│ ❌ Error al cargar datos        │
│ [Mensaje de error detallado]    │
│ [Botón: Reintentar]             │
└─────────────────────────────────┘
```

#### Datos Cargados
- Estadísticas en cards
- Filtros activos
- Gráficos renderizados
- Tabla con datos paginados

## 💾 Estructura de Datos

### Campos de la tabla `lecturas_diarias`:

```javascript
{
  id: number,              // ID único
  mes_anio: string,        // "mayo 2022"
  dia_hora: string,        // "Lun01 09:00"
  consumo: decimal,        // 540
  general_pozos: decimal,  // 10064
  pozo_3: decimal,         // 220989
  pozo_8: decimal,         // 512603.20
  pozo_15: decimal,        // 306556.90
  pozo_4: decimal,         // 0
  a_y_d: decimal,          // 0
  campus_8: decimal,       // 13724
  a7_cc: decimal,          // 769833.58
  megacentral: decimal,    // 62882
  planta_fisica: decimal,  // 16673
  residencias: decimal,    // 40032
  pozo7: decimal,          // 0
  pozo11: decimal,         // 0
  pozo_12: decimal,        // 0
  pozo_14: decimal,        // 0
  created_at: timestamp,
  updated_at: timestamp
}
```

## 🛠️ Tecnologías Utilizadas

- **React**: Framework principal
- **Supabase**: Base de datos y backend
- **Recharts**: Librería de gráficos
- **Lucide React**: Iconos
- **Tailwind CSS**: Estilos

## 📝 Funciones Principales

### `fetchLecturas()`
Obtiene todos los datos de la tabla `lecturas_diarias` ordenados por fecha de creación descendente.

```javascript
const { data, error } = await supabase
  .from('lecturas_diarias')
  .select('*')
  .order('created_at', { ascending: false });
```

### `exportarCSV()`
Genera y descarga un archivo CSV con todos los datos filtrados.

### Filtros y Cálculos
- **mesesUnicos**: Extrae meses únicos para el dropdown
- **lecturasFiltradas**: Aplica filtro de mes seleccionado
- **estadisticas**: Calcula totales, promedios, máximos y mínimos
- **datosConsumo**: Prepara datos para gráficos de línea
- **datosPozos**: Calcula promedios por pozo
- **datosZonas**: Calcula distribución por zona

## 🎨 Diseño

### Paleta de Colores
- **Azul**: #0088FE (Consumo)
- **Verde**: #00C49F (General Pozos)
- **Amarillo**: #FFBB28
- **Naranja**: #FF8042
- **Índigo**: #8884d8
- **Verde claro**: #82ca9d
- **Amarillo suave**: #ffc658
- **Rojo suave**: #ff7c7c

### Layout
```
┌─────────────────────────────────────────┐
│ Header + Botones (Actualizar, Exportar) │
├─────────────────────────────────────────┤
│ Filtros (Por mes)                       │
├─────────────────────────────────────────┤
│ Estadísticas (5 cards)                  │
├───────────────────┬─────────────────────┤
│ Gráfico Consumo   │ Gráfico Gen. Pozos  │
├───────────────────┼─────────────────────┤
│ Gráfico Pozos     │ Gráfico Zonas       │
├─────────────────────────────────────────┤
│ Tabla de Datos (paginada)               │
└─────────────────────────────────────────┘
```

## 🔐 Permisos de Supabase

Asegúrate de tener los permisos correctos en Supabase:

```sql
-- Permitir SELECT a usuarios autenticados
GRANT SELECT ON public.lecturas_diarias TO authenticated;

-- O para pruebas (permitir acceso público)
GRANT SELECT ON public.lecturas_diarias TO anon;
```

## 🐛 Troubleshooting

### Error: "No se pueden cargar los datos"
- Verifica que la tabla `lecturas_diarias` existe en Supabase
- Revisa las credenciales en `.env` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Verifica permisos de la tabla

### Los gráficos no se muestran
- Asegúrate de que hay datos en la tabla
- Verifica que los datos no son todos NULL
- Revisa la consola del navegador para errores

### La exportación CSV no funciona
- Verifica que tienes datos filtrados
- Revisa permisos del navegador para descargas

### La paginación no funciona correctamente
- Verifica que `registrosPorPagina` está definido correctamente
- Revisa que los datos filtrados tienen longitud > 0

## 📚 Archivos Relacionados

- **Página**: `src/pages/DailyReadingsPage.jsx`
- **Ruta**: `/lecturas-diarias` en `App.jsx`
- **Sidebar**: Enlace en `dashboard-sidebar.jsx`
- **CREATE TABLE**: `lecturas_diarias_create_table.sql`
- **Importador CSV**: `src/pages/CsvToSqlDailyPage.jsx`

## 🚀 Próximas Mejoras

- [ ] Filtro por rango de fechas
- [ ] Comparación entre períodos
- [ ] Gráficos de tendencias
- [ ] Alertas de consumo anormal
- [ ] Exportar gráficos como imagen
- [ ] Vista de detalles por registro
- [ ] Búsqueda por texto
- [ ] Ordenamiento por columnas
- [ ] Dashboard personalizado

## 📞 Soporte

Para más información sobre la estructura de datos, consulta:
- `lecturas_diarias_create_table.sql` - Definición de la tabla
- `INSTRUCCIONES_CSV_TO_SQL_DIARIO.md` - Cómo importar datos
