/**
 * Central Chart Registry
 * This file contains metadata for all charts in the application
 * Making it easy to add new charts and manage them in one place
 */

// Chart categories
export const CHART_CATEGORIES = {
  CONSUMPTION: 'consumption',
  WELLS: 'wells',
  PREDICTIONS: 'predictions',
  BALANCE: 'balance',
  PERFORMANCE: 'performance',
  ALERTS: 'alerts',
  COMPARISON: 'comparison',
  MONITORING: 'monitoring'
}

// Chart types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  AREA: 'area',
  COMPOSED: 'composed',
  FLOW: 'flow',
  TABLE: 'table',
  CARDS: 'cards'
}

/**
 * Chart Registry
 * Each chart has:
 * - id: unique identifier
 * - title: display name
 * - description: what the chart shows
 * - component: the React component to render
 * - category: main category
 * - tags: searchable keywords
 * - type: chart type (line, bar, etc.)
 * - dataSource: where the data comes from
 * - featured: whether to show in featured section
 * - icon: lucide-react icon name
 */
export const CHARTS_REGISTRY = [
  // Consumption Charts
  {
    id: 'weekly-comparison',
    title: 'Comparación Semanal',
    description: 'Compara el consumo semanal entre años con estadísticas detalladas y análisis de tendencias',
    component: 'WeeklyComparisonChart',
    category: CHART_CATEGORIES.COMPARISON,
    tags: ['semanal', 'comparación', 'consumo', 'tendencias', 'años'],
    type: CHART_TYPES.COMPOSED,
    dataSource: 'Lecturas Semanales',
    featured: true,
    icon: 'TrendingUp'
  },
  {
    id: 'main-consumption-metrics',
    title: 'Métricas Principales de Consumo',
    description: 'Dashboard principal con consumo diario, semanal, mensual y eficiencia del sistema',
    component: 'MainConsumptionMetrics',
    category: CHART_CATEGORIES.CONSUMPTION,
    tags: ['consumo', 'métricas', 'eficiencia', 'dashboard', 'principal'],
    type: CHART_TYPES.COMPOSED,
    dataSource: 'Datos del Pozo 12',
    featured: true,
    icon: 'Droplets'
  },
  {
    id: 'consumption-table',
    title: 'Tabla de Consumo Detallada',
    description: 'Tabla interactiva con datos de consumo detallados por período',
    component: 'ConsumptionTable',
    category: CHART_CATEGORIES.CONSUMPTION,
    tags: ['tabla', 'consumo', 'detalle', 'datos'],
    type: CHART_TYPES.TABLE,
    dataSource: 'Base de datos',
    featured: false,
    icon: 'Table'
  },
  {
    id: 'weekly-comparison-table',
    title: 'Tabla Comparativa Semanal',
    description: 'Tabla con comparación semanal de consumo entre diferentes períodos',
    component: 'WeeklyComparisonTable',
    category: CHART_CATEGORIES.COMPARISON,
    tags: ['tabla', 'semanal', 'comparación'],
    type: CHART_TYPES.TABLE,
    dataSource: 'Lecturas Semanales',
    featured: false,
    icon: 'FileText'
  },

  // Well Monitoring Charts
  {
    id: 'well-monitoring',
    title: 'Monitoreo de Pozos',
    description: 'Visualización completa del estado y consumo de pozos con filtros dinámicos',
    component: 'WellMonitoringCharts',
    category: CHART_CATEGORIES.WELLS,
    tags: ['pozos', 'monitoreo', 'estado', 'visualización'],
    type: CHART_TYPES.COMPOSED,
    dataSource: 'Datos del Pozo 12',
    featured: true,
    icon: 'Activity'
  },

  // Water Balance Charts
  {
    id: 'water-balance-flow',
    title: 'Flujo de Balance Hídrico',
    description: 'Visualización animada del flujo de distribución del agua desde fuentes hasta destinos',
    component: 'WaterBalanceFlow',
    category: CHART_CATEGORIES.BALANCE,
    tags: ['balance', 'flujo', 'distribución', 'agua', 'fuentes'],
    type: CHART_TYPES.FLOW,
    dataSource: 'Dashboard Data',
    featured: true,
    icon: 'Wind'
  },

  // Predictive Analytics
  {
    id: 'predictive-analytics',
    title: 'Análisis Predictivo',
    description: 'Predicciones de consumo generadas por IA con nivel de confianza y patrones detectados',
    component: 'PredictiveAnalyticsPanel',
    category: CHART_CATEGORIES.PREDICTIONS,
    tags: ['predicción', 'ia', 'machine learning', 'futuro', 'tendencias'],
    type: CHART_TYPES.COMPOSED,
    dataSource: 'Modelo IA',
    featured: true,
    icon: 'Brain'
  },

  // Alerts and Recommendations
  {
    id: 'alerts-system',
    title: 'Sistema de Alertas',
    description: 'Panel de alertas activas del sistema con diferentes niveles de prioridad',
    component: 'AlertsRecommendationsSystem',
    category: CHART_CATEGORIES.ALERTS,
    tags: ['alertas', 'notificaciones', 'críticas', 'sistema'],
    type: CHART_TYPES.CARDS,
    dataSource: 'Dashboard Data',
    featured: true,
    icon: 'Bell'
  },

  // Dashboard Summary
  {
    id: 'dashboard-summary',
    title: 'Resumen del Dashboard',
    description: 'Tarjetas de resumen con métricas clave del sistema: consumo, eficiencia, pozos, alertas',
    component: 'DashboardSummary',
    category: CHART_CATEGORIES.PERFORMANCE,
    tags: ['resumen', 'métricas', 'kpis', 'dashboard'],
    type: CHART_TYPES.CARDS,
    dataSource: 'Dashboard Data',
    featured: true,
    icon: 'LayoutDashboard'
  },

  // Generic Chart Components (for custom use)
  {
    id: 'chart-component',
    title: 'Componente de Gráfico Genérico',
    description: 'Componente reutilizable para crear gráficos de línea, barra y área personalizados',
    component: 'ChartComponent',
    category: CHART_CATEGORIES.PERFORMANCE,
    tags: ['genérico', 'personalizable', 'línea', 'barra', 'área'],
    type: CHART_TYPES.COMPOSED,
    dataSource: 'Configurable',
    featured: false,
    icon: 'LineChart'
  },
  {
    id: 'dashboard-chart',
    title: 'Gráfico Compacto Dashboard',
    description: 'Gráfico minimalista optimizado para visualización en dashboard',
    component: 'DashboardChart',
    category: CHART_CATEGORIES.PERFORMANCE,
    tags: ['dashboard', 'compacto', 'miniatura'],
    type: CHART_TYPES.COMPOSED,
    dataSource: 'Configurable',
    featured: false,
    icon: 'BarChart3'
  }
]

/**
 * Get all available categories
 */
export const getCategories = () => {
  return Object.values(CHART_CATEGORIES)
}

/**
 * Get all unique tags
 */
export const getAllTags = () => {
  const tagsSet = new Set()
  CHARTS_REGISTRY.forEach(chart => {
    chart.tags.forEach(tag => tagsSet.add(tag))
  })
  return Array.from(tagsSet).sort()
}

/**
 * Filter charts by category
 */
export const getChartsByCategory = (category) => {
  if (!category) return CHARTS_REGISTRY
  return CHARTS_REGISTRY.filter(chart => chart.category === category)
}

/**
 * Filter charts by tag
 */
export const getChartsByTag = (tag) => {
  if (!tag) return CHARTS_REGISTRY
  return CHARTS_REGISTRY.filter(chart => chart.tags.includes(tag))
}

/**
 * Search charts by keyword
 */
export const searchCharts = (query) => {
  if (!query) return CHARTS_REGISTRY
  
  const lowerQuery = query.toLowerCase()
  return CHARTS_REGISTRY.filter(chart => {
    return (
      chart.title.toLowerCase().includes(lowerQuery) ||
      chart.description.toLowerCase().includes(lowerQuery) ||
      chart.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      chart.category.toLowerCase().includes(lowerQuery)
    )
  })
}

/**
 * Get featured charts
 */
export const getFeaturedCharts = () => {
  return CHARTS_REGISTRY.filter(chart => chart.featured)
}

/**
 * Get chart by ID
 */
export const getChartById = (id) => {
  return CHARTS_REGISTRY.find(chart => chart.id === id)
}

/**
 * Category display names and colors
 */
export const CATEGORY_CONFIG = {
  [CHART_CATEGORIES.CONSUMPTION]: {
    label: 'Consumo',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  [CHART_CATEGORIES.WELLS]: {
    label: 'Pozos',
    color: 'bg-cyan-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200'
  },
  [CHART_CATEGORIES.PREDICTIONS]: {
    label: 'Predicciones',
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200'
  },
  [CHART_CATEGORIES.BALANCE]: {
    label: 'Balance Hídrico',
    color: 'bg-teal-500',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200'
  },
  [CHART_CATEGORIES.PERFORMANCE]: {
    label: 'Rendimiento',
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200'
  },
  [CHART_CATEGORIES.ALERTS]: {
    label: 'Alertas',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  },
  [CHART_CATEGORIES.COMPARISON]: {
    label: 'Comparación',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200'
  },
  [CHART_CATEGORIES.MONITORING]: {
    label: 'Monitoreo',
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  }
}
