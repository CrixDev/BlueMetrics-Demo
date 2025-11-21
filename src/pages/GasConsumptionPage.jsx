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
import gasConsumptionPointsData from '../lib/gas-consumption-points.json'
import { dashboardData } from '../lib/dashboard-data'
import { supabase } from '../supabaseClient'
import { 
  FilterIcon, 
  TrendingUpIcon, 
  AlertTriangleIcon, 
  FlameIcon,
  ThermometerIcon,
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
import { getGasTableNameByYear, AVAILABLE_YEARS, DEFAULT_YEAR } from '../utils/tableHelpers';

export default function GasConsumptionPage() {
  const [timeFrame, setTimeFrame] = useState('monthly')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [chartType, setChartType] = useState('bar')
  const [viewMode, setViewMode] = useState('Consumo Total') // 'servicios', 'riego', 'conjunto'
  const [periodView, setPeriodView] = useState('monthly') // 'monthly', 'yearly'
  const [selectedYearsComparison, setSelectedYearsComparison] = useState(['2024', '2025']) // Años para comparar
  const [selectedYearForReadings, setSelectedYearForReadings] = useState(DEFAULT_YEAR) // Año para lecturas semanales
  
  // Estados para el nuevo sistema de tablas detalladas
  const [activeTab, setActiveTab] = useState('acometidas_campus') // Tab activa para las tablas
  const [selectedWeek, setSelectedWeek] = useState(2) // Semana seleccionada (1 o 2)
  const [showComparison, setShowComparison] = useState(true) // Mostrar comparación entre semanas
  
  // Estados para datos de Supabase
  const [weeklyReadings, setWeeklyReadings] = useState([])
  const [availableWeeks, setAvailableWeeks] = useState([])
  const [consumptionPoints, setConsumptionPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para comparativas semanales
  const [selectedPoint, setSelectedPoint] = useState('todos')
  const [weeklyReadings2023, setWeeklyReadings2023] = useState([])
  const [weeklyReadings2024, setWeeklyReadings2024] = useState([])
  const [weeklyReadings2025, setWeeklyReadings2025] = useState([])

  // Estados para filtros de gráficas de comparación
  const [comparisonChartType, setComparisonChartType] = useState('line') // 'line' o 'bar'
  const [comparisonYearsToShow, setComparisonYearsToShow] = useState(['2024', '2025']) // Array de años para comparar
  const [availableYearsForComparison] = useState(['2023', '2024', '2025']) // Años disponibles para comparación

  // Cargar semanas disponibles desde Supabase cuando cambia el año de lecturas
  useEffect(() => {
    fetchWeeklyReadings()
  }, [selectedYearForReadings])

  // Cargar datos de todos los años para comparativas
  useEffect(() => {
    fetchAllYearsData()
  }, [selectedPoint])

  const fetchWeeklyReadings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const tableName = getGasTableNameByYear(selectedYearForReadings)
      // Obtener todas las lecturas semanales ordenadas por número de semana
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('numero_semana', { ascending: true })
      
      if (fetchError) throw fetchError
      
      console.log('✅ Lecturas semanales de gas obtenidas:', data)
      
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
      setAvailableWeeks(gasConsumptionPointsData.metadata.weeks)
      // Mantener los puntos del JSON como fallback
      setConsumptionPoints(gasConsumptionPointsData.categories)
    } finally {
      setLoading(false)
    }
  }

  // Función genérica para cargar datos de un año específico de GAS
  const fetchYearData = async (year, tableName, setStateFunction) => {
    try {
      const shouldSumAll = selectedPoint === 'todos'
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('numero_semana', { ascending: true })
      
      if (error) {
        console.error(`Error cargando gas ${year}:`, error)
        return
      }

      let formattedData
      if (shouldSumAll) {
        // Sumar todo el consumo de gas de cada semana
        formattedData = data.map(week => {
          let totalReading = 0
          // Sumar todos los campos numéricos (consumo de gas) excepto numero_semana, fecha_inicio, fecha_fin, id
          Object.keys(week).forEach(key => {
            if (key !== 'numero_semana' && key !== 'fecha_inicio' && key !== 'fecha_fin' && key !== 'id' && week[key] !== null) {
              const value = parseFloat(week[key])
              if (!isNaN(value)) {
                totalReading += value
              }
            }
          })
          return {
            week: week.numero_semana,
            reading: totalReading
          }
        })
      } else {
        // Cargar solo el punto seleccionado
        formattedData = data
          .filter(d => d[selectedPoint] !== null)
          .map(d => ({
            week: d.numero_semana,
            reading: parseFloat(d[selectedPoint]) || 0
          }))
      }
      
      setStateFunction(formattedData)
      console.log(`✅ Datos de gas ${year} cargados:`, formattedData.length, 'semanas')
    } catch (err) {
      console.error(`❌ Error al cargar datos de gas ${year}:`, err)
    }
  }

  // Función para cargar datos de todos los años para comparación
  const fetchAllYearsData = async () => {
    await Promise.all([
      fetchYearData('2023', 'lecturas_semanales_gas_2023', setWeeklyReadings2023),
      fetchYearData('2024', 'lecturas_semanales_gas_2024', setWeeklyReadings2024),
      fetchYearData('2025', 'lecturas_semanales_gas_2025', setWeeklyReadings2025)
    ])
  }

  // Procesar datos de Supabase para convertirlos en formato de puntos de consumo
  const processConsumptionPoints = (weeklyData) => {
    // Usar las categorías del JSON como estructura base
    const categories = gasConsumptionPointsData.categories.map(category => ({
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

  // Preparar datos para WeeklyComparisonChart basado en años seleccionados
  const getMultiYearChartData = () => {
    const yearDataMap = {
      '2023': weeklyReadings2023,
      '2024': weeklyReadings2024,
      '2025': weeklyReadings2025
    }

    const sortedSelectedYears = [...comparisonYearsToShow].sort()
    
    // Generar datos para todos los años seleccionados
    return sortedSelectedYears.map(year => ({
      year,
      data: yearDataMap[year] || []
    }))
  }

  const multiYearData = getMultiYearChartData()


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
                <h1 className="text-3xl font-bold text-foreground mb-2">Análisis de Consumo de Gas</h1>
                <p className="text-muted-foreground">Monitoreo detallado del consumo de gas del sistema</p>
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
                    <p className="text-sm text-muted-foreground">Consumo Total Gas</p>
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
                  <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <FlameIcon className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Calderas y Calefacción</p>
                    <p className="text-2xl font-bold text-foreground">
                      {serviciosTotal.toLocaleString()} m³
                    </p>
                    <p className="text-sm text-blue-500 mt-1">vs mes anterior</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <ThermometerIcon className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Comedores Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {riegoTotal.toLocaleString()} m³
                    </p>
                    <p className="text-sm text-green-500 mt-1">vs mes anterior</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Residencias Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {m3CedidosTitulo1.toLocaleString()} m³
                    </p>
                    <p className="text-sm text-amber-600 mt-1">Anual</p>
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
                    <p className="text-sm text-muted-foreground">m³ Cedidos Anual</p>
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

          {/* Nueva Sección: Comparativas Semanales con Gráficas y Tablas */}
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BarChart3Icon className="h-6 w-6 text-orange-500" />
                Análisis de Comparativas Semanales
              </h2>
              <p className="text-muted-foreground mt-1">
                Comparación detallada entre años con indicadores de color y cantidad
              </p>
            </div>

            {/* Bento Grid: Gráfica a la izquierda, Filtros a la derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Gráfica de comparación - 2 columnas */}
              <div className="lg:col-span-2">
                <WeeklyComparisonChart
                  title={selectedPoint === 'todos' ? 'Todos los Medidores (Suma Total)' : (consumptionPoints.flatMap(c => c.points).find(p => p.id === selectedPoint)?.name || "Medidor de Gas")}
                  unit="m³"
                  chartType={comparisonChartType}
                  showControls={false}
                  multiYearData={multiYearData}
                />
              </div>

              {/* Filtros a la derecha - 1 columna */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold">Filtros</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Medidor de Gas */}
                    <div className="border-b pb-3">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Medidor de Gas</label>
                      <select
                        value={selectedPoint}
                        onChange={(e) => setSelectedPoint(e.target.value)}
                        className="w-full border border-muted rounded-lg px-3 py-2.5 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      >
                        <option value="todos">📊 TODOS LOS MEDIDORES</option>
                        <optgroup label="Acometidas Principales Campus">
                          <option value="campus_acometida_principal_digital">Campus Acometida Ppal digital</option>
                          <option value="campus_acometida_principal_analogica">Campus Acometida Ppal analógica</option>
                        </optgroup>
                        <optgroup label="Edificios Culturales">
                          <option value="domo_cultural">Domo Cultural</option>
                        </optgroup>
                        <optgroup label="Comedores y Restaurantes">
                          <option value="comedor_centrales_tec_food">Comedor Centrales Tec Food</option>
                          <option value="dona_tota">Doña Tota</option>
                          <option value="chilaquiles_tec">Chilaquiles Tec</option>
                          <option value="carls_junior">Carl´s Junior</option>
                          <option value="comedor_estudiantes">Comedor Estudiantes</option>
                          <option value="wellness_supersalads">Wellness SuperSalads</option>
                        </optgroup>
                        <optgroup label="Calderas y Calefacción">
                          <option value="caldera_1_leon">Caldera 1 (Leon)</option>
                          <option value="caldera_2">Caldera 2</option>
                          <option value="caldera_3">Caldera 3</option>
                          <option value="mega_calefaccion_1">Mega Calefacción 1</option>
                          <option value="wellness_general_calefaccion">Wellness General (Calefacción)</option>
                          <option value="residencias_abc_calefaccion">Residencias ABC calefacción</option>
                        </optgroup>
                        <optgroup label="Edificios Académicos">
                          <option value="biotecnologia">Biotecnología</option>
                          <option value="biblioteca">Biblioteca</option>
                          <option value="aulas_1">Aulas 1</option>
                          <option value="auditorio_luis_elizondo">Auditorio Luis Elizondo</option>
                        </optgroup>
                        <optgroup label="Instalaciones Deportivas">
                          <option value="arena_borrego">Arena Borrego</option>
                          <option value="wellness_acometida_digital">Wellness Acometida digital</option>
                          <option value="wellness_alberca">Wellness Alberca</option>
                        </optgroup>
                        <optgroup label="Residencias Estudiantiles">
                          <option value="estudiantes_acometida_principal_digital">Estudiantes Acometida Ppal digital</option>
                          <option value="residencias_1">Residencias 1</option>
                          <option value="residencias_2">Residencias 2</option>
                          <option value="residencias_3">Residencias 3</option>
                          <option value="residencias_4">Residencias 4</option>
                          <option value="residencias_5">Residencias 5</option>
                        </optgroup>
                        <optgroup label="Campus Norte">
                          <option value="campus_norte_acometida_externa">Campus Norte Acometida externa</option>
                          <option value="campus_norte_acometida_interna">Campus Norte Acometida interna</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Tipo de Gráfico */}
                    <div className="border-b pb-3">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Tipo de Gráfico</label>
                      <select 
                        value={comparisonChartType} 
                        onChange={(e) => setComparisonChartType(e.target.value)}
                        className="w-full border border-muted rounded-lg px-3 py-2.5 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      >
                        <option value="line">Líneas</option>
                        <option value="bar">Barras</option>
                      </select>
                    </div>

                    {/* Selección de años para comparación */}
                    <div className="pt-2">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Años a mostrar</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableYearsForComparison.map(year => (
                          <Button
                            key={year}
                            variant={comparisonYearsToShow.includes(year) ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setComparisonYearsToShow(prev => {
                                if (prev.includes(year)) {
                                  // Si ya está seleccionado, quitarlo (mínimo 1 año)
                                  return prev.length > 1 ? prev.filter(y => y !== year) : prev
                                } else {
                                  // Si no está seleccionado, agregarlo
                                  return [...prev, year].sort()
                                }
                              })
                            }}
                            className={`text-xs transition-all duration-200 ${
                              comparisonYearsToShow.includes(year) 
                                ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600' 
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            {year}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Seleccionados: {comparisonYearsToShow.join(', ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>




          <div className="mt-8"></div>




          {/* Sección de Tablas Detalladas por Medidor de Gas */}
          <div className="mt-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <TableIcon className="h-6 w-6 text-orange-500" />
                    Detalle por Medidor de Gas - Año {selectedYearForReadings}
                  </h2>
                  <p className="text-muted-foreground mt-1">Vista detallada de todos los medidores de gas del campus</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Selector de Año para Lecturas */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Año:</label>
                    <select
                      value={selectedYearForReadings}
                      onChange={(e) => setSelectedYearForReadings(e.target.value)}
                      className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      <Loader2Icon className="h-4 w-4 animate-spin text-orange-500" />
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
                          ? 'bg-orange-500 text-white shadow-sm'
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
              <div className="mb-4 p-4 bg-orange-500/5 border-l-4 border-orange-500 rounded">
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

            <div className="mt-8"></div>

            {/* Tabla tipo Excel de comparación */}
            <div className="mb-6">
              <WeeklyComparisonTable
                title={`Tabla Comparativa Semanal ${comparisonYearsToShow.join(' vs ')} - Consumo de Gas`}
                data2024={multiYearData.length > 1 ? multiYearData[multiYearData.length - 2].data : []}
                data2025={multiYearData.length > 0 ? multiYearData[multiYearData.length - 1].data : []}
                pointName={selectedPoint === 'todos' ? 'Todos los Medidores (Suma Total)' : (consumptionPoints.flatMap(c => c.points).find(p => p.id === selectedPoint)?.name || "Medidor de Gas")}
                unit="m³"
              />
            </div>
          </div>

     
        </main>
      </div>
    </div>
    </RedirectIfNotAuth>
  )
}
