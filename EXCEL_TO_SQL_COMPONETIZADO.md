# 📊 Excel to SQL Componetizado

Sistema modular y reutilizable para convertir archivos Excel a sentencias SQL INSERT para diferentes tipos de medidores y años.

## 🎯 Características

- ✅ **Componetizado**: Un solo componente base (`ExcelToSqlConverter`) reutilizable
- ✅ **Soporte Multi-año**: 2023, 2024, 2025
- ✅ **Soporte Multi-tipo**: Agua y Gas
- ✅ **Configuración Centralizada**: Todas las configuraciones en un solo archivo
- ✅ **Fácil Extensión**: Agregar nuevos años o tipos solo requiere actualizar la configuración

## 📁 Estructura de Archivos

```
src/
├── components/
│   └── ExcelToSqlConverter.jsx         # Componente base reutilizable
├── config/
│   └── excelToSqlConfigs.js           # Configuraciones centralizadas
└── pages/
    └── ExcelToSql/
        ├── ExcelToSqlAgua2023.jsx     # Página para agua 2023
        ├── ExcelToSqlAgua2024.jsx     # Página para agua 2024
        ├── ExcelToSqlAgua2025.jsx     # Página para agua 2025
        ├── ExcelToSqlGas2023.jsx      # Página para gas 2023
        ├── ExcelToSqlGas2024.jsx      # Página para gas 2024
        └── ExcelToSqlGas2025.jsx      # Página para gas 2025
```

## 🔧 Configuración

### Archivo de Configuración (`excelToSqlConfigs.js`)

Contiene dos arrays de campos:
- **`camposAgua`**: Lista de campos para lecturas de agua
- **`camposGas`**: Lista de campos para lecturas de gas

Y un objeto `excelToSqlConfigs` con configuraciones para cada combinación tipo-año:

```javascript
{
  agua_2023: {
    tipo: 'agua',
    año: 2023,
    nombreTabla: 'lecturas_semana2023',
    campos: camposAgua,
    titulo: 'Excel a SQL - Lecturas Semanales de Agua 2023',
    descripcion: '...',
    nombreArchivoSql: 'inserts_lecturas_agua_2023.sql',
    icono: '💧',
    color: 'blue'
  },
  // ... más configuraciones
}
```

### Propiedades de Configuración

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `tipo` | string | Tipo de lectura: 'agua' o 'gas' |
| `año` | number | Año de las lecturas |
| `nombreTabla` | string | Nombre de la tabla destino en la BD |
| `campos` | Array<string> | Lista ordenada de campos de la tabla |
| `titulo` | string | Título mostrado en la página |
| `descripcion` | string | Descripción de la funcionalidad |
| `nombreArchivoSql` | string | Nombre del archivo SQL al descargar |
| `icono` | string | Emoji del tipo (💧 para agua, 🔥 para gas) |
| `color` | string | Esquema de color: 'blue', 'orange', 'green' |

## 🚀 Uso

### 1. Usar una Configuración Existente

```jsx
import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlAgua2024 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.agua_2024} />;
};

export default ExcelToSqlAgua2024;
```

### 2. Agregar un Nuevo Año

Para agregar un nuevo año (ej: 2026):

**a. Actualizar `excelToSqlConfigs.js`:**
```javascript
// Agregar nueva configuración
agua_2026: {
  tipo: 'agua',
  año: 2026,
  nombreTabla: 'lecturas_semana2026',
  campos: camposAgua,
  titulo: 'Excel a SQL - Lecturas Semanales de Agua 2026',
  descripcion: 'Convierte datos de lecturas semanales de agua (formato vertical) a sentencias SQL INSERT',
  nombreArchivoSql: 'inserts_lecturas_agua_2026.sql',
  icono: '💧',
  color: 'blue'
}
```

**b. Crear nueva página:**
```jsx
// ExcelToSqlAgua2026.jsx
import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlAgua2026 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.agua_2026} />;
};

export default ExcelToSqlAgua2026;
```

**c. Agregar ruta en `App.jsx`:**
```jsx
import ExcelToSqlAgua2026 from './pages/ExcelToSql/ExcelToSqlAgua2026'

// En las rutas:
<Route path="/excel-to-sql/agua/2026" element={<ExcelToSqlAgua2026 />} />
```

**d. Agregar al sidebar (opcional):**
```jsx
{ id: "excel-agua-2026", label: "Excel → SQL Agua 2026", path: "/excel-to-sql/agua/2026", icon: FileSpreadsheet }
```

### 3. Agregar un Nuevo Tipo de Medidor

Para agregar un nuevo tipo (ej: electricidad):

**a. Definir campos en `excelToSqlConfigs.js`:**
```javascript
const camposElectricidad = [
  'numero_semana',
  'fecha_inicio',
  'fecha_fin',
  'medidor_1',
  'medidor_2',
  // ... más campos
];
```

**b. Agregar configuraciones para cada año:**
```javascript
electricidad_2024: {
  tipo: 'electricidad',
  año: 2024,
  nombreTabla: 'lecturas_semana_electricidad_2024',
  campos: camposElectricidad,
  titulo: 'Excel a SQL - Lecturas Semanales de Electricidad 2024',
  descripcion: 'Convierte datos de lecturas semanales de electricidad...',
  nombreArchivoSql: 'inserts_lecturas_electricidad_2024.sql',
  icono: '⚡',
  color: 'green'
}
```

**c. Crear páginas, agregar rutas y actualizar sidebar** como se indicó anteriormente.

## 📋 Rutas Disponibles

### Agua
- `/excel-to-sql/agua/2023` - Agua 2023
- `/excel-to-sql/agua/2024` - Agua 2024
- `/excel-to-sql/agua/2025` - Agua 2025

### Gas
- `/excel-to-sql/gas/2023` - Gas 2023
- `/excel-to-sql/gas/2024` - Gas 2024
- `/excel-to-sql/gas/2025` - Gas 2025

### Compatibilidad
- `/excel-to-sql` - Ruta original (mantiene compatibilidad, usa ExcelToSqlPage antiguo)

## 🎨 Esquemas de Color

El componente soporta tres esquemas de color:

- **`blue`**: Azul/Índigo (usado para agua 💧)
- **`orange`**: Naranja/Rojo (usado para gas 🔥)
- **`green`**: Verde/Esmeralda (disponible para otros tipos)

## 📝 Formato de Excel Esperado

El sistema espera archivos Excel con formato **vertical**:

```
| Campo             | Semana 1 | Semana 2 | Semana 3 |
|-------------------|----------|----------|----------|
| numero_semana     | 1        | 2        | 3        |
| fecha_inicio      | 2024-01-01 | 2024-01-08 | 2024-01-15 |
| fecha_fin         | 2024-01-07 | 2024-01-14 | 2024-01-21 |
| medidor_1         | 1000     | 1100     | 1200     |
| ...               | ...      | ...      | ...      |
```

- **Columna A**: Nombres de los campos
- **Columnas B, C, D...**: Cada columna es una semana diferente

## 🔄 Funcionalidades del Componente

- ✅ Selección de archivo Excel (.xlsx, .xls)
- ✅ Validación de formato
- ✅ Conversión automática de fechas de Excel
- ✅ Generación de un INSERT único con múltiples VALUES
- ✅ Preview del SQL generado con syntax highlighting
- ✅ Copiar al portapapeles
- ✅ Descargar como archivo .sql
- ✅ Estadísticas de conversión
- ✅ Manejo de errores

## 🛠️ Funciones Helper

```javascript
// Obtener configuración específica
import { getConfig } from './config/excelToSqlConfigs';
const config = getConfig('agua', 2024);

// Obtener todas las configuraciones de un tipo
import { getConfigsByTipo } from './config/excelToSqlConfigs';
const aguaConfigs = getConfigsByTipo('agua');

// Obtener todas las configuraciones de un año
import { getConfigsByAño } from './config/excelToSqlConfigs';
const configs2024 = getConfigsByAño(2024);
```

## 📊 Tablas de Base de Datos

### Agua
- `lecturas_semana2023` - Lecturas de agua 2023
- `lecturas_semana2024` - Lecturas de agua 2024
- `lecturas_semana2025` - Lecturas de agua 2025

### Gas
- `lecturas_semanales_gas_2023` - Lecturas de gas 2023
- `lecturas_semanales_gas_2024` - Lecturas de gas 2024
- `lecturas_semanales_gas_2025` - Lecturas de gas 2025

## 🎯 Ventajas del Sistema Componetizado

1. **Mantenibilidad**: Un solo componente base para mantener
2. **Escalabilidad**: Fácil agregar nuevos años o tipos
3. **Consistencia**: Misma UX en todas las versiones
4. **DRY**: No duplicar código
5. **Configuración Centralizada**: Cambios globales en un solo lugar
6. **Type Safety**: Configuraciones tipadas y validadas
7. **Extensibilidad**: Fácil agregar nuevas características

## 🔍 Ejemplo Completo

```jsx
// 1. Configuración (excelToSqlConfigs.js)
const config = {
  tipo: 'agua',
  año: 2024,
  nombreTabla: 'lecturas_semana2024',
  campos: camposAgua,
  titulo: 'Excel a SQL - Lecturas Semanales de Agua 2024',
  descripcion: 'Convierte datos de lecturas semanales de agua...',
  nombreArchivoSql: 'inserts_lecturas_agua_2024.sql',
  icono: '💧',
  color: 'blue'
};

// 2. Página (ExcelToSqlAgua2024.jsx)
import ExcelToSqlConverter from '../../components/ExcelToSqlConverter';
import { excelToSqlConfigs } from '../../config/excelToSqlConfigs';

const ExcelToSqlAgua2024 = () => {
  return <ExcelToSqlConverter config={excelToSqlConfigs.agua_2024} />;
};

export default ExcelToSqlAgua2024;

// 3. Ruta (App.jsx)
<Route path="/excel-to-sql/agua/2024" element={<ExcelToSqlAgua2024 />} />

// 4. Sidebar (dashboard-sidebar.jsx)
{ 
  id: "excel-agua-2024", 
  label: "Excel → SQL Agua 2024", 
  path: "/excel-to-sql/agua/2024", 
  icon: FileSpreadsheet 
}
```

---

**Creado**: Nov 2024  
**Última actualización**: Nov 2024  
**Versión**: 1.0
