// Centralized data service for the BlueMetrics dashboard
export const dashboardData = {
    // Main consumption metrics
    consumption: {
      daily: 195.3,
      weekly: 1280,
      monthly: 5420,
      efficiency: 82,
    },
  
    // Water balance data
    waterSources: [
      { name: "Pozos", volume: 45000, color: "chart-1" },
      { name: "Agua Filtrada", volume: 10000, color: "chart-2" },
      { name: "Agua y Drenaje", volume: 5000, color: "chart-3" },
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
  
    // System statistics
    stats: {
      totalInflow: 60000,
      totalConsumption: 24000,
      reserves: 36000,
      aiPrecision: 94,
      activeAlerts: 2,
      implementedRecommendations: 12,
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
  