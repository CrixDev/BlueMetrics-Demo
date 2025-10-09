import { useState, useEffect } from "react"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { 
  DropletIcon, 
  TrendingUpIcon,
  TrendingDownIcon,
  FilterIcon,
  BarChart3Icon,
  RecycleIcon,
  ActivityIcon
} from "lucide-react"
import ChartComponent from '../components/ChartComponent'
import datosPTAR from '../lib/datos_ptar.json'

export default function PTARPage() {
  // Estados para los filtros de gráficas
  const [timeFilter, setTimeFilter] = useState('yearly') // 'yearly', 'quarterly', 'monthly'
  const [dateRange, setDateRange] = useState('all') // 'all', 'lastyear', 'custom'
  const [chartType, setChartType] = useState('line')
  const [selectedMetrics, setSelectedMetrics] = useState(['aguasNegras', 'aguaTratada', 'consumoPozosRiego'])

  // Obtener datos del año actual y anterior para comparación
  const currentYearData = datosPTAR.datos_anuales[datosPTAR.datos_anuales.length - 1]
  const previousYearData = datosPTAR.datos_anuales[datosPTAR.datos_anuales.length - 2]

  // Calcular variaciones porcentuales
  const calculateVariation = (current, previous) => {
    if (!previous || previous === 0) return 0
    return (((current - previous) / previous) * 100).toFixed(1)
  }

  const aguasNegrasVariation = calculateVariation(
    currentYearData.aguas_negras_m3,
    previousYearData.aguas_negras_m3
  )
  const aguaTratadaVariation = calculateVariation(
    currentYearData.agua_tratada_m3,
    previousYearData.agua_tratada_m3
  )
  const consumoPozosVariation = calculateVariation(
    currentYearData.consumo_pozos_riego_m3,
    previousYearData.consumo_pozos_riego_m3
  )

  // Métricas disponibles para graficar
  const availableMetrics = [
    { key: 'aguasNegras', label: 'Aguas Negras (m³)', color: '#dc2626' },
    { key: 'aguaTratada', label: 'Agua Tratada (m³)', color: '#16a34a' },
    { key: 'consumoPozosRiego', label: 'Consumo Pozos Riego (m³)', color: '#2563eb' },
    { key: 'eficiencia', label: 'Eficiencia (%)', color: '#7c3aed' }
  ]

  // Preparar datos para los gráficos según el filtro de tiempo
  const getChartData = () => {
    if (timeFilter === 'yearly') {
      return datosPTAR.datos_anuales.map(data => ({
        year: data.año.toString().replace(' (hasta junio)', ''),
        aguasNegras: data.aguas_negras_m3,
        aguaTratada: data.agua_tratada_m3,
        consumoPozosRiego: data.consumo_pozos_riego_m3,
        eficiencia: data.eficiencia_tratamiento_porcentaje
      }))
    } else if (timeFilter === 'quarterly') {
      const quarterlyData = []
      const quarterLabels = ['T1', 'T2', 'T3', 'T4']
      
      datosPTAR.datos_trimestrales.aguas_negras.forEach((yearData, index) => {
        const aguaTratadaYear = datosPTAR.datos_trimestrales.agua_tratada[index]
        const consumoPozosYear = datosPTAR.datos_trimestrales.consumo_pozos_riego[index]
        
        quarterLabels.forEach((label, qIndex) => {
          const quarterKey = ['primer_trimestre', 'segundo_trimestre', 'tercer_trimestre', 'cuarto_trimestre'][qIndex]
          if (yearData[quarterKey] !== null) {
            quarterlyData.push({
              quarter: `${label} ${yearData.año}`,
              aguasNegras: yearData[quarterKey],
              aguaTratada: aguaTratadaYear[quarterKey],
              consumoPozosRiego: consumoPozosYear[quarterKey],
              eficiencia: aguaTratadaYear[quarterKey] > 0 
                ? ((aguaTratadaYear[quarterKey] / yearData[quarterKey]) * 100).toFixed(1)
                : 0
            })
          }
        })
      })
      
      return quarterlyData
    } else if (timeFilter === 'monthly') {
      const monthlyData = []
      const monthNames = {
        'enero': 'Ene', 'febrero': 'Feb', 'marzo': 'Mar', 
        'abril': 'Abr', 'mayo': 'May', 'junio': 'Jun',
        'julio': 'Jul', 'agosto': 'Ago', 'septiembre': 'Sep', 
        'octubre': 'Oct', 'noviembre': 'Nov', 'diciembre': 'Dic'
      }
      
      datosPTAR.datos_mensuales.aguas_negras.forEach((yearData, index) => {
        const aguaTratadaYear = datosPTAR.datos_mensuales.agua_tratada[index]
        const consumoPozosYear = datosPTAR.datos_mensuales.consumo_pozos_riego[index]
        
        Object.entries(monthNames).forEach(([month, shortMonth]) => {
          if (yearData[month] !== null) {
            monthlyData.push({
              period: `${shortMonth} ${yearData.año}`,
              aguasNegras: yearData[month],
              aguaTratada: aguaTratadaYear[month],
              consumoPozosRiego: consumoPozosYear[month],
              eficiencia: aguaTratadaYear[month] > 0 
                ? ((aguaTratadaYear[month] / yearData[month]) * 100).toFixed(1)
                : 0
            })
          }
        })
      })
      
      return monthlyData
    }
    
    return []
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

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar fijo */}
      <DashboardSidebar />
      
      {/* Contenido principal con margen para el sidebar */}
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <RecycleIcon className="h-8 w-8 text-blue-600" />
                PTAR - Planta de Tratamiento de Aguas Residuales
              </h1>
              <p className="text-gray-600 mt-1">Monitoreo y análisis de tratamiento de aguas</p>
            </div>

            {/* Mini Dashboard - Tarjetas de métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Aguas Negras */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Aguas Negras</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {currentYearData.aguas_negras_m3.toLocaleString()} m³
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">vs año anterior</span>
                      <Badge 
                        className={`flex items-center gap-1 ${
                          parseFloat(aguasNegrasVariation) > 0 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}
                      >
                        {parseFloat(aguasNegrasVariation) > 0 ? (
                          <TrendingUpIcon className="h-3 w-3" />
                        ) : (
                          <TrendingDownIcon className="h-3 w-3" />
                        )}
                        {Math.abs(aguasNegrasVariation)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <DropletIcon className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </Card>

              {/* Agua Tratada */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Agua Tratada</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {currentYearData.agua_tratada_m3.toLocaleString()} m³
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">vs año anterior</span>
                      <Badge 
                        className={`flex items-center gap-1 ${
                          parseFloat(aguaTratadaVariation) > 0 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {parseFloat(aguaTratadaVariation) > 0 ? (
                          <TrendingUpIcon className="h-3 w-3" />
                        ) : (
                          <TrendingDownIcon className="h-3 w-3" />
                        )}
                        {Math.abs(aguaTratadaVariation)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <RecycleIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </Card>

              {/* Consumo Pozos Riego */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Consumo Pozos Riego</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {currentYearData.consumo_pozos_riego_m3.toLocaleString()} m³
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">vs año anterior</span>
                      <Badge 
                        className={`flex items-center gap-1 ${
                          parseFloat(consumoPozosVariation) > 0 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}
                      >
                        {parseFloat(consumoPozosVariation) > 0 ? (
                          <TrendingUpIcon className="h-3 w-3" />
                        ) : (
                          <TrendingDownIcon className="h-3 w-3" />
                        )}
                        {Math.abs(consumoPozosVariation)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <ActivityIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Tarjeta de Eficiencia */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Eficiencia de Tratamiento</h3>
                  <p className="text-sm text-gray-500 mt-1">Porcentaje de agua tratada vs aguas negras recibidas</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-green-600">
                    {currentYearData.eficiencia_tratamiento_porcentaje}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentYearData.año}
                  </p>
                </div>
              </div>
            </Card>

            {/* Análisis Gráfico */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3Icon className="h-5 w-5" />
                    Análisis Histórico PTAR
                  </h2>
                  <div className="flex flex-wrap items-center gap-4">
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

                {/* Gráfico principal */}
                <ChartComponent 
                  chartType={chartType}
                  chartData={chartData}
                  selectedMetrics={selectedMetrics}
                  availableMetrics={availableMetrics}
                />

                {/* Estadísticas del gráfico */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Promedio Aguas Negras</h4>
                    <span className="text-lg font-semibold text-gray-900">
                      {(datosPTAR.datos_anuales.reduce((sum, item) => sum + item.aguas_negras_m3, 0) / datosPTAR.datos_anuales.length).toLocaleString()} m³
                    </span>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Promedio Agua Tratada</h4>
                    <span className="text-lg font-semibold text-gray-900">
                      {(datosPTAR.datos_anuales.reduce((sum, item) => sum + item.agua_tratada_m3, 0) / datosPTAR.datos_anuales.length).toLocaleString()} m³
                    </span>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Eficiencia Promedio</h4>
                    <span className="text-lg font-semibold text-green-600">
                      {(datosPTAR.datos_anuales.reduce((sum, item) => sum + item.eficiencia_tratamiento_porcentaje, 0) / datosPTAR.datos_anuales.length).toFixed(1)}%
                    </span>
                  </Card>
                </div>
              </div>
            </Card>

            {/* Tabla de datos anuales */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial Anual</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Año
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aguas Negras (m³)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agua Tratada (m³)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consumo Pozos Riego (m³)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Eficiencia (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Observaciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {datosPTAR.datos_anuales.map((data, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {data.año}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.aguas_negras_m3.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.agua_tratada_m3.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.consumo_pozos_riego_m3.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <Badge className={
                              data.eficiencia_tratamiento_porcentaje >= 95 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : data.eficiencia_tratamiento_porcentaje >= 90
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }>
                              {data.eficiencia_tratamiento_porcentaje}%
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {data.observaciones}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

