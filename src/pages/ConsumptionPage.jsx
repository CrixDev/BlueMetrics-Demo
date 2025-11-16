import { useState, useEffect } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import ChartComponent from "../components/ChartComponent"
import DashboardChart from "../components/DashboardChart"
import ConsumptionTable from "../components/ConsumptionTable"
import WeeklyComparisonChart from "../components/WeeklyComparisonChart"
import WeeklyComparisonTable from "../components/WeeklyComparisonTable"
import datosPozo12 from '../lib/datos_pozo_12.json'
import consumptionPointsData from '../lib/consumption-points.json'
import { dashboardData } from '../lib/dashboard-data'
import { supabase } from '../supabaseClient'
import { 
  FilterIcon, 
  TrendingUpIcon, 
  AlertTriangleIcon, 
  DropletIcon, 
  ActivityIcon,
  BarChart3Icon,
  CalendarIcon,
  DownloadIcon,
  Truck,
  Building2,
  Waves,
  Factory,
  TableIcon,
  Loader2Icon
} from 'lucide-react'

import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth';
import { getTableNameByYear, AVAILABLE_YEARS, DEFAULT_YEAR } from '../utils/tableHelpers';

export default function ConsumptionPage() {
  const [timeFrame, setTimeFrame] = useState('monthly')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [chartType, setChartType] = useState('bar')
  const [viewMode, setViewMode] = useState('Consumo Total') // 'servicios', 'riego', 'conjunto'
  const [periodView, setPeriodView] = useState('monthly') // 'monthly', 'yearly'
  const [selectedYearsComparison, setSelectedYearsComparison] = useState(['2024', '2025']) // Años para comparar
  const [selectedYearForReadings, setSelectedYearForReadings] = useState(DEFAULT_YEAR) // Año para lecturas semanales
  
  // Estados para el nuevo sistema de tablas detalladas
  const [activeTab, setActiveTab] = useState('pozos_servicios') // Tab activa para las tablas
  const [selectedWeek, setSelectedWeek] = useState(2) // Semana seleccionada (1 o 2)
  const [showComparison, setShowComparison] = useState(true) // Mostrar comparación entre semanas
  
  // Estados para datos de Supabase
  const [weeklyReadings, setWeeklyReadings] = useState([])
  const [availableWeeks, setAvailableWeeks] = useState([])
  const [consumptionPoints, setConsumptionPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para comparativas semanales
  const [selectedPoint, setSelectedPoint] = useState('medidor_general_pozos')
  const [weeklyReadings2024, setWeeklyReadings2024] = useState([])
  const [weeklyReadings2025, setWeeklyReadings2025] = useState([])

  // Cargar semanas disponibles desde Supabase cuando cambia el año de lecturas
  useEffect(() => {
    fetchWeeklyReadings()
  }, [selectedYearForReadings])

  // Cargar datos de ambos años para comparativas
  useEffect(() => {
    fetchBothYearsData()
  }, [selectedPoint])

  const fetchWeeklyReadings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const tableName = getTableNameByYear(selectedYearForReadings)
      // Obtener todas las lecturas semanales ordenadas por número de semana
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('numero_semana', { ascending: true })
      
      if (fetchError) throw fetchError
      
      console.log('✅ Lecturas semanales obtenidas:', data)
      
      setWeeklyReadings(data || [])
      
      // Crear lista de semanas disponibles
      const weeks = (data || []).map(week => ({
        weekNumber: week.numero_semana,
        startDate: week.fecha_inicio,
        endDate: week.fecha_fin
      }))
      
      setAvailableWeeks(weeks)
      
      // Si hay semanas, seleccionar la última por defecto
      if (weeks.length > 0) {
        setSelectedWeek(weeks[weeks.length - 1].weekNumber)
      }

      // Convertir datos de Supabase al formato de puntos de consumo
      processConsumptionPoints(data)
      
    } catch (err) {
      console.error('❌ Error al cargar lecturas:', err)
      setError(err.message)
      
      // Fallback a datos del JSON si hay error
      setAvailableWeeks(consumptionPointsData.metadata.weeks)
      // Mantener los puntos del JSON como fallback
      setConsumptionPoints(consumptionPointsData.categories)
    } finally {
      setLoading(false)
    }
  }

  // Procesar datos de Supabase para convertirlos en formato de puntos de consumo
  const processConsumptionPoints = (weeklyData) => {
    // Usar las categorías del JSON como estructura base
    const categories = consumptionPointsData.categories.map(category => ({
      ...category,
      points: category.points.map(point => {
        // Construir weeklyData desde Supabase
        const weeklyDataFromDB = weeklyData.map(week => {
          const reading = week[point.id]
          return {
            week: week.numero_semana,
            reading: reading !== null && reading !== undefined ? parseFloat(reading) : 0
          }
        }).filter(w => w.reading !== null)

        return {
          ...point,
          weeklyData: weeklyDataFromDB.length > 0 ? weeklyDataFromDB : point.weeklyData // Fallback al JSON
        }
      })
    }))

    setConsumptionPoints(categories)
  }

  // Función para cargar datos de ambos años para comparación
  const fetchBothYearsData = async () => {
    try {
      // Cargar datos 2024
      const { data: data2024, error: error2024 } = await supabase
        .from('lecturas_semana2024')
        .select('numero_semana, ' + selectedPoint)
        .order('numero_semana', { ascending: true })
      
      if (error2024) {
        console.error('Error cargando 2024:', error2024)
      } else {
        const formatted2024 = data2024
          .filter(d => d[selectedPoint] !== null)
          .map(d => ({
            week: d.numero_semana,
            reading: parseFloat(d[selectedPoint]) || 0
          }))
        setWeeklyReadings2024(formatted2024)
      }

      // Cargar datos 2025
      const { data: data2025, error: error2025 } = await supabase
        .from('lecturas_semana')
        .select('numero_semana, ' + selectedPoint)
        .order('numero_semana', { ascending: true })
      
      if (error2025) {
        console.error('Error cargando 2025:', error2025)
      } else {
        const formatted2025 = data2025
          .filter(d => d[selectedPoint] !== null)
          .map(d => ({
            week: d.numero_semana,
            reading: parseFloat(d[selectedPoint]) || 0
          }))
        setWeeklyReadings2025(formatted2025)
      }
    } catch (err) {
      console.error('Error al cargar datos de ambos años:', err)
    }
  }

  // Obtener datos de consumo por categoría y período
  const getConsumptionDataByCategory = (category, period = 'monthly', year = '2025') => {
    // Datos base por año (consumo total mensual en m³)
    const consumoBase = {
      '2022': {
        'enero': 8500, 'febrero': 8200, 'marzo': 8800, 'abril': 9000,
        'mayo': 9500, 'junio': 10000, 'julio': 10500, 'agosto': 10800,
        'septiembre': 10200, 'octubre': 9800, 'noviembre': 9200, 'diciembre': 8800
      },
      '2023': {
        'enero': 8800, 'febrero': 8500, 'marzo': 9100, 'abril': 9300,
        'mayo': 9800, 'junio': 10300, 'julio': 10800, 'agosto': 11100,
        'septiembre': 10500, 'octubre': 10100, 'noviembre': 9500, 'diciembre': 9100
      },
      '2024': {
        'enero': 9100, 'febrero': 8800, 'marzo': 9400, 'abril': 9600,
        'mayo': 10100, 'junio': 10600, 'julio': 11100, 'agosto': 11400,
        'septiembre': 10800, 'octubre': 10400, 'noviembre': 9800, 'diciembre': 9400
      },
      '2025': {
        'enero': 9400, 'febrero': 9100, 'marzo': 9700, 'abril': 9900,
        'mayo': 10400, 'junio': 10900, 'julio': 11400, 'agosto': 11700,
        'septiembre': 11100, 'octubre': 10700, 'noviembre': 10100, 'diciembre': 9700
      }
    }

    if (period === 'yearly') {
      // Datos anuales por categoría
      const years = ['2022', '2023', '2024', '2025']
      return years.map(yearStr => {
        const yearData = consumoBase[yearStr]
        const totalAnual = Object.values(yearData).reduce((sum, val) => sum + val, 0)
        let value = 0
        
        switch (category) {
          case 'servicios':
            value = Math.round((totalAnual * 0.3) / 1000) // 30% para servicios
            break
          case 'riego':
            value = Math.round((totalAnual * 0.7) / 1000) // 70% para riego
            break
          case 'Consumo Total':
          default:
            value = Math.round(totalAnual / 1000)
            break
        }
        
        return {
          name: yearStr,
          value: value,
          year: yearStr
        }
      })
    } else {
      // Datos mensuales por categoría
      const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
      const monthAbbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      const yearData = consumoBase[year]
      
      return monthNames.map((month, index) => {
        const totalValue = yearData[month]
          let value = 0
          
          switch (category) {
            case 'servicios':
            value = Math.round((totalValue * 0.3) / 1000) // 30% para servicios
              break
            case 'riego':
            value = Math.round((totalValue * 0.7) / 1000) // 70% para riego
              break
            case 'Consumo Total':
            default:
              value = Math.round(totalValue / 1000)
              break
          }
          
          return {
            name: monthAbbrev[index],
            value: value,
            month: month,
            year: year
          }
      })
    }
  }

  // Procesar datos de consumo según filtros (función original mantenida para compatibilidad)
  const getConsumptionData = () => {
    switch (timeFrame) {
      case 'daily':
        // Simular datos diarios de la última semana
        return [
          { name: 'Lun', value: 2800, category: 'general' },
          { name: 'Mar', value: 3200, category: 'general' },
          { name: 'Mié', value: 2950, category: 'general' },
          { name: 'Jue', value: 3100, category: 'general' },
          { name: 'Vie', value: 2750, category: 'general' },
          { name: 'Sáb', value: 2400, category: 'general' },
          { name: 'Dom', value: 2200, category: 'general' },
        ]
      case 'weekly':
        return datosPozo12.datos_semanales.consumo_semanal_detallado.slice(-8).map((week, index) => ({
          name: `S${index + 1}`,
          value: Math.round(week.total_pozos / 1000),
          servicios: Math.round(week.consumo_servicios / 1000),
          riego: Math.round(week.consumo_riego / 1000)
        }))
      case 'quarterly':
        const quarterlyData = datosPozo12.datos_trimestrales.consumo_trimestral
        const yearData = quarterlyData.find(q => q.año.includes(selectedYear)) || quarterlyData[quarterlyData.length - 1]
        const quarters = ['primer_trimestre', 'segundo_trimestre', 'tercer_trimestre', 'cuarto_trimestre']
        const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4']
        
        return quarters.map((quarter, index) => {
          const value = yearData[quarter]
          if (value !== null && value !== undefined) {
            return {
              name: quarterLabels[index],
              value: Math.round(value / 1000)
            }
          }
          return null
        }).filter(Boolean)
        
      case 'yearly':
        return datosPozo12.especificaciones_anuales.map(year => ({
          name: year.año.toString().replace('2025 (hasta mayo)', '2025'),
          value: Math.round(year.consumo_real_m3 / 1000),
          disponible: Math.round(year.m3_disponibles_para_consumir / 1000),
          efficiency: ((year.consumo_real_m3 / year.m3_disponibles_para_consumir) * 100).toFixed(1)
        }))
        
      case 'monthly':
      default:
        const monthlyData = datosPozo12.datos_mensuales.consumo_mensual
        const lastYearWithData = monthlyData.find(year => year.año.includes(selectedYear)) || monthlyData[monthlyData.length - 1]
        
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
        const monthAbbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        
        return monthNames.map((month, index) => {
          const value = lastYearWithData[month]
          if (value !== null && value !== undefined) {
            return {
              name: monthAbbrev[index],
              value: Math.round(value / 1000)
            }
          }
          return null
        }).filter(Boolean)
    }
  }

  // Datos de consumo por categoría
  const getCategoryData = () => {
    return [
      {
        name: 'Pozos Total',
        value: 12500,
        percentage: 85.5,
        meta: 15000
      },
      {
        name: 'Servicios',
        value: 3750,
        percentage: 78.2,
        meta: 4800
      },
      {
        name: 'Riego',
        value: 8750,
        percentage: 89.3,
        meta: 9800
      },
      {
        name: 'Torres de enfriamiento',
        value: 2800,
        percentage: 93.3,
        meta: 3000
      },
      {
        name: 'PTAR',
        value: 1500,
        percentage: 75.0,
        meta: 2000
      }
    ].map(item => ({
      ...item,
      percentage: ((item.value / item.meta) * 100).toFixed(1)
    }))
  }

  // Datos de eficiencia por pozo - Actualizado con pozos reales
  const getWellEfficiencyData = () => {
    // Pozos de Servicios
    const serviciosWells = [
      { name: 'Pozo 11 - Servicios', consumption: 1200, efficiency: 95, status: 'normal', type: 'Servicios' },
      { name: 'Pozo 12 - Servicios', consumption: 850, efficiency: 92, status: 'normal', type: 'Servicios' },
      { name: 'Pozo 3 - Servicios', consumption: 800, efficiency: 88, status: 'normal', type: 'Servicios' },
      { name: 'Pozo 7 - Servicios', consumption: 950, efficiency: 93, status: 'normal', type: 'Servicios' },
      { name: 'Pozo 14 - Servicios', consumption: 1100, efficiency: 94, status: 'normal', type: 'Servicios' }
    ]
    
    // Pozos de Riego
    const riegoWells = [
      { name: 'Pozo 4 - Riego', consumption: 1350, efficiency: 96, status: 'normal', type: 'Riego' },
      { name: 'Pozo 8 - Riego', consumption: 1250, efficiency: 94, status: 'normal', type: 'Riego' },
      { name: 'Pozo 15 - Riego', consumption: 1150, efficiency: 91, status: 'normal', type: 'Riego' }
    ]
    
    return [...serviciosWells, ...riegoWells]
  }


  // Cálculos de métricas principales
  const consumptionData = getConsumptionData()
  const categoryData = getCategoryData()
  const wellData = getWellEfficiencyData()
  
  const currentConsumption = consumptionData.length > 0 ? consumptionData[consumptionData.length - 1].value * 1000 : 0
  const previousConsumption = consumptionData.length > 1 ? consumptionData[consumptionData.length - 2].value * 1000 : 0
  const consumptionTrend = previousConsumption > 0 ? ((currentConsumption - previousConsumption) / previousConsumption * 100).toFixed(1) : 0

  // Obtener datos del año actual para las nuevas métricas
  const currentYearData = datosPozo12.especificaciones_anuales.find(year => year.año.includes('2025')) || datosPozo12.especificaciones_anuales[datosPozo12.especificaciones_anuales.length - 1]
  
  // Calcular métricas de consumo por categoría
  const consumoPozos = Math.round(currentConsumption / 1000) // Consumo actual de pozos
  const serviciosTotal = Math.round(dashboardData.waterUsage.find(item => item.name === 'Servicios')?.volume || 0)
  const riegoTotal = Math.round(dashboardData.waterUsage.find(item => item.name === 'Riego')?.volume || 0)
  const m3CedidosTitulo1 = currentYearData.m3_cedidos_por_anexo
  const m3CedidosTitulo2 = currentYearData.m3_cedidos_por_titulo

  // Obtener datos para las nuevas gráficas
  const currentViewData = getConsumptionDataByCategory(viewMode, periodView, selectedYear)
  
  // Años disponibles para comparación
  const availableYears = ['2022', '2023', '2024', '2025']
  
  // Manejar selección de años para comparación
  const handleYearComparisonToggle = (year) => {
    console.log('Toggle año:', year);
    setSelectedYearsComparison(prev => {
      const newSelection = prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year];
      console.log('Nueva selección de años:', newSelection);
      return newSelection;
    })
  }
  
  // Crear datos de comparación con años anteriores
  const getComparisonChartData = () => {
    const datasets = []
    const colors = [
      { bg: 'rgba(59, 130, 246, 0.6)', border: 'rgb(59, 130, 246)' },
      { bg: 'rgba(16, 185, 129, 0.6)', border: 'rgb(16, 185, 129)' },
      { bg: 'rgba(245, 158, 11, 0.6)', border: 'rgb(245, 158, 11)' },
      { bg: 'rgba(239, 68, 68, 0.6)', border: 'rgb(239, 68, 68)' },
      { bg: 'rgba(139, 92, 246, 0.6)', border: 'rgb(139, 92, 246)' }
    ]
    
    selectedYearsComparison.forEach((year, index) => {
      const yearData = getConsumptionDataByCategory(viewMode, periodView, year)
      const color = colors[index % colors.length]
      
      datasets.push({
        label: `${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} ${year}`,
        data: yearData.map(item => item.value),
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 2
      })
    })
    
    return {
      labels: currentViewData.map(item => item.name),
      datasets: datasets
    }
  }

  // Datos para gráfico de comparación histórica
  const comparisonData = getComparisonChartData()

  // Configuración de gráficos Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} m³`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + ' m³'
          }
        }
      }
    }
  }


  return (
    <RedirectIfNotAuth>
      <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Análisis de Consumo</h1>
                <p className="text-muted-foreground">Monitoreo detallado del consumo hídrico del sistema</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Exportar Reporte
                </Button>
              </div>
            </div>
          </div>


          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Consumo de Pozos</p>
                    <p className="text-2xl font-bold text-foreground">
                      {consumoPozos.toLocaleString()} m³
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUpIcon className={`h-4 w-4 ${parseFloat(consumptionTrend) > 0 ? 'text-destructive' : 'text-red-500'}`} />
                      <span className={`text-sm ${parseFloat(consumptionTrend) > 0 ? 'text-destructive' : 'text-red-500'}`}>
                        {Math.abs(consumptionTrend)}% vs mes anterior
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DropletIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Servicios Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {serviciosTotal.toLocaleString()} m³
                    </p>
                    <p className="text-sm text-blue-500 mt-1">vs mes anterior</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Riego Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {riegoTotal.toLocaleString()} m³
                    </p>
                    <p className="text-sm text-green-500 mt-1">vs mes anterior</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Waves className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">m³ Cedidos por Anexo</p>
                    <p className="text-2xl font-bold text-foreground">
                      {m3CedidosTitulo1.toLocaleString()} m³
                    </p>
                    <p className="text-sm text-amber-600 mt-1">Anual</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Factory className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">m³ Cedidos por Título</p>
                    <p className="text-2xl font-bold text-foreground">
                      {m3CedidosTitulo2.toLocaleString()} m³
                    </p>
                    <p className="text-sm text-purple-600 mt-1">Anual</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <ActivityIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

            {/* Sección de Tablas Detalladas por Punto de Consumo */}
            <div className="mt-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <TableIcon className="h-6 w-6 text-primary" />
                    Detalle por Punto de Medición - Año {selectedYearForReadings}
                  </h2>
                  <p className="text-muted-foreground mt-1">Vista detallada de todos los medidores del campus</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Selector de Año para Lecturas */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Año:</label>
                    <select
                      value={selectedYearForReadings}
                      onChange={(e) => setSelectedYearForReadings(e.target.value)}
                      className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={loading}
                    >
                      {AVAILABLE_YEARS.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  {/* Selector de semana */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Semana:</label>
                    <select
                      value={selectedWeek}
                      onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                      className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <option>Cargando...</option>
                      ) : availableWeeks.length > 0 ? (
                        availableWeeks.map(week => (
                          <option key={week.weekNumber} value={week.weekNumber}>
                            Semana {week.weekNumber} ({week.startDate} - {week.endDate})
                          </option>
                        ))
                      ) : (
                        <option>No hay semanas disponibles</option>
                      )}
                    </select>
                    {loading && (
                      <Loader2Icon className="h-4 w-4 animate-spin text-primary" />
                    )}
                  </div>
                  {/* Toggle comparación */}
                  <Button
                    variant={showComparison ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    {showComparison ? 'Con Comparación' : 'Sin Comparación'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs de categorías */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 border-b border-muted pb-2">
                {loading ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">Cargando categorías...</div>
                ) : consumptionPoints.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">No hay categorías disponibles</div>
                ) : (
                  consumptionPoints.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                        activeTab === category.id
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      {category.name}
                      <span className="ml-2 text-xs opacity-70">
                        ({category.points.length})
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Descripción de la categoría activa */}
            {!loading && consumptionPoints.find(cat => cat.id === activeTab) && (
              <div className="mb-4 p-4 bg-primary/5 border-l-4 border-primary rounded">
                <p className="text-sm text-muted-foreground">
                  {consumptionPoints.find(cat => cat.id === activeTab).description}
                </p>
              </div>
            )}

            {/* Tabla de la categoría activa */}
            {!loading && consumptionPoints.map(category => (
              category.id === activeTab && (
                <ConsumptionTable
                  key={category.id}
                  title={category.name}
                  data={category.points}
                  weekNumber={selectedWeek}
                  showComparison={showComparison}
                />
              )
            ))}
          </div>

          {/* Nueva Sección: Comparativas Semanales con Gráficas y Tablas */}
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3Icon className="h-6 w-6 text-primary" />
                Análisis de Comparativas Semanales
              </h2>
              <p className="text-muted-foreground mt-1">
                Comparación detallada entre años con indicadores de color y cantidad
              </p>
            </div>

            {/* Selector de punto de medición */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="text-sm font-medium">Selecciona punto de medición:</label>
                  <select
                    value={selectedPoint}
                    onChange={(e) => setSelectedPoint(e.target.value)}
                    className="flex-1 max-w-md px-4 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <optgroup label="Pozos de Servicios">
                      <option value="medidor_general_pozos">Medidor General de Pozos</option>
                      <option value="pozo_11">Pozo 11</option>
                      <option value="pozo_12">Pozo 12</option>
                      <option value="pozo_14">Pozo 14</option>
                      <option value="pozo_7">Pozo 7</option>
                      <option value="pozo_3">Pozo 3</option>
                    </optgroup>
                    <optgroup label="Pozos de Riego">
                      <option value="pozo_4_riego">Pozo 4 Riego</option>
                      <option value="pozo_8_riego">Pozo 8 Riego</option>
                      <option value="pozo_15_riego">Pozo 15 Riego</option>
                      <option value="total_pozos_riego">Total Pozos Riego</option>
                    </optgroup>
                    <optgroup label="Residencias">
                      <option value="residencias_10_15">Residencias 10 y 15</option>
                      <option value="residencias_1_antiguo">Residencias 1 (Antiguo)</option>
                      <option value="residencias_2_ote">Residencias 2 Oriente</option>
                      <option value="residencias_3">Residencias 3</option>
                      <option value="residencias_4">Residencias 4</option>
                      <option value="residencias_5">Residencias 5</option>
                    </optgroup>
                    <optgroup label="Edificios Principales">
                      <option value="wellness_edificio">Wellness Edificio</option>
                      <option value="biblioteca">Biblioteca</option>
                      <option value="cetec">CETEC</option>
                      <option value="biotecnologia">Biotecnología</option>
                      <option value="arena_borrego">Arena Borrego</option>
                      <option value="centro_congresos">Centro de Congresos</option>
                      <option value="auditorio_luis_elizondo">Auditorio Luis Elizondo</option>
                      <option value="nucleo">Núcleo</option>
                      <option value="expedition">Expedition</option>
                    </optgroup>
                    <optgroup label="Torres de Enfriamiento">
                      <option value="wellness_torre_enfriamiento">Wellness Torre Enfriamiento</option>
                      <option value="cah3_torre_enfriamiento">CAH3 Torre Enfriamiento</option>
                      <option value="megacentral_te_2">Megacentral TE 2</option>
                      <option value="estadio_banorte_te">Estadio Banorte TE</option>
                    </optgroup>
                    <optgroup label="Circuitos">
                      <option value="circuito_8_campus">Circuito 8" Campus</option>
                      <option value="circuito_6_residencias">Circuito 6" Residencias</option>
                      <option value="circuito_4_a7_ce">Circuito 4" A7 CE</option>
                      <option value="circuito_planta_fisica">Circuito Planta Física</option>
                      <option value="circuito_megacentral">Circuito Megacentral</option>
                    </optgroup>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Gráfica de comparación */}
            <div className="mb-6">
              <WeeklyComparisonChart
                title={consumptionPoints.flatMap(c => c.points).find(p => p.id === selectedPoint)?.name || "Punto de Medición"}
                currentYearData={weeklyReadings2025}
                previousYearData={weeklyReadings2024}
                currentYear="2025"
                previousYear="2024"
                unit="m³"
              />
            </div>

            {/* Tabla tipo Excel de comparación */}
            <div className="mb-6">
              <WeeklyComparisonTable
                title="Tabla Comparativa Semanal 2024 vs 2025"
                data2024={weeklyReadings2024}
                data2025={weeklyReadings2025}
                pointName={consumptionPoints.flatMap(c => c.points).find(p => p.id === selectedPoint)?.name || "Punto de Medición"}
                unit="m³"
              />
            </div>
          </div>

          {/* Bento Grid: Gráfica a la izquierda, Filtros a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 mt-6">
            {/* Gráfica principal - 2 columnas */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  {viewMode === 'servicios' ? 'Consumo de Servicios' : 
                   viewMode === 'riego' ? 'Consumo de Riego' : 
                   'Consumo Total'} - {periodView === 'monthly' ? 'vs mes anterior' : 'Anual'}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ChartComponent 
                    data={comparisonData} 
                    type={chartType} 
                    options={chartOptions}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Filtros como tabla a la derecha - 1 columna */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Filtros</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tabla de filtros */}
                  <div className="space-y-3">
                    {/* Categoría */}
                    <div className="border-b pb-3">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Categoría</label>
                      <select 
                        value={viewMode} 
                        onChange={(e) => {
                          console.log('Categoría cambiada a:', e.target.value);
                          setViewMode(e.target.value);
                        }}
                        className="w-full border border-muted rounded-lg px-3 py-2.5 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      >
                        <option value="Consumo Total">Consumo Total</option>
                        <option value="servicios">Solo Servicios</option>
                        <option value="riego">Solo Riego</option>
                      </select>
                    </div>

                    {/* Período */}
                    <div className="border-b pb-3">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Período</label>
                      <select 
                        value={periodView} 
                        onChange={(e) => {
                          console.log('Período cambiado a:', e.target.value);
                          setPeriodView(e.target.value);
                        }}
                        className="w-full border border-muted rounded-lg px-3 py-2.5 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      >
                        <option value="monthly">vs mes anterior</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>

                    {/* Año - solo si es mensual */}
                    {periodView === 'monthly' && (
                      <div className="border-b pb-3">
                        <label className="text-sm font-semibold text-foreground mb-2 block">Año</label>
                        <select 
                          value={selectedYear} 
                          onChange={(e) => {
                            console.log('Año cambiado a:', e.target.value);
                            setSelectedYear(e.target.value);
                          }}
                          className="w-full border border-muted rounded-lg px-3 py-2.5 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        >
                          <option value="2022">2022</option>
                          <option value="2023">2023</option>
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                        </select>
                      </div>
                    )}

                    {/* Tipo de Gráfico */}
                    <div className="border-b pb-3">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Tipo de Gráfico</label>
                      <select 
                        value={chartType} 
                        onChange={(e) => {
                          console.log('Tipo de gráfico cambiado a:', e.target.value);
                          setChartType(e.target.value);
                        }}
                        className="w-full border border-muted rounded-lg px-3 py-2.5 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      >
                        <option value="bar">Barras</option>
                        <option value="line">Líneas</option>
                        <option value="area">Área</option>
                      </select>
                    </div>

                    {/* Selección de años */}
                    <div className="pt-2">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Años a mostrar</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableYears.map(year => (
                          <Button
                            key={year}
                            variant={selectedYearsComparison.includes(year) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              console.log('Click en año:', year);
                              handleYearComparisonToggle(year);
                            }}
                            className={`text-xs transition-all duration-200 ${
                              selectedYearsComparison.includes(year) 
                                ? 'bg-primary text-primary-foreground shadow-md' 
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            {year}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Seleccionados: {selectedYearsComparison.length} año{selectedYearsComparison.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Análisis detallado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Consumo por pozos */}
           
            {/* Resumen de Consumo por Categoría */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Resumen por categoría vs meta del año</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-lg font-bold">{category.value.toLocaleString()} m³</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{category.percentage}% meta del año</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Rendimiento por Pozo</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pozos de Servicios */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-2">Pozos de Servicios</h4>
                    {wellData.filter(w => w.type === 'Servicios').map((well, index) => (
                      <div key={index} className="border border-blue-200 rounded-lg p-3 mb-2 bg-blue-50/50">
                      <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{well.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          well.status === 'alert' ? 'bg-destructive/10 text-destructive' :
                          well.status === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-green-500/10 text-green-600'
                        }`}>
                          {well.status === 'alert' ? 'Alerta' : well.status === 'warning' ? 'Advertencia' : 'Normal'}
                        </span>
                      </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-muted-foreground text-xs">Consumo Diario</p>
                          <p className="font-medium">{well.consumption} m³</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">Eficiencia</p>
                          <p className="font-medium">{well.efficiency}%</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${well.efficiency}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{well.efficiency}% meta del año</p>
                      </div>
                    </div>
                  ))}
                  </div>
                  
                  {/* Pozos de Riego */}
                  <div className="pt-2">
                    <h4 className="text-sm font-semibold text-green-600 mb-2">Pozos de Riego</h4>
                    {wellData.filter(w => w.type === 'Riego').map((well, index) => (
                      <div key={index} className="border border-green-200 rounded-lg p-3 mb-2 bg-green-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{well.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            well.status === 'alert' ? 'bg-destructive/10 text-destructive' :
                            well.status === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                            'bg-green-500/10 text-green-600'
                          }`}>
                            {well.status === 'alert' ? 'Alerta' : well.status === 'warning' ? 'Advertencia' : 'Normal'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Consumo Diario</p>
                            <p className="font-medium">{well.consumption} m³</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Eficiencia</p>
                            <p className="font-medium">{well.efficiency}%</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${well.efficiency}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{well.efficiency}% meta del año</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Alertas recientes */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Alertas de Consumo</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm">{alert.title}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.type === 'critical' ? 'bg-destructive/10 text-destructive' :
                          alert.type === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-blue-500/10 text-blue-600'
                        }`}>
                          {alert.type === 'critical' ? 'Crítico' : alert.type === 'warning' ? 'Advertencia' : 'Info'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        <Button size="sm" variant="outline">
                          {alert.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        
        </main>
      </div>
    </div>
    </RedirectIfNotAuth>
  )
}
