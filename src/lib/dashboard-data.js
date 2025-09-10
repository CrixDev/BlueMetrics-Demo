// Centralized data service for the BlueMetrics dashboard
export const dashboardData = {
      // Main consumption metrics with comparative data
  consumption: {
    current: {
      daily: 2850,
      weekly: 19950,
      monthly: 43132,
      yearly: 517584
    },
    previous: {
      daily: 2920,
      weekly: 20440,
      monthly: 41800,
      yearly: 501600
    },
    trends: {
      daily: -2.4, // Porcentaje de cambio vs período anterior
      weekly: -2.4,
      monthly: 3.2,
      yearly: 3.2
    },
    efficiency: 88.7,
  },

  // Metas y consumo actual por categoría
  goals: {
    riego: {
      meta_mensual: 12000,
      consumo_actual: 15000,
      porcentaje_cumplimiento: 125, // Excede la meta
      tendencia: 5.2 // Porcentaje de cambio vs mes anterior
    },
    servicios: {
      meta_mensual: 45000,
      consumo_actual: 47000,
      porcentaje_cumplimiento: 104.4, // Ligeramente sobre la meta
      tendencia: -1.8 // Porcentaje de cambio vs mes anterior
    },
    total: {
      meta_mensual: 57000,
      consumo_actual: 62000,
      porcentaje_cumplimiento: 108.8,
      tendencia: 2.1
    }
  },

  // KPIs de eficiencia detallados
  efficiencyKPIs: {
    distribucion: {
      actual: 94.2,
      meta: 95.0,
      tendencia: 0.8,
      estado: "warning" // warning, success, danger
    },
    aprovechamiento: {
      actual: 88.7,
      meta: 90.0,
      tendencia: 2.1,
      estado: "warning"
    },
    perdidas: {
      actual: 5.8,
      meta: 5.0,
      tendencia: -0.3, // Negativo es bueno para pérdidas
      estado: "warning"
    },
    reciclaje: {
      actual: 15.2,
      meta: 20.0,
      tendencia: 1.5,
      estado: "danger"
    },
    general: {
      actual: 88.7,
      meta: 90.0,
      tendencia: 1.2,
      estado: "warning"
    }
  },
  
      // Water balance data
  waterSources: [
    { name: "Pozos", volume: 45000, color: "chart-1", percentage: 60.0, description: "Extracción directa de pozos subterráneos" },
    { name: "Agua Municipal", volume: 18000, color: "chart-2", percentage: 24.0, description: "Suministro de la red municipal" },
    { name: "PTAR", volume: 9000, color: "chart-3", percentage: 12.0, description: "Agua tratada de planta de tratamiento" },
    { name: "Pipas", volume: 3000, color: "chart-4", percentage: 4.0, description: "Suministro por camiones cisterna" },
  ],
  
    waterUsage: [
      { name: "Riego", volume: 3000, color: "secondary" },
      { name: "Torres de Enfriamiento", volume: 16000, color: "primary" },
      { name: "Edificios", volume: 5000, color: "chart-1" },
    ],
  
    // Well monitoring data
    wells: [
      {
        id: 11,
        name: "Pozo 11",
        dailyConsumption: 54.2,
        efficiency: 98,
        status: "alert",
        waterLevel: "high",
        dailyLimit: "exceeded",
      },
      {
        id: 7,
        name: "Pozo 7",
        dailyConsumption: 48.5,
        efficiency: 95,
        status: "warning",
        waterLevel: "normal",
        dailyLimit: "normal",
      },
    ],
  
    // Consumption trends
    monthlyTrends: [
      { name: "Ene", value: 45 },
      { name: "Feb", value: 52 },
      { name: "Mar", value: 48 },
      { name: "Abr", value: 61 },
      { name: "May", value: 55 },
      { name: "Jun", value: 67 },
    ],
  
    // Predictive data
    predictions: [
      { day: "Lun", actual: 54, predicted: 52 },
      { day: "Mar", actual: 58, predicted: 55 },
      { day: "Mié", actual: null, predicted: 61 },
      { day: "Jue", actual: null, predicted: 58 },
      { day: "Vie", actual: null, predicted: 63 },
      { day: "Sáb", actual: null, predicted: 59 },
      { day: "Dom", actual: null, predicted: 56 },
    ],
  
    // System alerts
    alerts: [
      {
        id: 1,
        type: "critical",
        title: "Límite Diario Excedido",
        message: "El Pozo 11 superó el límite diario permitido en 15%",
        timestamp: "Hace 5 min",
        action: "Reducir flujo",
        status: "active",
      },
      {
        id: 2,
        type: "warning",
        title: "Posible Fuga Detectada",
        message: "Pozo 7 muestra patrones anómalos de consumo",
        timestamp: "Hace 12 min",
        action: "Inspeccionar",
        status: "active",
      },
      {
        id: 3,
        type: "info",
        title: "Mantenimiento Programado",
        message: "Torre de enfriamiento 3 requiere mantenimiento en 2 días",
        timestamp: "Hace 1 hora",
        action: "Programar",
        status: "pending",
      },
    ],
  
    // AI recommendations
    recommendations: [
      {
        id: 1,
        priority: "high",
        title: "Optimizar Riego Nocturno",
        description: "Activar sistema de riego entre 2:00-4:00 AM para reducir evaporación",
        impact: "Ahorro estimado: 12% consumo diario",
        action: "Programar",
      },
      {
        id: 2,
        priority: "medium",
        title: "Recirculación de Agua",
        description: "Conectar torre 5 al sistema de tratamiento para reciclar agua",
        impact: "Reducción: 8% consumo total",
        action: "Implementar",
      },
    ],
  
      // Water origin historical data
  waterOriginHistory: {
    monthly: [
      { name: "Ene", pozos: 42, municipal: 25, ptar: 15, pipas: 5 },
      { name: "Feb", pozos: 45, municipal: 23, ptar: 12, pipas: 8 },
      { name: "Mar", pozos: 48, municipal: 22, ptar: 13, pipas: 6 },
      { name: "Abr", pozos: 43, municipal: 26, ptar: 14, pipas: 7 },
      { name: "May", pozos: 46, municipal: 24, ptar: 11, pipas: 9 },
      { name: "Jun", pozos: 44, municipal: 25, ptar: 13, pipas: 8 },
    ],
    quarterly: [
      { name: "Q1", pozos: 45, municipal: 23, ptar: 13, pipas: 6 },
      { name: "Q2", pozos: 44, municipal: 25, ptar: 13, pipas: 8 },
      { name: "Q3", pozos: 47, municipal: 22, ptar: 12, pipas: 7 },
      { name: "Q4", pozos: 46, municipal: 24, ptar: 14, pipas: 6 },
    ],
    yearly: [
      { name: "2022", pozos: 52, municipal: 28, ptar: 8, pipas: 12 },
      { name: "2023", pozos: 48, municipal: 26, ptar: 10, pipas: 16 },
      { name: "2024", pozos: 46, municipal: 24, ptar: 12, pipas: 8 },
      { name: "2025", pozos: 45, municipal: 25, ptar: 13, pipas: 7 },
    ]
  },

  // Water source reliability metrics
  sourceReliability: {
    pozos: { reliability: 95, cost: "Bajo", availability: "24/7" },
    municipal: { reliability: 88, cost: "Medio", availability: "Intermitente" },
    ptar: { reliability: 92, cost: "Bajo", availability: "20h/día" },
    pipas: { reliability: 75, cost: "Alto", availability: "A demanda" }
  },

  // Water Balance Data
  waterBalance: {
    inflow: {
      pozos: 45000,
      municipal: 18000,
      ptar: 9000,
      pipas: 3000,
      total: 75000
    },
    outflow: {
      riego: 15000,
      torres: 35000,
      edificios: 12000,
      perdidas: 4500,
      total: 66500
    },
    storage: {
      tanques: 25000,
      cisternas: 15000,
      reservorios: 10000,
      total: 50000
    },
    efficiency: {
      distribucion: 94,
      aprovechamiento: 88,
      reciclaje: 15,
      perdidas: 6
    }
  },

  // Balance histórico mensual
  balanceHistory: {
    monthly: [
      { name: "Ene", inflow: 72, outflow: 68, balance: 4, efficiency: 94 },
      { name: "Feb", inflow: 75, outflow: 70, balance: 5, efficiency: 93 },
      { name: "Mar", inflow: 78, outflow: 75, balance: 3, efficiency: 96 },
      { name: "Abr", inflow: 80, outflow: 78, balance: 2, efficiency: 97 },
      { name: "May", inflow: 82, outflow: 80, balance: 2, efficiency: 97 },
      { name: "Jun", inflow: 75, outflow: 73, balance: 2, efficiency: 97 }
    ],
    quarterly: [
      { name: "Q1", inflow: 225, outflow: 213, balance: 12, efficiency: 95 },
      { name: "Q2", inflow: 237, outflow: 231, balance: 6, efficiency: 97 },
      { name: "Q3", inflow: 245, outflow: 238, balance: 7, efficiency: 97 },
      { name: "Q4", inflow: 240, outflow: 235, balance: 5, efficiency: 98 }
    ],
    yearly: [
      { name: "2022", inflow: 850, outflow: 825, balance: 25, efficiency: 97 },
      { name: "2023", inflow: 890, outflow: 870, balance: 20, efficiency: 98 },
      { name: "2024", inflow: 920, outflow: 900, balance: 20, efficiency: 98 },
      { name: "2025", inflow: 947, outflow: 917, balance: 30, efficiency: 97 }
    ]
  },

  // Flujo detallado para diagrama Sankey
  waterFlow: {
    sources: [
      { id: "pozos", name: "Pozos", value: 45000, color: "#3B82F6" },
      { id: "municipal", name: "Agua Municipal", value: 18000, color: "#10B981" },
      { id: "ptar", name: "PTAR", value: 9000, color: "#F59E0B" },
      { id: "pipas", name: "Pipas", value: 3000, color: "#EF4444" }
    ],
    distribution: [
      { id: "red_principal", name: "Red Principal", value: 60000, color: "#6366F1" },
      { id: "almacenamiento", name: "Almacenamiento", value: 15000, color: "#8B5CF6" }
    ],
    usage: [
      { id: "riego", name: "Riego", value: 15000, color: "#059669" },
      { id: "torres", name: "Torres Enfriamiento", value: 35000, color: "#DC2626" },
      { id: "edificios", name: "Edificios", value: 12000, color: "#D97706" },
      { id: "perdidas", name: "Pérdidas", value: 4500, color: "#6B7280" }
    ],
    flows: [
      // From sources to distribution
      { from: "pozos", to: "red_principal", value: 38000 },
      { from: "pozos", to: "almacenamiento", value: 7000 },
      { from: "municipal", to: "red_principal", value: 15000 },
      { from: "municipal", to: "almacenamiento", value: 3000 },
      { from: "ptar", to: "red_principal", value: 7000 },
      { from: "ptar", to: "almacenamiento", value: 2000 },
      { from: "pipas", to: "almacenamiento", value: 3000 },
      
      // From distribution to usage
      { from: "red_principal", to: "riego", value: 12000 },
      { from: "red_principal", to: "torres", value: 30000 },
      { from: "red_principal", to: "edificios", value: 10000 },
      { from: "red_principal", to: "perdidas", value: 3600 },
      { from: "almacenamiento", to: "riego", value: 3000 },
      { from: "almacenamiento", to: "torres", value: 5000 },
      { from: "almacenamiento", to: "edificios", value: 2000 },
      { from: "almacenamiento", to: "perdidas", value: 900 }
    ]
  },

  // Indicadores de sostenibilidad
  sustainability: {
    waterStress: 65, // Porcentaje de estrés hídrico
    reuseRate: 15, // Porcentaje de agua reutilizada
    lossRate: 6, // Porcentaje de pérdidas
    diversityIndex: 0.8, // Índice de diversidad de fuentes
    resilience: 87 // Porcentaje de resiliencia del sistema
  },

  // System statistics
  stats: {
    totalInflow: 75000,
    totalConsumption: 66500,
    reserves: 50000,
    netBalance: 8500,
    aiPrecision: 94,
    activeAlerts: 2,
    implementedRecommendations: 12,
    sourceDiversification: 4,
    waterSecurity: 87,
  },
  }
  
  // Utility functions for data formatting
export const formatVolume = (volume) => {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k m³`
  }
  return `${volume} m³`
}

export const formatPercentage = (value) => {
  return `${value}%`
}

export const getAlertCount = (type) => {
  return dashboardData.alerts.filter((alert) => alert.type === type && alert.status === "active").length
}
  