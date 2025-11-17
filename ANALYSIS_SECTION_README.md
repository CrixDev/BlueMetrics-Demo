# Analysis Section - Centro de Análisis de Gráficos

## 📊 Overview

La **Sección de Análisis** es un centro de visualización de datos que permite explorar todos los gráficos disponibles en la aplicación de manera organizada y visual. Proporciona una interfaz moderna con filtros dinámicos, búsqueda inteligente y animaciones fluidas.

## ✨ Características Principales

### 1. **Chart Registry System** 📋
- Sistema centralizado de registro de gráficos en `src/lib/charts-registry.js`
- Metadata completa para cada gráfico (título, descripción, categoría, tags, etc.)
- Fácil de extender: añade nuevos gráficos simplemente agregándolos al registro

### 2. **Filtros Inteligentes** 🔍
- **Búsqueda por texto**: Busca por nombre, descripción o tags
- **Filtro por categoría**: 8 categorías predefinidas con colores distintivos
- **Filtro por tags**: Selección múltiple de tags (lógica AND)
- **Solo destacados**: Ver únicamente los gráficos más importantes
- **Vista de cuadrícula/lista**: Cambia entre layouts según preferencia

### 3. **Categorías de Gráficos** 🏷️
- **Consumo**: Métricas de consumo de agua
- **Pozos**: Monitoreo y estado de pozos
- **Predicciones**: Análisis predictivo con IA
- **Balance Hídrico**: Flujo y distribución del agua
- **Rendimiento**: KPIs y métricas de performance
- **Alertas**: Sistema de notificaciones y alertas
- **Comparación**: Análisis comparativos entre períodos
- **Monitoreo**: Seguimiento en tiempo real

### 4. **Animaciones con Framer Motion** 🎭
- Entrada secuencial de tarjetas con delay escalonado
- Efecto hover con elevación y sombra
- Modal con backdrop blur y animación de escala
- Transiciones suaves en todos los componentes

### 5. **Chart Cards Interactivas** 🎴
- Diseño moderno con iconos dinámicos
- Badges de categoría y tags
- Botón "Ver Completo" para abrir en modal
- Botón de descarga (preparado para implementación)
- Preview con información del tipo de gráfico y fuente de datos

### 6. **Modal de Visualización** 🖼️
- Vista full-screen de gráficos
- Header con metadata completa
- Footer con información técnica
- Cierre con backdrop o botón X

## 🗂️ Estructura de Archivos

```
src/
├── lib/
│   └── charts-registry.js          # Registro central de gráficos
├── components/
│   └── analysis/
│       ├── ChartCard.jsx           # Tarjeta de gráfico con animaciones
│       ├── FilterPanel.jsx         # Panel de filtros lateral
│       └── ChartModal.jsx          # Modal de visualización completa
└── pages/
    └── AnalysisSectionPage.jsx     # Página principal
```

## 🚀 Cómo Usar

### Acceder a la Sección de Análisis

1. Navega a `/analisis` en la aplicación
2. O usa el menú lateral: **Análisis > Centro de Análisis**

### Filtrar Gráficos

1. **Buscar**: Escribe en la barra de búsqueda
2. **Categoría**: Haz clic en una categoría o "Todas"
3. **Tags**: Selecciona uno o más tags
4. **Vista**: Cambia entre cuadrícula o lista
5. **Destacados**: Activa el toggle para ver solo gráficos destacados

### Ver un Gráfico

1. Haz clic en "Ver Completo" en cualquier tarjeta
2. El gráfico se abrirá en un modal full-screen
3. Cierra con el botón X o haciendo clic fuera del modal

## 📝 Añadir Nuevos Gráficos

### Paso 1: Agregar al Registry

Edita `src/lib/charts-registry.js` y añade un nuevo objeto al array `CHARTS_REGISTRY`:

```javascript
{
  id: 'mi-nuevo-grafico',
  title: 'Mi Nuevo Gráfico',
  description: 'Descripción detallada de lo que muestra el gráfico',
  component: 'MiNuevoGrafico',  // Nombre del componente
  category: CHART_CATEGORIES.CONSUMPTION,  // Categoría
  tags: ['consumo', 'análisis', 'tiempo real'],  // Tags para búsqueda
  type: CHART_TYPES.LINE,  // Tipo de gráfico
  dataSource: 'API Backend',  // Fuente de datos
  featured: false,  // ¿Es destacado?
  icon: 'LineChart'  // Icono de lucide-react
}
```

### Paso 2: Importar el Componente

En `src/components/analysis/ChartModal.jsx`, importa tu componente:

```javascript
import MiNuevoGrafico from '../MiNuevoGrafico'
```

### Paso 3: Añadir al Component Map

Agrega tu componente al objeto `COMPONENT_MAP`:

```javascript
const COMPONENT_MAP = {
  // ... otros componentes
  MiNuevoGrafico,
}
```

¡Listo! Tu gráfico ahora aparecerá en la Sección de Análisis.

## 🎨 Personalización

### Colores de Categorías

Edita `CATEGORY_CONFIG` en `charts-registry.js` para cambiar colores:

```javascript
[CHART_CATEGORIES.CONSUMPTION]: {
  label: 'Consumo',
  color: 'bg-blue-500',        // Color principal
  bgColor: 'bg-blue-50',       // Color de fondo
  textColor: 'text-blue-700',  // Color de texto
  borderColor: 'border-blue-200'  // Color de borde
}
```

### Iconos Disponibles

Usa cualquier icono de `lucide-react`. Los más usados:
- `TrendingUp`, `TrendingDown`
- `BarChart3`, `LineChart`
- `Activity`, `Droplets`
- `Brain`, `Bell`
- `Wind`, `Table`

## 🔧 Componentes Técnicos

### ChartCard

Renderiza una tarjeta de gráfico con animaciones.

**Props:**
- `chart` (object): Objeto de gráfico del registry
- `onView` (function): Callback al hacer clic en "Ver Completo"
- `index` (number): Índice para animación escalonada

### FilterPanel

Panel lateral con todos los filtros.

**Props:**
- `searchQuery` (string)
- `onSearchChange` (function)
- `selectedCategory` (string | null)
- `onCategoryChange` (function)
- `selectedTags` (array)
- `onTagsChange` (function)
- `viewMode` (string): 'grid' | 'list'
- `onViewModeChange` (function)
- `showFeaturedOnly` (boolean)
- `onShowFeaturedChange` (function)
- `resultsCount` (number)

### ChartModal

Modal full-screen para visualizar gráficos.

**Props:**
- `chart` (object): Gráfico a mostrar
- `isOpen` (boolean): Estado del modal
- `onClose` (function): Callback para cerrar

## 📊 Gráficos Incluidos

### Actualmente Registrados:

1. **Comparación Semanal** - Compara consumo entre años
2. **Métricas Principales** - Dashboard de consumo y eficiencia
3. **Tabla de Consumo** - Datos detallados en tabla
4. **Tabla Comparativa** - Comparación semanal tabular
5. **Monitoreo de Pozos** - Estado y consumo de pozos
6. **Flujo de Balance** - Visualización animada del balance hídrico
7. **Análisis Predictivo** - Predicciones generadas por IA
8. **Sistema de Alertas** - Panel de alertas activas
9. **Resumen Dashboard** - Tarjetas de KPIs
10. **Componentes Genéricos** - ChartComponent y DashboardChart

## 🎯 Mejoras Futuras

### Funcionalidades Planeadas:
- [ ] Exportación de gráficos a PNG/PDF
- [ ] Compartir gráficos por link
- [ ] Favoritos personales del usuario
- [ ] Comparación lado a lado de gráficos
- [ ] Anotaciones en gráficos
- [ ] Temas de color personalizables
- [ ] Gráficos personalizados por usuario
- [ ] Dashboard personalizable con drag & drop

### Optimizaciones:
- [ ] Lazy loading de gráficos
- [ ] Virtualización para listas grandes
- [ ] Cache de gráficos visualizados
- [ ] PWA para uso offline

## 🐛 Troubleshooting

### "Componente no disponible"
- Verifica que el componente esté importado en `ChartModal.jsx`
- Asegúrate de que el nombre en `component` coincida con el import

### Gráfico no aparece en búsqueda
- Verifica los tags en el registry
- Asegúrate de que la categoría sea correcta
- Revisa que el objeto esté bien formado en `CHARTS_REGISTRY`

### Animaciones lentas
- Reduce el delay en las animaciones de `ChartCard`
- Considera usar `layout="position"` en Framer Motion

## 📚 Recursos

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

## 🤝 Contribuir

Para añadir nuevos gráficos o mejorar la funcionalidad:

1. Crea tu componente de gráfico
2. Añádelo al registry
3. Prueba que funcione en el modal
4. Documenta las props si es necesario
5. Actualiza este README

## 📄 License

Este proyecto es parte de BlueMetrics/AquaNet.

---

**¡Feliz análisis de datos! 📊✨**
