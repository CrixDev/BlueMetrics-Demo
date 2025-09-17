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
        id: 1,
        name: "Pozo Central Norte",
        dailyConsumption: 34.8,
        efficiency: 92,
        status: "normal",
        waterLevel: "normal",
        dailyLimit: "normal",
        location: { lat: 19.4326, lng: -99.1332 },
        depth: 85,
        maxCapacity: 50,
        lastMaintenance: "2024-08-15"
      },
      {
        id: 2,
        name: "Pozo Industrial Este",
        dailyConsumption: 67.3,
        efficiency: 88,
        status: "warning",
        waterLevel: "low",
        dailyLimit: "approaching",
        location: { lat: 19.4400, lng: -99.1200 },
        depth: 120,
        maxCapacity: 75,
        lastMaintenance: "2024-07-20"
      },
      {
        id: 3,
        name: "Pozo Reserva Sur",
        dailyConsumption: 28.9,
        efficiency: 96,
        status: "normal",
        waterLevel: "high",
        dailyLimit: "normal",
        location: { lat: 19.4200, lng: -99.1400 },
        depth: 95,
        maxCapacity: 45,
        lastMaintenance: "2024-09-01"
      },
      {
        id: 4,
        name: "Pozo Emergencia Oeste",
        dailyConsumption: 0,
        efficiency: 0,
        status: "inactive",
        waterLevel: "high",
        dailyLimit: "normal",
        location: { lat: 19.4280, lng: -99.1500 },
        depth: 110,
        maxCapacity: 60,
        lastMaintenance: "2024-06-10"
      },
      {
        id: 5,
        name: "Pozo Servicios Generales",
        dailyConsumption: 41.2,
        efficiency: 94,
        status: "normal",
        waterLevel: "normal",
        dailyLimit: "normal",
        location: { lat: 19.4350, lng: -99.1250 },
        depth: 78,
        maxCapacity: 55,
        lastMaintenance: "2024-08-28"
      },
      {
        id: 6,
        name: "Pozo Riego Jardines",
        dailyConsumption: 22.7,
        efficiency: 91,
        status: "normal",
        waterLevel: "normal",
        dailyLimit: "normal",
        location: { lat: 19.4320, lng: -99.1380 },
        depth: 65,
        maxCapacity: 35,
        lastMaintenance: "2024-08-05"
      },
      {
        id: 7,
        name: "Pozo Principal Centro",
        dailyConsumption: 48.5,
        efficiency: 95,
        status: "warning",
        waterLevel: "normal",
        dailyLimit: "normal",
        location: { lat: 19.4340, lng: -99.1310 },
        depth: 102,
        maxCapacity: 65,
        lastMaintenance: "2024-07-15"
      },
      {
        id: 8,
        name: "Pozo Torres Refrigeración",
        dailyConsumption: 89.1,
        efficiency: 87,
        status: "alert",
        waterLevel: "low",
        dailyLimit: "exceeded",
        location: { lat: 19.4380, lng: -99.1280 },
        depth: 135,
        maxCapacity: 95,
        lastMaintenance: "2024-06-30"
      },
      {
        id: 9,
        name: "Pozo Backup Norte",
        dailyConsumption: 15.3,
        efficiency: 89,
        status: "normal",
        waterLevel: "high",
        dailyLimit: "normal",
        location: { lat: 19.4420, lng: -99.1350 },
        depth: 88,
        maxCapacity: 40,
        lastMaintenance: "2024-09-10"
      },
      {
        id: 10,
        name: "Pozo Producción Sur",
        dailyConsumption: 73.6,
        efficiency: 93,
        status: "normal",
        waterLevel: "normal",
        dailyLimit: "approaching",
        location: { lat: 19.4180, lng: -99.1320 },
        depth: 115,
        maxCapacity: 80,
        lastMaintenance: "2024-08-18"
      },
      {
        id: 11,
        name: "Pozo 11",
        dailyConsumption: 54.2,
        efficiency: 98,
        status: "alert",
        waterLevel: "high",
        dailyLimit: "exceeded",
        location: { lat: 19.4360, lng: -99.1290 },
        depth: 92,
        maxCapacity: 70,
        lastMaintenance: "2024-09-05"
      },
      {
        id: 12,
        name: "Pozo 12",
        dailyConsumption: 58.7,
        efficiency: 96,
        status: "normal",
        waterLevel: "normal",
        dailyLimit: "normal",
        location: { lat: 19.4300, lng: -99.1340 },
        depth: 98,
        maxCapacity: 75,
        lastMaintenance: "2024-08-22"
      }
    ],
  
    // Consumption trends
    monthlyTrends: [
      { name: "Ene", value: 45, target: 50, efficiency: 89, cost: 125000 },
      { name: "Feb", value: 52, target: 50, efficiency: 91, cost: 138000 },
      { name: "Mar", value: 48, target: 50, efficiency: 93, cost: 118000 },
      { name: "Abr", value: 61, target: 55, efficiency: 87, cost: 165000 },
      { name: "May", value: 55, target: 55, efficiency: 90, cost: 148000 },
      { name: "Jun", value: 67, target: 60, efficiency: 85, cost: 182000 },
      { name: "Jul", value: 72, target: 65, efficiency: 83, cost: 198000 },
      { name: "Ago", value: 68, target: 65, efficiency: 86, cost: 185000 },
      { name: "Sep", value: 58, target: 55, efficiency: 92, cost: 152000 },
      { name: "Oct", value: 53, target: 50, efficiency: 94, cost: 139000 },
      { name: "Nov", value: 49, target: 50, efficiency: 96, cost: 128000 },
      { name: "Dic", value: 46, target: 48, efficiency: 95, cost: 122000 }
    ],

    // Weekly consumption detail
    weeklyTrends: [
      { week: "Sem 1", consumption: 412, target: 450, sources: { pozos: 280, municipal: 85, ptar: 32, pipas: 15 } },
      { week: "Sem 2", consumption: 465, target: 450, sources: { pozos: 295, municipal: 102, ptar: 45, pipas: 23 } },
      { week: "Sem 3", consumption: 398, target: 450, sources: { pozos: 268, municipal: 78, ptar: 38, pipas: 14 } },
      { week: "Sem 4", consumption: 523, target: 500, sources: { pozos: 342, municipal: 115, ptar: 48, pipas: 18 } },
      { week: "Sem 5", consumption: 487, target: 480, sources: { pozos: 318, municipal: 98, ptar: 52, pipas: 19 } },
      { week: "Sem 6", consumption: 445, target: 450, sources: { pozos: 298, municipal: 89, ptar: 42, pipas: 16 } }
    ],

    // Daily consumption patterns
    dailyPatterns: [
      { hour: "00:00", consumption: 15, demand: "low", primarySource: "pozos" },
      { hour: "01:00", consumption: 12, demand: "low", primarySource: "pozos" },
      { hour: "02:00", consumption: 10, demand: "low", primarySource: "pozos" },
      { hour: "03:00", consumption: 9, demand: "low", primarySource: "pozos" },
      { hour: "04:00", consumption: 11, demand: "low", primarySource: "pozos" },
      { hour: "05:00", consumption: 18, demand: "low", primarySource: "pozos" },
      { hour: "06:00", consumption: 28, demand: "medium", primarySource: "pozos" },
      { hour: "07:00", consumption: 42, demand: "medium", primarySource: "pozos" },
      { hour: "08:00", consumption: 58, demand: "high", primarySource: "pozos" },
      { hour: "09:00", consumption: 72, demand: "high", primarySource: "mixed" },
      { hour: "10:00", consumption: 85, demand: "high", primarySource: "mixed" },
      { hour: "11:00", consumption: 91, demand: "peak", primarySource: "mixed" },
      { hour: "12:00", consumption: 98, demand: "peak", primarySource: "mixed" },
      { hour: "13:00", consumption: 95, demand: "peak", primarySource: "mixed" },
      { hour: "14:00", consumption: 89, demand: "high", primarySource: "mixed" },
      { hour: "15:00", consumption: 76, demand: "high", primarySource: "mixed" },
      { hour: "16:00", consumption: 68, demand: "medium", primarySource: "pozos" },
      { hour: "17:00", consumption: 54, demand: "medium", primarySource: "pozos" },
      { hour: "18:00", consumption: 41, demand: "medium", primarySource: "pozos" },
      { hour: "19:00", consumption: 32, demand: "low", primarySource: "pozos" },
      { hour: "20:00", consumption: 28, demand: "low", primarySource: "pozos" },
      { hour: "21:00", consumption: 24, demand: "low", primarySource: "pozos" },
      { hour: "22:00", consumption: 21, demand: "low", primarySource: "pozos" },
      { hour: "23:00", consumption: 18, demand: "low", primarySource: "pozos" }
    ],
  
    // Predictive data
    predictions: [
      { day: "Lun", actual: 54, predicted: 52, confidence: 94, weather: "soleado" },
      { day: "Mar", actual: 58, predicted: 55, confidence: 91, weather: "nublado" },
      { day: "Mié", actual: null, predicted: 61, confidence: 88, weather: "lluvioso" },
      { day: "Jue", actual: null, predicted: 58, confidence: 92, weather: "soleado" },
      { day: "Vie", actual: null, predicted: 63, confidence: 85, weather: "caluroso" },
      { day: "Sáb", actual: null, predicted: 59, confidence: 89, weather: "nublado" },
      { day: "Dom", actual: null, predicted: 56, confidence: 93, weather: "templado" },
    ],

    // Extended predictions (30 days)
    longTermPredictions: [
      { week: 1, predicted: 445, confidence: 92, factors: ["clima", "estacionalidad"] },
      { week: 2, predicted: 468, confidence: 89, factors: ["clima", "mantenimiento"] },
      { week: 3, predicted: 441, confidence: 91, factors: ["operaciones_normales"] },
      { week: 4, predicted: 475, confidence: 87, factors: ["clima", "demanda_industrial"] },
      { week: 5, predicted: 452, confidence: 90, factors: ["estacionalidad"] },
      { week: 6, predicted: 439, confidence: 93, factors: ["optimizaciones"] },
      { week: 7, predicted: 461, confidence: 88, factors: ["clima", "eventos_especiales"] },
      { week: 8, predicted: 448, confidence: 91, factors: ["operaciones_normales"] }
    ],

    // Machine learning insights
    mlInsights: {
      patterns: [
        { 
          type: "seasonal", 
          description: "Incremento del 15% en consumo durante abril-agosto",
          confidence: 96,
          impact: "high"
        },
        { 
          type: "weekly", 
          description: "Picos de consumo los martes y jueves (12:00-14:00)",
          confidence: 94,
          impact: "medium"
        },
        { 
          type: "weather", 
          description: "Correlación positiva con temperatura (+0.8)",
          confidence: 91,
          impact: "high"
        },
        { 
          type: "operational", 
          description: "Eficiencia decrece 3% post-mantenimiento",
          confidence: 88,
          impact: "low"
        }
      ],
      anomalies: [
        {
          date: "2024-09-08",
          type: "consumption_spike",
          value: 127,
          expected: 68,
          severity: "high",
          source: "Pozo 8"
        },
        {
          date: "2024-09-06",
          type: "efficiency_drop",
          value: 73,
          expected: 91,
          severity: "medium",
          source: "Pozo 2"
        }
      ]
    },
  
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
        location: "Sector Norte",
        affectedSystems: ["Riego", "Torres de enfriamiento"]
      },
      {
        id: 2,
        type: "warning",
        title: "Posible Fuga Detectada",
        message: "Pozo 7 muestra patrones anómalos de consumo",
        timestamp: "Hace 12 min",
        action: "Inspeccionar",
        status: "active",
        location: "Sector Centro",
        affectedSystems: ["Distribución principal"]
      },
      {
        id: 3,
        type: "info",
        title: "Mantenimiento Programado",
        message: "Torre de enfriamiento 3 requiere mantenimiento en 2 días",
        timestamp: "Hace 1 hora",
        action: "Programar",
        status: "pending",
        location: "Edificio Industrial",
        affectedSystems: ["Climatización"]
      },
      {
        id: 4,
        type: "critical",
        title: "Presión Baja Sistema Principal",
        message: "Presión en línea principal descendió a 2.1 bar (mín: 2.5 bar)",
        timestamp: "Hace 8 min",
        action: "Activar bomba de respaldo",
        status: "active",
        location: "Red principal",
        affectedSystems: ["Distribución", "Torres", "Riego"]
      },
      {
        id: 5,
        type: "warning",
        title: "Calidad del Agua Comprometida",
        message: "Niveles de cloro residual por debajo del mínimo en Pozo 3",
        timestamp: "Hace 25 min",
        action: "Ajustar dosificación",
        status: "active",
        location: "Sector Sur",
        affectedSystems: ["Agua potable"]
      },
      {
        id: 6,
        type: "info",
        title: "Optimización Energética Disponible",
        message: "Se detectó oportunidad de ahorro del 8% en horario nocturno",
        timestamp: "Hace 45 min",
        action: "Implementar programa",
        status: "pending",
        location: "Sistema completo",
        affectedSystems: ["Bombeo", "Distribución"]
      },
      {
        id: 7,
        type: "warning",
        title: "Nivel Tanque de Reserva Bajo",
        message: "Tanque de reserva Norte al 25% de capacidad",
        timestamp: "Hace 1h 15min",
        action: "Activar llenado",
        status: "acknowledged",
        location: "Sector Norte",
        affectedSystems: ["Almacenamiento", "Reserva"]
      },
      {
        id: 8,
        type: "success",
        title: "Eficiencia Meta Alcanzada",
        message: "Sistema superó meta mensual de eficiencia (96% vs 90%)",
        timestamp: "Hace 2 horas",
        action: "Ver reporte",
        status: "resolved",
        location: "Sistema completo",
        affectedSystems: ["Todos"]
      }
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
        category: "eficiencia",
        estimatedSavings: 2850,
        implementationTime: "2 horas",
        difficulty: "low"
      },
      {
        id: 2,
        priority: "medium",
        title: "Recirculación de Agua",
        description: "Conectar torre 5 al sistema de tratamiento para reciclar agua",
        impact: "Reducción: 8% consumo total",
        action: "Implementar",
        category: "reciclaje",
        estimatedSavings: 5320,
        implementationTime: "1 día",
        difficulty: "medium"
      },
      {
        id: 3,
        priority: "high",
        title: "Ajuste Automático de Presión",
        description: "Implementar control dinámico de presión basado en demanda real",
        impact: "Ahorro energético: 15% y reducción pérdidas: 5%",
        action: "Configurar",
        category: "automatización",
        estimatedSavings: 4200,
        implementationTime: "4 horas",
        difficulty: "medium"
      },
      {
        id: 4,
        priority: "medium",
        title: "Mantenimiento Predictivo Pozos",
        description: "Programar mantenimiento preventivo basado en patrones de uso",
        impact: "Reducción tiempo inactivo: 25%",
        action: "Programar",
        category: "mantenimiento",
        estimatedSavings: 1850,
        implementationTime: "Planificación 2 días",
        difficulty: "low"
      },
      {
        id: 5,
        priority: "low",
        title: "Optimización Energética Bombas",
        description: "Ajustar velocidad de bombas según curva de demanda horaria",
        impact: "Ahorro energético: 10%",
        action: "Optimizar",
        category: "energía",
        estimatedSavings: 1200,
        implementationTime: "3 horas",
        difficulty: "medium"
      },
      {
        id: 6,
        priority: "medium",
        title: "Detección Temprana de Fugas",
        description: "Instalar sensores adicionales en puntos críticos de distribución",
        impact: "Detección 80% más rápida, ahorro 3% consumo",
        action: "Instalar",
        category: "detección",
        estimatedSavings: 2100,
        implementationTime: "2 días",
        difficulty: "high"
      },
      {
        id: 7,
        priority: "low",
        title: "Recolección Agua de Lluvia",
        description: "Implementar sistema de captación en techos de edificios",
        impact: "Suplemento adicional: 5% del suministro en época de lluvias",
        action: "Diseñar",
        category: "captación",
        estimatedSavings: 3600,
        implementationTime: "1 semana",
        difficulty: "high"
      }
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
      lluvia: 2500,
      reciclada: 6800,
      total: 84300
    },
    outflow: {
      riego: 15000,
      torres: 35000,
      edificios: 12000,
      industria: 8500,
      perdidas: 4500,
      evaporacion: 3200,
      total: 78200
    },
    storage: {
      tanques: 25000,
      cisternas: 15000,
      reservorios: 10000,
      subterraneo: 18000,
      emergencia: 5000,
      total: 73000
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
    totalInflow: 84300,
    totalConsumption: 78200,
    reserves: 73000,
    netBalance: 6100,
    aiPrecision: 94,
    activeAlerts: 5,
    implementedRecommendations: 12,
    sourceDiversification: 6,
    waterSecurity: 87,
    totalWells: 12,
    activeWells: 11,
    maintenanceScheduled: 3,
    energyEfficiency: 92,
    costPerCubicMeter: 2.35,
    monthlyBudget: 185000,
    actualCost: 172500,
    savingsAchieved: 12500,
    carbonFootprint: 245.8,
    waterQualityIndex: 96,
    systemUptime: 99.2,
    emergencyResponseTime: 8.5
  },

  // Environmental data
  environmental: {
    weatherImpact: {
      temperature: { current: 24, impact: "medium", correlation: 0.8 },
      humidity: { current: 65, impact: "low", correlation: 0.3 },
      precipitation: { current: 0, forecast: 15, impact: "low" },
      windSpeed: { current: 12, impact: "negligible" }
    },
    qualityMetrics: {
      ph: { value: 7.2, status: "optimal", range: "6.5-8.5" },
      turbidity: { value: 0.8, status: "excellent", limit: 1.0 },
      chlorine: { value: 0.3, status: "optimal", range: "0.2-0.5" },
      conductivity: { value: 450, status: "good", limit: 1500 },
      hardness: { value: 180, status: "moderate", range: "soft" }
    },
    sustainability: {
      renewableEnergyUsage: 23,
      carbonReduction: 18,
      waterRecyclingRate: 15,
      ecologicalFootprint: "medium"
    }
  },

  // Performance metrics
  performance: {
    currentMonth: {
      efficiency: 94.2,
      reliability: 99.1,
      costEfficiency: 107.2,
      customerSatisfaction: 96,
      maintenanceCompliance: 98
    },
    previousMonth: {
      efficiency: 91.8,
      reliability: 98.7,
      costEfficiency: 103.8,
      customerSatisfaction: 94,
      maintenanceCompliance: 95
    },
    yearToDate: {
      efficiency: 92.1,
      reliability: 98.9,
      costEfficiency: 105.2,
      customerSatisfaction: 95,
      maintenanceCompliance: 97
    },
    benchmarks: {
      industryAverage: {
        efficiency: 88,
        reliability: 95,
        costEfficiency: 100
      },
      bestPractice: {
        efficiency: 96,
        reliability: 99.5,
        costEfficiency: 115
      }
    }
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
  