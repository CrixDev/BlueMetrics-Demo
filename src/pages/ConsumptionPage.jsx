import { useState, useEffect } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import ConsumptionTable from "../components/ConsumptionTable"
import WeeklyComparisonChart from "../components/WeeklyComparisonChart"
import WeeklyComparisonTable from "../components/WeeklyComparisonTable"
import datosPozo12 from '../lib/datos_pozo_12.json'
import consumptionPointsData from '../lib/consumption-points.json'
import { dashboardData } from '../lib/dashboard-data'
import { supabase } from '../supabaseClient'
import { 
  TrendingUpIcon, 
  AlertTriangleIcon, 
  DropletIcon,
  BarChart3Icon,
  CalendarIcon,
  DownloadIcon,
  Truck,
  Building2,
  Waves,
  TableIcon,
  Loader2Icon
} from 'lucide-react'

import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth';
import { getTableNameByYear, AVAILABLE_YEARS, DEFAULT_YEAR } from '../utils/tableHelpers';

export default function ConsumptionPage() {
  const [timeFrame, setTimeFrame] = useState('monthly')
  const [selectedYearForReadings, setSelectedYearForReadings] = useState(DEFAULT_YEAR) // Año para consumo semanal
  
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
  const [selectedPoint, setSelectedPoint] = useState('todos')
  const [weeklyReadings2023, setWeeklyReadings2023] = useState([])
  const [weeklyReadings2024, setWeeklyReadings2024] = useState([])
  const [weeklyReadings2025, setWeeklyReadings2025] = useState([])

  // Estados para filtros de gráficas de comparación
  const [comparisonChartType, setComparisonChartType] = useState('line') // 'line' o 'bar'
  const [comparisonYearsToShow, setComparisonYearsToShow] = useState(['2024', '2025']) // Array de años para comparar
  const [availableYears] = useState(['2023', '2024', '2025']) // Años disponibles para comparación

  // Cargar semanas disponibles desde Supabase cuando cambia el año de consumo
  useEffect(() => {
    fetchWeeklyReadings()
  }, [selectedYearForReadings])

  // Cargar datos de todos los años para comparativas
  useEffect(() => {
    fetchBothYearsData()
  }, [selectedPoint])

  const fetchWeeklyReadings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const tableName = getTableNameByYear(selectedYearForReadings)
      // Obtener todos los datos de consumo semanal ordenados por número de semana
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .order('numero_semana', { ascending: true })
      
      if (fetchError) throw fetchError
      
      console.log('✅ Datos de consumo semanal obtenidos:', data)
      
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
      console.error('❌ Error al cargar datos de consumo:', err)
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
          const consumption = week[point.id]
          return {
            week: week.numero_semana,
            reading: consumption !== null && consumption !== undefined ? parseFloat(consumption) : 0
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

  // Función genérica para cargar datos de un año específico
  const fetchYearData = async (year, tableName, setStateFunction) => {
    try {
      const shouldSumAll = selectedPoint === 'todos'
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('numero_semana', { ascending: true })
      
      if (error) {
        console.error(`Error cargando ${year}:`, error)
        return
      }

      let formattedData
      if (shouldSumAll) {
        // Sumar todo el consumo de cada semana
        formattedData = data.map(week => {
          let totalReading = 0
          // Sumar todos los campos numéricos (consumo) excepto numero_semana, fecha_inicio, fecha_fin, id
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
      console.log(`✅ Datos de ${year} cargados:`, formattedData.length, 'semanas')
    } catch (err) {
      console.error(`❌ Error al cargar datos de ${year}:`, err)
    }
  }

  // Función para cargar datos de todos los años para comparación
  const fetchBothYearsData = async () => {
    await Promise.all([
      fetchYearData('2023', 'lecturas_semana2023', setWeeklyReadings2023),
      fetchYearData('2024', 'lecturas_semana2024', setWeeklyReadings2024),
      fetchYearData('2025', 'lecturas_semana', setWeeklyReadings2025)
    ])
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
        const yearData = quarterlyData.find(q => q.año.includes('2025')) || quarterlyData[quarterlyData.length - 1]
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
        const lastYearWithData = monthlyData.find(year => year.año.includes('2025')) || monthlyData[monthlyData.length - 1]
        
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Consumo de Pozos Total</p>
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
                    <p className="text-sm text-muted-foreground">Consumo de Pozos de Servicios Total</p>
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
                    <p className="text-sm text-muted-foreground">Consumo de Pozos de Riego Total</p>
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

            {/* Bento Grid: Gráfica a la izquierda, Filtros a la derecha */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Gráfica de comparación - 2 columnas */}
              <div className="lg:col-span-2">
                <WeeklyComparisonChart
                  title={selectedPoint === 'todos' ? 'Todos los Puntos (Suma Total)' : (consumptionPoints.flatMap(c => c.points).find(p => p.id === selectedPoint)?.name || "Punto de Medición")}
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
                    <TrendingUpIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Filtros</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Punto de Medición */}
                    <div className="border-b pb-3">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Punto de Medición</label>
                      <select
                        value={selectedPoint}
                        onChange={(e) => setSelectedPoint(e.target.value)}
                        className="w-full border border-muted rounded-lg px-3 py-2.5 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      >
                        <option value="todos">📊 TODOS LOS PUNTOS</option>
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

                    {/* Tipo de Gráfico */}
                    <div className="border-b pb-3">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Tipo de Gráfico</label>
                      <select 
                        value={comparisonChartType} 
                        onChange={(e) => setComparisonChartType(e.target.value)}
                        className="w-full border border-muted rounded-lg px-3 py-2.5 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      >
                        <option value="line">Líneas</option>
                        <option value="bar">Barras</option>
                      </select>
                    </div>

                    {/* Selección de años para comparación */}
                    <div className="pt-2">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Años a mostrar</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableYears.map(year => (
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
                                ? 'bg-primary text-primary-foreground shadow-md' 
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
                  {/* Selector de Año para Consumo */}
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
                  showComparison={showComparison}z
                />
              )
            ))}
          </div>

            <div className="mt-8"></div>

            {/* Tabla tipo Excel de comparación */}
            <div className="mb-6">
              <WeeklyComparisonTable
                title={`Tabla Comparativa Semanal ${comparisonYearsToShow.join(' vs ')} - Consumo Semanal`}
                data2024={multiYearData.length > 1 ? multiYearData[multiYearData.length - 2].data : []}
                data2025={multiYearData.length > 0 ? multiYearData[multiYearData.length - 1].data : []}
                pointName={selectedPoint === 'todos' ? 'Todos los Puntos (Suma Total)' : (consumptionPoints.flatMap(c => c.points).find(p => p.id === selectedPoint)?.name || "Punto de Medición")}
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