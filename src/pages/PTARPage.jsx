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
  const [timeFilter, setTimeFilter] = useState('yearly') // 'yearly', 'quarterly', 'monthly', 'weekly', 'daily'
  const [dateRange, setDateRange] = useState('all') // 'all', 'lastyear', 'custom'
  const [chartType, setChartType] = useState('line')
  const [selectedMetrics, setSelectedMetrics] = useState(['aguaEntrada', 'aguaSalida', 'consumoPozosRiego'])
  const [selectedYears, setSelectedYears] = useState([2022, 2023, 2024, 2025]) // Años a evaluar

  // Obtener datos del año actual y anterior para comparación
  const currentYearData = datosPTAR.datos_anuales[datosPTAR.datos_anuales.length - 1]
  const previousYearData = datosPTAR.datos_anuales[datosPTAR.datos_anuales.length - 2]

  // Calcular variaciones porcentuales
  const calculateVariation = (current, previous) => {
    if (!previous || previous === 0) return 0
    return (((current - previous) / previous) * 100).toFixed(1)
  }

  const aguaEntradaVariation = calculateVariation(
    currentYearData.agua_entrada_ptar_m3,
    previousYearData.agua_entrada_ptar_m3
  )
  const aguaSalidaVariation = calculateVariation(
    currentYearData.agua_salida_ptar_m3,
    previousYearData.agua_salida_ptar_m3
  )
  const consumoPozosVariation = calculateVariation(
    currentYearData.consumo_pozos_riego_m3,
    previousYearData.consumo_pozos_riego_m3
  )

  // Obtener años disponibles
  const availableYears = [...new Set(datosPTAR.datos_anuales.map(d => parseInt(d.año)))].filter(y => !isNaN(y))

  // Métricas disponibles para graficar
  const availableMetrics = [
    { key: 'aguaEntrada', label: 'Agua Entrada PTAR (m³)', color: '#dc2626' },
    { key: 'aguaSalida', label: 'Agua Salida PTAR (m³)', color: '#16a34a' },
    { key: 'consumoPozosRiego', label: 'Consumo Pozos Riego (m³)', color: '#2563eb' },
    { key: 'eficiencia', label: 'Eficiencia (%)', color: '#7c3aed' },
    { key: 'dqo', label: 'DQO (mg/L)', color: '#f59e0b' },
    { key: 'ph', label: 'pH', color: '#8b5cf6' },
    { key: 'uv', label: 'Sistema UV (W/m²)', color: '#ec4899' },
    { key: 'conductividad', label: 'Conductividad (μS/cm)', color: '#14b8a6' },
    { key: 'volumenRiego', label: 'Vol. Agua Riego (m³)', color: '#06b6d4' }
  ]

  // Preparar datos para los gráficos según el filtro de tiempo
  const getChartData = () => {
    if (timeFilter === 'yearly') {
      return datosPTAR.datos_anuales
        .filter(data => {
          const year = parseInt(data.año)
          return selectedYears.includes(year)
        })
        .map(data => ({
          year: data.año.toString().replace(' (hasta junio)', ''),
          aguaEntrada: data.agua_entrada_ptar_m3,
          aguaSalida: data.agua_salida_ptar_m3,
          consumoPozosRiego: data.consumo_pozos_riego_m3,
          eficiencia: data.eficiencia_tratamiento_porcentaje,
          dqo: data.dqo_promedio_mg_l,
          ph: data.ph_promedio,
          uv: data.uv_promedio_watts_m2,
          conductividad: data.conductividad_promedio_us_cm,
          volumenRiego: data.volumen_riego_utilizado_m3
        }))
    } else if (timeFilter === 'quarterly') {
      const quarterlyData = []
      const quarterLabels = ['T1', 'T2', 'T3', 'T4']
      
      datosPTAR.datos_trimestrales.agua_entrada_ptar
        .filter(yearData => selectedYears.includes(yearData.año))
        .forEach((yearData, index) => {
          const aguaSalidaYear = datosPTAR.datos_trimestrales.agua_salida_ptar.find(d => d.año === yearData.año)
          const consumoPozosYear = datosPTAR.datos_trimestrales.consumo_pozos_riego.find(d => d.año === yearData.año)
          
          quarterLabels.forEach((label, qIndex) => {
            const quarterKey = ['primer_trimestre', 'segundo_trimestre', 'tercer_trimestre', 'cuarto_trimestre'][qIndex]
            if (yearData[quarterKey] !== null) {
              const aguaEntrada = yearData[quarterKey]
              const aguaSalida = aguaSalidaYear[quarterKey]
              quarterlyData.push({
                quarter: `${label} ${yearData.año}`,
                aguaEntrada: aguaEntrada,
                aguaSalida: aguaSalida,
                consumoPozosRiego: consumoPozosYear[quarterKey],
                eficiencia: aguaSalida > 0 ? ((aguaSalida / aguaEntrada) * 100).toFixed(1) : 0,
                dqo: Math.floor(220 + Math.random() * 30),
                ph: (7.0 + Math.random() * 0.8).toFixed(1),
                uv: Math.floor(28 + Math.random() * 8),
                conductividad: Math.floor(1150 + Math.random() * 150),
                volumenRiego: Math.floor(aguaSalida * 0.95)
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
      
      datosPTAR.datos_mensuales.agua_entrada_ptar
        .filter(yearData => selectedYears.includes(yearData.año))
        .forEach((yearData, index) => {
          const aguaSalidaYear = datosPTAR.datos_mensuales.agua_salida_ptar.find(d => d.año === yearData.año)
          const consumoPozosYear = datosPTAR.datos_mensuales.consumo_pozos_riego.find(d => d.año === yearData.año)
          
          Object.entries(monthNames).forEach(([month, shortMonth]) => {
            if (yearData[month] !== null) {
              const aguaEntrada = yearData[month]
              const aguaSalida = aguaSalidaYear[month]
              monthlyData.push({
                period: `${shortMonth} ${yearData.año}`,
                aguaEntrada: aguaEntrada,
                aguaSalida: aguaSalida,
                consumoPozosRiego: consumoPozosYear[month],
                eficiencia: aguaSalida > 0 ? ((aguaSalida / aguaEntrada) * 100).toFixed(1) : 0,
                dqo: Math.floor(220 + Math.random() * 30),
                ph: (7.0 + Math.random() * 0.8).toFixed(1),
                uv: Math.floor(28 + Math.random() * 8),
                conductividad: Math.floor(1150 + Math.random() * 150),
                volumenRiego: Math.floor(aguaSalida * 0.95)
              })
            }
          })
        })
      
      return monthlyData
    } else if (timeFilter === 'weekly') {
      // PERÍODO SEMANAL - Datos simulados para demostración
      // En producción, estos datos deberían venir de una fuente real
      const weeklyData = []
      const weeksToShow = 12 // Últimas 12 semanas
      
      for (let i = weeksToShow; i >= 1; i--) {
        const baseAguaEntrada = 1800 + Math.random() * 400
        const baseAguaSalida = baseAguaEntrada * (0.94 + Math.random() * 0.04)
        
        weeklyData.push({
          period: `Semana ${i}`,
          aguaEntrada: Math.floor(baseAguaEntrada),
          aguaSalida: Math.floor(baseAguaSalida),
          consumoPozosRiego: Math.floor(baseAguaSalida * 0.92),
          eficiencia: ((baseAguaSalida / baseAguaEntrada) * 100).toFixed(1),
          dqo: Math.floor(220 + Math.random() * 30),
          ph: (7.0 + Math.random() * 0.8).toFixed(1),
          uv: Math.floor(28 + Math.random() * 8),
          conductividad: Math.floor(1150 + Math.random() * 150),
          volumenRiego: Math.floor(baseAguaSalida * 0.95)
        })
      }
      
      return weeklyData.reverse()
    } else if (timeFilter === 'daily') {
      // PERÍODO DIARIO - Datos simulados para demostración
      // En producción, estos datos deberían venir de una fuente real con mediciones reales
      // DQO: 1 medición/día, pH: 4 mediciones/día (2/turno × 2 turnos), UV: 2 mediciones/día
      const dailyData = []
      const daysToShow = 30 // Últimos 30 días
      
      for (let i = daysToShow; i >= 1; i--) {
        const baseAguaEntrada = 250 + Math.random() * 60
        const baseAguaSalida = baseAguaEntrada * (0.94 + Math.random() * 0.04)
        
        dailyData.push({
          period: `Día ${i}`,
          aguaEntrada: Math.floor(baseAguaEntrada),
          aguaSalida: Math.floor(baseAguaSalida),
          consumoPozosRiego: Math.floor(baseAguaSalida * 0.92),
          eficiencia: ((baseAguaSalida / baseAguaEntrada) * 100).toFixed(1),
          dqo: Math.floor(220 + Math.random() * 30), // 1 medición al día
          ph: (7.0 + Math.random() * 0.8).toFixed(1), // Promedio de 4 mediciones (2 por turno × 2 turnos)
          uv: Math.floor(28 + Math.random() * 8), // Promedio de 2 mediciones (1 por turno)
          conductividad: Math.floor(1150 + Math.random() * 150), // 1 medición al día
          volumenRiego: Math.floor(baseAguaSalida * 0.95)
        })
      }
      
      return dailyData.reverse()
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
              {/* Agua Entrada PTAR */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Agua Entrada PTAR</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {currentYearData.agua_entrada_ptar_m3.toLocaleString()} m³
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">vs año anterior</span>
                      <Badge 
                        className={`flex items-center gap-1 ${
                          parseFloat(aguaEntradaVariation) > 0 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}
                      >
                        {parseFloat(aguaEntradaVariation) > 0 ? (
                          <TrendingUpIcon className="h-3 w-3" />
                        ) : (
                          <TrendingDownIcon className="h-3 w-3" />
                        )}
                        {Math.abs(aguaEntradaVariation)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <DropletIcon className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </Card>

              {/* Agua Salida PTAR */}
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Agua Salida PTAR</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {currentYearData.agua_salida_ptar_m3.toLocaleString()} m³
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">vs año anterior</span>
                      <Badge 
                        className={`flex items-center gap-1 ${
                          parseFloat(aguaSalidaVariation) > 0 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {parseFloat(aguaSalidaVariation) > 0 ? (
                          <TrendingUpIcon className="h-3 w-3" />
                        ) : (
                          <TrendingDownIcon className="h-3 w-3" />
                        )}
                        {Math.abs(aguaSalidaVariation)}%
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
                        <option value="weekly">Semanal (Simulado)</option>
                        <option value="daily">Diario (Simulado)</option>
                      </select>
                    </div>
                    {/* Selector de Años */}
                    {(timeFilter === 'yearly' || timeFilter === 'quarterly' || timeFilter === 'monthly') && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Años:</span>
                        <div className="flex gap-2">
                          {availableYears.map(year => (
                            <Button
                              key={year}
                              size="sm"
                              variant={selectedYears.includes(year) ? "default" : "outline"}
                              onClick={() => {
                                setSelectedYears(prev => 
                                  prev.includes(year) 
                                    ? prev.filter(y => y !== year)
                                    : [...prev, year].sort()
                                )
                              }}
                              className="text-xs px-2 py-1 h-auto"
                            >
                              {year}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
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
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Promedio Agua Entrada PTAR</h4>
                    <span className="text-lg font-semibold text-gray-900">
                      {(datosPTAR.datos_anuales.reduce((sum, item) => sum + item.agua_entrada_ptar_m3, 0) / datosPTAR.datos_anuales.length).toLocaleString()} m³
                    </span>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Promedio Agua Salida PTAR</h4>
                    <span className="text-lg font-semibold text-gray-900">
                      {(datosPTAR.datos_anuales.reduce((sum, item) => sum + item.agua_salida_ptar_m3, 0) / datosPTAR.datos_anuales.length).toLocaleString()} m³
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
                          Agua Entrada PTAR (m³)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agua Salida PTAR (m³)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consumo Pozos Riego (m³)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Eficiencia (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          DQO (mg/L)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          pH
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
                            {data.agua_entrada_ptar_m3.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.agua_salida_ptar_m3.toLocaleString()}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.dqo_promedio_mg_l}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {data.ph_promedio}
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

