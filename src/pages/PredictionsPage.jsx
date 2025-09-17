import { useState } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  Settings,
  Download,
  RefreshCw,
  Activity,
  BarChart3,
  LineChart,
  Eye
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Datos fake de predicciones
const predictionsData = {
  daily: [
    { day: "Lun", actual: 54.2, predicted: 52.8, confidence: 94, weather: "soleado", factors: ["temperatura", "demanda_industrial"] },
    { day: "Mar", actual: 58.1, predicted: 55.6, confidence: 91, weather: "nublado", factors: ["humedad", "operaciones"] },
    { day: "Mié", actual: null, predicted: 61.3, confidence: 88, weather: "lluvioso", factors: ["lluvia", "reduccion_riego"] },
    { day: "Jue", actual: null, predicted: 58.7, confidence: 92, weather: "soleado", factors: ["temperatura", "demanda_normal"] },
    { day: "Vie", actual: null, predicted: 63.2, confidence: 85, weather: "caluroso", factors: ["alta_temperatura", "pico_demanda"] },
    { day: "Sáb", actual: null, predicted: 59.4, confidence: 89, weather: "nublado", factors: ["fin_semana", "reduccion_industrial"] },
    { day: "Dom", actual: null, predicted: 56.1, confidence: 93, weather: "templado", factors: ["fin_semana", "minima_operacion"] },
  ],
  weekly: [
    { week: 1, predicted: 445.2, confidence: 92, factors: ["clima_estable", "operaciones_normales"], range: "442-448" },
    { week: 2, predicted: 468.7, confidence: 89, factors: ["mantenimiento_programado", "temperatura_alta"], range: "461-476" },
    { week: 3, predicted: 441.8, confidence: 91, factors: ["operaciones_optimizadas"], range: "438-445" },
    { week: 4, predicted: 475.3, confidence: 87, factors: ["pico_demanda", "eventos_especiales"], range: "468-483" },
    { week: 5, predicted: 452.1, confidence: 90, factors: ["estabilizacion", "eficiencia_mejorada"], range: "448-456" },
    { week: 6, predicted: 439.6, confidence: 93, factors: ["optimizaciones_implementadas"], range: "436-443" },
    { week: 7, predicted: 461.4, confidence: 88, factors: ["incremento_estacional"], range: "454-469" },
    { week: 8, predicted: 448.9, confidence: 91, factors: ["estabilizacion_consumo"], range: "445-453" }
  ],
  monthly: [
    { month: "Oct 2024", predicted: 1847.5, confidence: 87, factors: ["estacional", "temperaturas_moderadas"] },
    { month: "Nov 2024", predicted: 1765.2, confidence: 91, factors: ["reduccion_estacional", "eficiencias"] },
    { month: "Dic 2024", predicted: 1698.8, confidence: 89, factors: ["minimos_anuales", "vacaciones"] },
    { month: "Ene 2025", predicted: 1723.4, confidence: 85, factors: ["reinicio_operaciones", "clima_frio"] },
    { month: "Feb 2025", predicted: 1789.6, confidence: 88, factors: ["incremento_gradual"] },
    { month: "Mar 2025", predicted: 1856.3, confidence: 86, factors: ["inicio_temporada_alta"] }
  ]
}

// Datos de factores de influencia
const influenceFactors = [
  { 
    factor: "Temperatura",
    impact: 85,
    correlation: 0.89,
    description: "Correlación positiva fuerte con el consumo",
    trend: "aumentando"
  },
  { 
    factor: "Humedad",
    impact: 45,
    correlation: -0.34,
    description: "Correlación negativa moderada",
    trend: "estable"
  },
  { 
    factor: "Precipitación",
    impact: 72,
    correlation: -0.67,
    description: "Reduce significativamente el consumo de riego",
    trend: "variable"
  },
  { 
    factor: "Demanda Industrial",
    impact: 93,
    correlation: 0.95,
    description: "Factor más predictivo del consumo",
    trend: "aumentando"
  },
  { 
    factor: "Día de la Semana",
    impact: 38,
    correlation: 0.42,
    description: "Patrones semanales identificables",
    trend: "cíclico"
  },
  { 
    factor: "Eventos Especiales",
    impact: 28,
    correlation: 0.31,
    description: "Impacto variable según el evento",
    trend: "irregular"
  }
]

// Datos de anomalías detectadas
const anomaliesData = [
  {
    id: 1,
    date: "2024-10-08",
    type: "consumption_spike",
    severity: "high",
    description: "Pico de consumo inesperado del 45% en Pozo 8",
    predicted: 68.3,
    actual: 99.1,
    deviation: 45.2,
    source: "Pozo 8 - Sector Industrial",
    action: "Investigar causa y ajustar modelo"
  },
  {
    id: 2,
    date: "2024-10-06",
    type: "efficiency_drop",
    severity: "medium",
    description: "Caída de eficiencia no prevista en sistema de bombeo",
    predicted: 91.2,
    actual: 73.8,
    deviation: -19.1,
    source: "Sistema de Bombeo Principal",
    action: "Revisar predicciones de mantenimiento"
  },
  {
    id: 3,
    date: "2024-10-05",
    type: "pattern_break",
    severity: "low",
    description: "Ruptura de patrón semanal habitual",
    predicted: 45.6,
    actual: 38.9,
    deviation: -14.7,
    source: "Consumo General",
    action: "Actualizar patrones estacionales"
  },
  {
    id: 4,
    date: "2024-10-03",
    type: "quality_anomaly",
    severity: "medium", 
    description: "Variación inesperada en calidad del agua",
    predicted: 7.2,
    actual: 6.8,
    deviation: -5.6,
    source: "Pozo 3 - Tratamiento",
    action: "Calibrar sensores de calidad"
  }
]

// Datos de insights de IA
const aiInsights = [
  {
    id: 1,
    type: "seasonal",
    title: "Patrón Estacional Identificado",
    description: "Incremento del 15% en consumo durante abril-agosto detectado con alta confianza",
    confidence: 96,
    impact: "high",
    recommendation: "Preparar capacidad adicional para temporada alta",
    timeframe: "Próximos 4 meses"
  },
  {
    id: 2,
    type: "weekly",
    title: "Picos de Demanda Predecibles",
    description: "Picos consistentes los martes y jueves entre 12:00-14:00",
    confidence: 94,
    impact: "medium",
    recommendation: "Optimizar distribución de carga en horarios pico",
    timeframe: "Implementar esta semana"
  },
  {
    id: 3,
    type: "weather",
    title: "Correlación Climática Fuerte",
    description: "Correlación positiva de 0.89 entre temperatura y consumo",
    confidence: 91,
    impact: "high",
    recommendation: "Integrar pronósticos meteorológicos en predicciones",
    timeframe: "Próximas 2 semanas"
  },
  {
    id: 4,
    type: "operational",
    title: "Impacto de Mantenimiento",
    description: "Eficiencia decrece 3% temporalmente post-mantenimiento",
    confidence: 88,
    impact: "low",
    recommendation: "Programar mantenimientos en períodos de baja demanda",
    timeframe: "Próximo mantenimiento"
  },
  {
    id: 5,
    type: "optimization",
    title: "Oportunidad de Ahorro",
    description: "Posible reducción del 8% en consumo nocturno mediante optimización",
    confidence: 85,
    impact: "medium",
    recommendation: "Implementar control inteligente de bombeo nocturno",
    timeframe: "Próximos 30 días"
  }
]

export default function PredictionsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('daily')
  const [selectedMetric, setSelectedMetric] = useState('consumption')
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(true)

  // Preparar datos para gráficos
  const getChartData = () => {
    const data = predictionsData[selectedTimeframe]
    const labels = data.map(item => item.day || item.month || `Sem ${item.week}`)
    
    return {
      labels,
      datasets: [
        {
          label: 'Predicción (m³)',
          data: data.map(item => item.predicted),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: false,
          tension: 0.4,
        },
        {
          label: 'Real (m³)',
          data: data.map(item => item.actual),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          fill: false,
          tension: 0.4,
        }
      ]
    }
  }

  const confidenceData = {
    labels: predictionsData[selectedTimeframe].map(item => item.day || item.month || `Sem ${item.week}`),
    datasets: [
      {
        label: 'Confianza (%)',
        data: predictionsData[selectedTimeframe].map(item => item.confidence),
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 2,
      }
    ]
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-orange-100 text-orange-800'
      case 'low': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Análisis Predictivo</h1>
                <p className="text-muted-foreground">
                  Predicciones de IA y análisis de patrones de consumo
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar Modelo
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">94%</div>
                      <div className="text-sm text-muted-foreground">Precisión IA</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">87%</div>
                      <div className="text-sm text-muted-foreground">Confianza Media</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{anomaliesData.length}</div>
                      <div className="text-sm text-muted-foreground">Anomalías</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{aiInsights.length}</div>
                      <div className="text-sm text-muted-foreground">Insights IA</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controles de visualización */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex gap-2">
                    <label className="text-sm font-medium">Período:</label>
                    <select 
                      className="px-3 py-1 border border-border rounded-md text-sm"
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                    >
                      <option value="daily">Diario (7 días)</option>
                      <option value="weekly">Semanal (8 semanas)</option>
                      <option value="monthly">Mensual (6 meses)</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <label className="text-sm font-medium">Métrica:</label>
                    <select 
                      className="px-3 py-1 border border-border rounded-md text-sm"
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                    >
                      <option value="consumption">Consumo</option>
                      <option value="efficiency">Eficiencia</option>
                      <option value="quality">Calidad</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showConfidenceIntervals}
                      onChange={(e) => setShowConfidenceIntervals(e.target.checked)}
                    />
                    <span className="text-sm">Mostrar intervalos de confianza</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos principales */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Predicciones vs Realidad</h3>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Line 
                    data={getChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Consumo (m³)'
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Nivel de Confianza</h3>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Bar 
                    data={confidenceData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Confianza (%)'
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Factores de influencia */}
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Factores de Influencia</h3>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {influenceFactors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{factor.factor}</h4>
                      <Badge variant="outline">{factor.trend}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{factor.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Impacto:</span>
                        <span className="font-medium">{factor.impact}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${factor.impact}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Correlación:</span>
                        <span className="font-medium">{factor.correlation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Anomalías detectadas */}
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Anomalías Detectadas</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomaliesData.map((anomaly) => (
                  <div key={anomaly.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{anomaly.description}</h4>
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Fecha:</span>
                            <span className="ml-2 font-medium">{anomaly.date}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Predicho:</span>
                            <span className="ml-2 font-medium">{anomaly.predicted}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Real:</span>
                            <span className="ml-2 font-medium">{anomaly.actual}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fuente:</span>
                            <span className="ml-2 font-medium">{anomaly.source}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Desviación:</span>
                            <span className={`ml-2 font-medium ${anomaly.deviation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Acción:</span>
                            <span className="ml-2 font-medium">{anomaly.action}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights de IA */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Insights de Inteligencia Artificial</h3>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impacto
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Confianza</div>
                        <div className="text-lg font-bold">{insight.confidence}%</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Recomendación:</span>
                        <p className="font-medium">{insight.recommendation}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span className="ml-2 font-medium">{insight.timeframe}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
