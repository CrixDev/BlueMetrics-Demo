import { useParams, useNavigate } from "react-router"
import { useState } from "react"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
  ArrowLeftIcon,
  DropletIcon, 
  MapPinIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  InfoIcon,
  FileTextIcon,
  SettingsIcon,
  BarChart3Icon,
  FilterIcon
} from "lucide-react"
import ChartComponent from '../components/ChartComponent'

export default function WellDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Estados para los filtros de gráficas
  const [selectedMetrics, setSelectedMetrics] = useState(['realConsumption', 'availableForConsumption'])
  const [chartType, setChartType] = useState('line')
  const [showComparison, setShowComparison] = useState(true)
  const [timeFilter, setTimeFilter] = useState('yearly') // 'yearly', 'quarterly', 'monthly'

  // Datos específicos del Pozo 12 basados en la información proporcionada
  const wellData = {
    id: 12,
    name: "Pozo 12",
    service: "Servicios",
    location: "Calle Navio 358",
    annexCode: "06NVL14666/24ELGR06 (21)",
    titleCode: "06NVL108500/24EMOC08",
    m3PerAnnex: 90.885,
    status: "active",
    yearlyData: [
      {
        year: 2022,
        m3CededByAnnex: 25.000,
        m3CededByTitle: 0,
        realConsumption: 670.9,
        availableForConsumption: 65.885,
        observations: "Consumo muy bajo respecto al volumen disponible."
      },
      {
        year: 2023,
        m3CededByAnnex: 80.000,
        m3CededByTitle: 0,
        realConsumption: 0,
        availableForConsumption: 10.885,
        observations: "Sin consumo registrado en el año."
      },
      {
        year: 2024,
        m3CededByAnnex: 20.000,
        m3CededByTitle: 0,
        realConsumption: 36152.49,
        availableForConsumption: 70.885,
        observations: "Se realizó el consumo, aunque menor a lo permitido."
      },
      {
        year: "2025 (hasta mayo)",
        m3CededByAnnex: 20.000,
        m3CededByTitle: 0,
        realConsumption: 84493.00,
        availableForConsumption: 70.885,
        observations: "El consumo hasta mayo ya excede el volumen disponible."
      }
    ],
    quarterlyData: [
      // 2024 - Datos Trimestrales
      {
        period: "Q1 2024",
        quarter: "T1 2024",
        m3CededByAnnex: 5.000,
        m3CededByTitle: 0,
        realConsumption: 8540.62,
        availableForConsumption: 70.885,
        observations: "Primer trimestre con consumo elevado."
      },
      {
        period: "Q2 2024",
        quarter: "T2 2024", 
        m3CededByAnnex: 5.000,
        m3CededByTitle: 0,
        realConsumption: 12050.75,
        availableForConsumption: 70.885,
        observations: "Segundo trimestre, pico de consumo."
      },
      {
        period: "Q3 2024",
        quarter: "T3 2024",
        m3CededByAnnex: 5.000,
        m3CededByTitle: 0,
        realConsumption: 9780.94,
        availableForConsumption: 70.885,
        observations: "Tercer trimestre con consumo moderado."
      },
      {
        period: "Q4 2024",
        quarter: "T4 2024",
        m3CededByAnnex: 5.000,
        m3CededByTitle: 0,
        realConsumption: 5780.18,
        availableForConsumption: 70.885,
        observations: "Cuarto trimestre, reducción del consumo."
      },
      // 2025 - Datos Trimestrales
      {
        period: "Q1 2025",
        quarter: "T1 2025",
        m3CededByAnnex: 7.500,
        m3CededByTitle: 0,
        realConsumption: 3456.89,
        availableForConsumption: 75.885,
        observations: "Primer trimestre 2025, consumo controlado."
      },
      {
        period: "Q2 2025",
        quarter: "T2 2025",
        m3CededByAnnex: 7.500,
        m3CededByTitle: 0,
        realConsumption: 1747.44,
        availableForConsumption: 75.885,
        observations: "Segundo trimestre 2025, consumo bajo."
      }
    ],
    monthlyData: [
      // 2024 - Datos Mensuales Detallados
      {
        period: "Ene 2024",
        month: "Enero",
        m3CededByAnnex: 1.667,
        m3CededByTitle: 0,
        realConsumption: 2846.87,
        availableForConsumption: 70.885,
        observations: "Enero: Consumo normal de inicio de año."
      },
      {
        period: "Feb 2024", 
        month: "Febrero",
        m3CededByAnnex: 1.667,
        m3CededByTitle: 0,
        realConsumption: 2893.45,
        availableForConsumption: 70.885,
        observations: "Febrero: Ligero incremento respecto a enero."
      },
      {
        period: "Mar 2024",
        month: "Marzo", 
        m3CededByAnnex: 1.666,
        m3CededByTitle: 0,
        realConsumption: 2800.30,
        availableForConsumption: 70.885,
        observations: "Marzo: Estabilización del consumo."
      },
      {
        period: "Abr 2024",
        month: "Abril",
        m3CededByAnnex: 1.667,
        m3CededByTitle: 0,
        realConsumption: 4016.92,
        availableForConsumption: 70.885,
        observations: "Abril: Incremento notable del consumo."
      },
      {
        period: "May 2024",
        month: "Mayo",
        m3CededByAnnex: 1.667,
        m3CededByTitle: 0,
        realConsumption: 4033.83,
        availableForConsumption: 70.885,
        observations: "Mayo: Consumo mantenido alto."
      },
      {
        period: "Jun 2024",
        month: "Junio",
        m3CededByAnnex: 1.666,
        m3CededByTitle: 0,
        realConsumption: 4000.00,
        availableForConsumption: 70.885,
        observations: "Junio: Pico máximo del semestre."
      },
      {
        period: "Jul 2024",
        month: "Julio",
        m3CededByAnnex: 1.667,
        m3CededByTitle: 0,
        realConsumption: 3260.31,
        availableForConsumption: 70.885,
        observations: "Julio: Reducción tras el pico de junio."
      },
      {
        period: "Ago 2024",
        month: "Agosto",
        m3CededByAnnex: 1.667,
        m3CededByTitle: 0,
        realConsumption: 3260.31,
        availableForConsumption: 70.885,
        observations: "Agosto: Consumo estable."
      },
      {
        period: "Sep 2024",
        month: "Septiembre",
        m3CededByAnnex: 1.666,
        m3CededByTitle: 0,
        realConsumption: 3260.32,
        availableForConsumption: 70.885,
        observations: "Septiembre: Fin de trimestre controlado."
      },
      {
        period: "Oct 2024",
        month: "Octubre",
        m3CededByAnnex: 1.667,
        m3CededByTitle: 0,
        realConsumption: 1926.73,
        availableForConsumption: 70.885,
        observations: "Octubre: Reducción significativa."
      },
      {
        period: "Nov 2024",
        month: "Noviembre",
        m3CededByAnnex: 1.667,
        m3CededByTitle: 0,
        realConsumption: 1926.73,
        availableForConsumption: 70.885,
        observations: "Noviembre: Consumo bajo mantenido."
      },
      {
        period: "Dic 2024",
        month: "Diciembre",
        m3CededByAnnex: 1.666,
        m3CededByTitle: 0,
        realConsumption: 1926.72,
        availableForConsumption: 70.885,
        observations: "Diciembre: Cierre de año con bajo consumo."
      },
      // 2025 - Datos Mensuales
      {
        period: "Ene 2025",
        month: "Enero",
        m3CededByAnnex: 2.500,
        m3CededByTitle: 0,
        realConsumption: 1152.30,
        availableForConsumption: 75.885,
        observations: "Enero 2025: Inicio controlado del año."
      },
      {
        period: "Feb 2025",
        month: "Febrero",
        m3CededByAnnex: 2.500,
        m3CededByTitle: 0,
        realConsumption: 1152.30,
        availableForConsumption: 75.885,
        observations: "Febrero 2025: Consumo estable."
      },
      {
        period: "Mar 2025",
        month: "Marzo",
        m3CededByAnnex: 2.500,
        m3CededByTitle: 0,
        realConsumption: 1152.29,
        availableForConsumption: 75.885,
        observations: "Marzo 2025: Cierre T1 controlado."
      },
      {
        period: "Abr 2025",
        month: "Abril",
        m3CededByAnnex: 2.500,
        m3CededByTitle: 0,
        realConsumption: 873.72,
        availableForConsumption: 75.885,
        observations: "Abril 2025: Consumo muy bajo."
      },
      {
        period: "May 2025",
        month: "Mayo",
        m3CededByAnnex: 2.500,
        m3CededByTitle: 0,
        realConsumption: 873.72,
        availableForConsumption: 75.885,
        observations: "Mayo 2025: Consumo mantenido bajo."
      }
    ],
    technicalSpecs: {
      depth: "45m",
      waterLevel: "12m",
      flow: "850 L/min",
      pressure: "2.3 bar",
      temperature: "19°C",
      ph: "7.1",
      quality: "good"
    }
  }

  // Opciones de métricas disponibles para graficar
  const availableMetrics = [
    { key: 'realConsumption', label: 'Consumo Real (m³)', color: '#dc2626' },
    { key: 'availableForConsumption', label: 'm³ Disponibles', color: '#16a34a' },
    { key: 'm3CededByAnnex', label: 'm³ Cedidos por Anexo', color: '#2563eb' },
    { key: 'm3CededByTitle', label: 'm³ Cedidos por Título', color: '#7c3aed' }
  ]

  // Preparar datos para los gráficos según el filtro de tiempo
  const getChartData = () => {
    let sourceData = []
    let labelKey = 'year'
    
    switch (timeFilter) {
      case 'quarterly':
        sourceData = wellData.quarterlyData || []
        labelKey = 'quarter'
        break
      case 'monthly':
        sourceData = wellData.monthlyData || []
        labelKey = 'period'
        break
      case 'yearly':
      default:
        sourceData = wellData.yearlyData || []
        labelKey = 'year'
        break
    }
    
    return sourceData.map(data => ({
      [labelKey]: timeFilter === 'yearly' 
        ? data.year.toString().replace(' (hasta mayo)', '')
        : data[labelKey],
      realConsumption: data.realConsumption,
      availableForConsumption: data.availableForConsumption,
      m3CededByAnnex: data.m3CededByAnnex,
      m3CededByTitle: data.m3CededByTitle,
      efficiency: data.availableForConsumption > 0 
        ? ((data.realConsumption / data.availableForConsumption) * 100).toFixed(1)
        : 0
    }))
  }

  const chartData = getChartData()

  // Función para alternar métricas seleccionadas
  const toggleMetric = (metricKey) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    )
  }

  const getConsumptionTrend = (current, previous) => {
    if (!previous || previous === 0) return "new"
    if (current > previous) return "up"
    if (current < previous) return "down"
    return "stable"
  }

  const getConsumptionStatus = (real, available) => {
    const percentage = (real / available) * 100
    if (percentage > 100) return { status: "critical", color: "red", text: "Excede límite" }
    if (percentage > 80) return { status: "warning", color: "yellow", text: "Cerca del límite" }
    if (percentage > 50) return { status: "normal", color: "green", text: "Uso normal" }
    return { status: "low", color: "blue", text: "Uso bajo" }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar fijo */}
      <DashboardSidebar />
      
      {/* Contenido principal con margen para el sidebar */}
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="space-y-6">
            {/* Header con navegación de regreso */}
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/pozos')}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Volver a Pozos
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{wellData.name}</h1>
                <p className="text-gray-600 mt-1">Información detallada y consumo histórico</p>
              </div>
            </div>

            {/* Información general del pozo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <InfoIcon className="h-5 w-5" />
                    Información General
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ubicación</label>
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {wellData.location}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Servicio</label>
                        <p className="text-sm text-gray-900">{wellData.service}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Código de Anexo</label>
                        <p className="text-sm text-gray-900 font-mono">{wellData.annexCode}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Código de Título</label>
                        <p className="text-sm text-gray-900 font-mono">{wellData.titleCode}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">m³ por Anexo</label>
                        <p className="text-sm text-gray-900">{wellData.m3PerAnnex.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Estado</label>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Especificaciones técnicas */}
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    Especificaciones Técnicas
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Profundidad:</span>
                      <span className="text-sm font-medium text-gray-900">{wellData.technicalSpecs.depth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Nivel de agua:</span>
                      <span className="text-sm font-medium text-gray-900">{wellData.technicalSpecs.waterLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Caudal:</span>
                      <span className="text-sm font-medium text-gray-900">{wellData.technicalSpecs.flow}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Presión:</span>
                      <span className="text-sm font-medium text-gray-900">{wellData.technicalSpecs.pressure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Temperatura:</span>
                      <span className="text-sm font-medium text-gray-900">{wellData.technicalSpecs.temperature}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">pH:</span>
                      <span className="text-sm font-medium text-gray-900">{wellData.technicalSpecs.ph}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Historial de consumo */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Historial de Consumo
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Año
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          m³ cedidos por anexo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          m³ cedidos por título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consumo real (m³)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          m³ disponibles para consumir
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Observaciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {wellData.yearlyData.map((data, index) => {
                        const consumptionStatus = getConsumptionStatus(data.realConsumption, data.availableForConsumption)
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {data.year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {data.m3CededByAnnex.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {data.m3CededByTitle.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center gap-2">
                                {data.realConsumption.toLocaleString()}
                                {index > 0 && wellData.yearlyData[index - 1] && (
                                  <>
                                    {getConsumptionTrend(data.realConsumption, wellData.yearlyData[index - 1].realConsumption) === 'up' && (
                                      <TrendingUpIcon className="h-4 w-4 text-red-500" />
                                    )}
                                    {getConsumptionTrend(data.realConsumption, wellData.yearlyData[index - 1].realConsumption) === 'down' && (
                                      <TrendingDownIcon className="h-4 w-4 text-green-500" />
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {data.availableForConsumption.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={`bg-${consumptionStatus.color}-100 text-${consumptionStatus.color}-800 border-${consumptionStatus.color}-200`}>
                                {consumptionStatus.text}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                              <div className="flex items-start gap-2">
                                {consumptionStatus.status === 'critical' && (
                                  <AlertTriangleIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                )}
                                <span className="line-clamp-2">{data.observations}</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Análisis Gráfico de Datos Históricos */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3Icon className="h-5 w-5" />
                    Análisis Gráfico de Datos Históricos
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FilterIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Período:</span>
                      <select 
                        value={timeFilter} 
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="yearly">Anual</option>
                        <option value="quarterly">Trimestral</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Tipo de Gráfico:</span>
                      <select 
                        value={chartType} 
                        onChange={(e) => setChartType(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="line">Líneas</option>
                        <option value="bar">Barras</option>
                        <option value="area">Área</option>
                        <option value="composed">Combinado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Filtros de métricas */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Selecciona las métricas a visualizar:</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableMetrics.map((metric) => (
                      <Button
                        key={metric.key}
                        size="sm"
                        variant={selectedMetrics.includes(metric.key) ? "default" : "outline"}
                        onClick={() => toggleMetric(metric.key)}
                        className={selectedMetrics.includes(metric.key) ? 
                          "border-2" : 
                          "border border-gray-300 hover:border-gray-400"
                        }
                        style={selectedMetrics.includes(metric.key) ? 
                          { backgroundColor: metric.color, borderColor: metric.color } : 
                          {}
                        }
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: metric.color }}
                        ></div>
                        {metric.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Gráfico principal con Chart.js */}
                <ChartComponent 
                  chartType={chartType}
                  chartData={chartData}
                  selectedMetrics={selectedMetrics}
                  availableMetrics={availableMetrics}
                />

                {/* Estadísticas del gráfico */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tendencia de Consumo</h4>
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-900">
                        Incremento del {(((chartData[chartData.length-1]?.realConsumption || 0) / (chartData[0]?.realConsumption || 1) - 1) * 100).toFixed(1)}% desde 2022
                      </span>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Promedio Anual</h4>
                    <span className="text-lg font-semibold text-gray-900">
                      {(chartData.reduce((sum, item) => sum + item.realConsumption, 0) / chartData.length).toLocaleString()} m³
                    </span>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Eficiencia 2025</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        parseFloat(chartData[chartData.length-1]?.efficiency || 0) > 100 
                          ? "bg-red-100 text-red-800 border-red-200" 
                          : "bg-green-100 text-green-800 border-green-200"
                      }>
                        {chartData[chartData.length-1]?.efficiency || 0}%
                      </Badge>
                      <span className="text-xs text-gray-500">del disponible</span>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>

            {/* Alertas y recomendaciones específicas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                    Alertas Críticas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-red-50 border-l-4 border-red-400 rounded">
                      <AlertTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          Consumo excesivo en 2025
                        </p>
                        <p className="text-sm text-red-700">
                          El consumo hasta mayo (84,493 m³) excede significativamente el volumen disponible (70,885 m³)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <AlertTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">
                          Incremento abrupto de consumo
                        </p>
                        <p className="text-sm text-yellow-700">
                          El consumo aumentó drasticamente de 36,152 m³ en 2024 a 84,493 m³ en solo 5 meses de 2025
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recomendaciones
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <InfoIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Revisión de permisos
                        </p>
                        <p className="text-sm text-blue-700">
                          Solicitar ampliación de derechos de agua o revisar la distribución actual
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-green-50 border-l-4 border-green-400 rounded">
                      <InfoIcon className="h-5 w-5 text-green-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Implementar medidas de control
                        </p>
                        <p className="text-sm text-green-700">
                          Instalar sistemas de monitoreo en tiempo real para controlar el consumo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}