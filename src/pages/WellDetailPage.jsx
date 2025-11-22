import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { supabase } from '../supabaseClient'
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
  FilterIcon,
  Loader2Icon
} from "lucide-react"
import ChartComponent from '../components/ChartComponent'
import datosPozo12 from '../lib/datos_pozo_12.json'

export default function WellDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Estados para datos de Supabase
  const [currentReading, setCurrentReading] = useState(0)
  const [currentConsumption, setCurrentConsumption] = useState(0)
  const [vsLastWeek, setVsLastWeek] = useState(0)
  const [vsLastYear, setVsLastYear] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartDataFromSupabase, setChartDataFromSupabase] = useState([])
  
  // Estados para los filtros de gráficas
  const [selectedMetrics, setSelectedMetrics] = useState(['reading', 'consumption'])
  const [chartType, setChartType] = useState('line')
  const [showComparison, setShowComparison] = useState(true)
  const [timeFilter, setTimeFilter] = useState('weekly') // 'yearly', 'quarterly', 'monthly', 'weekly'
  const [dateRange, setDateRange] = useState('all') // 'all', 'last6months', 'lastyear', 'custom'
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [visualizationType, setVisualizationType] = useState('general') // 'general', 'consumo-pozo'
  
  // Cargar datos de Supabase al montar el componente
  useEffect(() => {
    fetchWellData()
  }, [id])

  // Actualizar métricas seleccionadas cuando cambia el tipo de visualización
  useEffect(() => {
    if (visualizationType === 'consumo-pozo') {
      setSelectedMetrics(['consumoServicios', 'consumoRiego', 'total'])
      setTimeFilter('monthly') // Forzar vista mensual para consumo por pozo
    } else {
      setSelectedMetrics(['reading', 'consumption'])
      setTimeFilter('weekly') // Vista semanal para datos de Supabase
    }
  }, [visualizationType])

  // Función para cargar datos del pozo desde Supabase
  const fetchWellData = async () => {
    try {
      setLoading(true)
      setError(null)

      const year = 2025
      const lastYear = 2024
      const readingsTable = `lecturas_semana_agua_${year}`
      const consumptionTable = `lecturas_semana_agua_consumo_${year}`
      const lastYearConsumptionTable = `lecturas_semana_agua_consumo_${lastYear}`

      // Mapeo de IDs de pozos a columnas
      const columnMapping = {
        11: 'l_pozo_11',
        12: 'l_pozo_12',
        3: 'l_pozo_3',
        7: 'l_pozo_7',
        14: 'l_pozo_14',
        4: 'l_pozo_4_riego',
        8: 'l_pozo_8_riego',
        15: 'l_pozo_15_riego'
      }

      const columnName = columnMapping[id] || 'l_pozo_12'

      console.log('🔍 Cargando datos del pozo', id, 'columna:', columnName)

      // 1. GET: Lectura actual (última semana del año actual)
      const { data: readingsData, error: readingsError } = await supabase
        .from(readingsTable)
        .select('*')
        .order('l_numero_semana', { ascending: false })
        .limit(2)

      if (readingsError) throw readingsError

      // 2. GET: Consumo actual (última semana del año actual)
      const { data: consumptionData, error: consumptionError } = await supabase
        .from(consumptionTable)
        .select('*')
        .order('l_numero_semana', { ascending: false })
        .limit(2)

      if (consumptionError) throw consumptionError

      // 3. GET: Consumo del año pasado (misma semana)
      const currentWeekNumber = readingsData?.[0]?.l_numero_semana || 1
      const { data: lastYearData, error: lastYearError } = await supabase
        .from(lastYearConsumptionTable)
        .select('*')
        .eq('l_numero_semana', currentWeekNumber)
        .single()

      if (lastYearError && lastYearError.code !== 'PGRST116') {
        console.warn('⚠️ No hay datos del año pasado:', lastYearError)
      }

      console.log('✅ Lecturas:', readingsData)
      console.log('✅ Consumo:', consumptionData)
      console.log('✅ Año pasado:', lastYearData)

      // Procesar datos
      const lastWeekReading = parseFloat(readingsData?.[0]?.[columnName]) || 0
      const lastWeekConsumption = parseFloat(consumptionData?.[0]?.[columnName]) || 0
      const previousWeekConsumption = parseFloat(consumptionData?.[1]?.[columnName]) || 0
      const lastYearConsumption = parseFloat(lastYearData?.[columnName]) || 0

      // Calcular vs semana anterior
      const vsWeek = lastWeekConsumption - previousWeekConsumption

      // Calcular vs año anterior
      const vsYear = lastWeekConsumption - lastYearConsumption

      setCurrentReading(lastWeekReading)
      setCurrentConsumption(lastWeekConsumption)
      setVsLastWeek(vsWeek)
      setVsLastYear(vsYear)

      console.log('📊 Métricas calculadas:', {
        lectura: lastWeekReading,
        consumo: lastWeekConsumption,
        vsLastWeek: vsWeek,
        vsLastYear: vsYear
      })

      // Cargar datos para el gráfico desde Supabase
      const chartData = await fetchChartDataFromSupabase()
      setChartDataFromSupabase(chartData)

    } catch (err) {
      console.error('❌ Error cargando datos del pozo:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar datos del gráfico desde Supabase
  const fetchChartDataFromSupabase = async () => {
    try {
      const year = 2025
      const readingsTable = `lecturas_semana_agua_${year}`
      const consumptionTable = `lecturas_semana_agua_consumo_${year}`

      // Mapeo de IDs de pozos a columnas
      const columnMapping = {
        11: 'l_pozo_11',
        12: 'l_pozo_12',
        3: 'l_pozo_3',
        7: 'l_pozo_7',
        14: 'l_pozo_14',
        4: 'l_pozo_4_riego',
        8: 'l_pozo_8_riego',
        15: 'l_pozo_15_riego'
      }

      const columnName = columnMapping[id] || 'l_pozo_12'

      console.log('📊 Cargando datos de gráfico para columna:', columnName)

      // Cargar todas las lecturas del año
      const { data: readingsData, error: readingsError } = await supabase
        .from(readingsTable)
        .select('*')
        .order('l_numero_semana', { ascending: true })

      if (readingsError) throw readingsError

      // Cargar todos los consumos del año
      const { data: consumptionData, error: consumptionError } = await supabase
        .from(consumptionTable)
        .select('*')
        .order('l_numero_semana', { ascending: true })

      if (consumptionError) throw consumptionError

      console.log('✅ Datos de gráfico cargados:', readingsData?.length, 'semanas')

      // Formatear datos para el gráfico
      const chartData = (readingsData || []).map(reading => {
        const consumption = (consumptionData || []).find(c => c.l_numero_semana === reading.l_numero_semana)
        
        return {
          week: `Sem ${reading.l_numero_semana}`,
          period: `Semana ${reading.l_numero_semana}`,
          weekNumber: reading.l_numero_semana,
          reading: parseFloat(reading[columnName]) || 0,
          consumption: parseFloat(consumption?.[columnName]) || 0,
          realConsumption: parseFloat(consumption?.[columnName]) || 0,
          availableForConsumption: datosPozo12.especificaciones_anuales[0].m3_cedidos_por_anexo,
          m3CededByAnnex: datosPozo12.especificaciones_anuales[0].m3_cedidos_por_anexo,
          fechaInicio: reading.l_fecha_inicio,
          fechaFin: reading.l_fecha_fin
        }
      })

      return chartData
    } catch (err) {
      console.error('❌ Error cargando datos del gráfico:', err)
      return []
    }
  }

  // Tipos de visualización disponibles
  const visualizationTypes = [
    { key: 'general', label: 'Vista General' },
    { key: 'consumo-pozo', label: 'Consumo por Pozo - Meses' }
  ]

  // Información estática de pozos según la imagen
  const wellsStaticInfo = {
    11: { location: "Calle Talía 318", service: "Servicios", title: "06NVL114666/24ELGR06", annex: "2.1", m3CededByAnnex: 50000 },
    12: { location: "Calle Navio 358", service: "Servicios", title: "06NVL114666/24ELGR06", annex: "2.2", m3CededByAnnex: 20000 },
    3: { location: "Gimnasio sur", service: "Servicios", title: "06NVL102953/24EMGR06", annex: "2.1", m3CededByAnnex: 0 },
    4: { location: "CDB2", service: "Riego", title: "06NVL102953/24EMGR06", annex: "2.2", m3CededByAnnex: 60000 },
    7: { location: "Calle Revolución", service: "Servicios", title: "06NVL102953/24EMGR06", annex: "2.3", m3CededByAnnex: 0 },
    8: { location: "Calle junico de la Vega esquina arroyo seco", service: "Riego", title: "06NVL102953/24EMGR06", annex: "2.4", m3CededByAnnex: 20000 },
    14: { location: "Calle Musas 323", service: "Servicios", title: "06NVL102953/24EMGR06", annex: "2.5", m3CededByAnnex: 0 },
    15: { location: "Posterior a Cedes (enfrente de Núcelo)", service: "Riego", title: "06NVL102953/24EMGR06", annex: "2.6", m3CededByAnnex: 40000 }
  }

  const staticInfo = wellsStaticInfo[id] || wellsStaticInfo[12]

  // Datos específicos del Pozo basados en el JSON reorganizado
  const wellData = {
    id: parseInt(id) || 12,
    name: `Pozo ${id}`,
    service: staticInfo.service,
    location: staticInfo.location,
    annexCode: staticInfo.annex,
    titleCode: staticInfo.title,
    m3CededByAnnex: staticInfo.m3CededByAnnex,
    status: "active",
    yearlyData: datosPozo12.especificaciones_anuales.map(spec => ({
      year: spec.año,
      m3CededByAnnex: spec.m3_cedidos_por_anexo,
      m3CededByTitle: spec.m3_cedidos_por_titulo,
      realConsumption: spec.consumo_real_m3,
      availableForConsumption: spec.m3_disponibles_para_consumir,
      observations: spec.observaciones
    })),
    quarterlyData: datosPozo12.datos_trimestrales.consumo_trimestral.map((trimestre, index) => {
      const trimestreNum = ['primer_trimestre', 'segundo_trimestre', 'tercer_trimestre', 'cuarto_trimestre'];
      const quarterLabels = ['T1', 'T2', 'T3', 'T4'];
      
      return trimestreNum.map((key, qIndex) => {
        if (trimestre[key] !== null && trimestre[key] !== undefined) {
          return {
            period: `Q${qIndex + 1} ${trimestre.año}`,
            quarter: `${quarterLabels[qIndex]} ${trimestre.año}`,
            m3CededByAnnex: 0, // No hay datos específicos en el JSON
            m3CededByTitle: 0, // No hay datos específicos en el JSON  
            realConsumption: trimestre[key],
            availableForConsumption: 70885, // Valor por defecto del JSON
            observations: `${quarterLabels[qIndex]} ${trimestre.año} - Consumo real`
          }
        }
        return null;
      }).filter(Boolean);
    }).flat(),
    monthlyData: (() => {
      const monthlyConsumption = datosPozo12.datos_mensuales.consumo_mensual;
      const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                         'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const monthAbbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
                          'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      return monthlyConsumption.flatMap(yearData => {
        return monthNames.map((month, index) => {
          const consumption = yearData[month];
          if (consumption !== null) {
            return {
              period: `${monthAbbrev[index]} ${yearData.año}`,
              month: monthNames[index].charAt(0).toUpperCase() + monthNames[index].slice(1),
              m3CededByAnnex: 0, // No hay datos específicos en el JSON
              m3CededByTitle: 0, // No hay datos específicos en el JSON
              realConsumption: consumption,
              availableForConsumption: 70885, // Valor por defecto del JSON
              observations: `${monthNames[index].charAt(0).toUpperCase() + monthNames[index].slice(1)} ${yearData.año}: Consumo registrado`
            };
          }
          return null;
        }).filter(Boolean);
      });
    })(),
    weeklyData: (() => {
      const weeklyConsumption = datosPozo12.datos_semanales.consumo_semanal_detallado;
      const weeklyReadings = datosPozo12.datos_semanales.lecturas_acumuladas;
      
      return weeklyConsumption.map((week, index) => {
        const matchingReading = weeklyReadings.find(reading => 
          reading.fecha.includes(week.periodo.split(' ')[2]) && 
          reading.fecha.includes(week.periodo.split(' ')[3])
        );
        
        return {
          period: week.periodo,
          week: `Sem ${index + 1}`,
          m3CededByAnnex: 0,
          m3CededByTitle: 0,
          realConsumption: week.total_pozos,
          consumoServicios: week.consumo_servicios,
          consumoRiego: week.consumo_riego,
          availableForConsumption: 70885,
          observations: week.notas || `Semana del ${week.periodo}`,
          lectura: matchingReading?.lectura || 0
        };
      });
    })(),
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

  // Opciones de métricas disponibles para graficar (coinciden con las 4 tarjetas de abajo)
  const availableMetrics = [
    { key: 'reading', label: 'Lectura Acumulada (m³)', color: '#3b82f6' },
    { key: 'consumption', label: 'Consumo Semanal (m³)', color: '#10b981' },
    { key: 'vsLastWeek', label: 'vs Semana Anterior (m³)', color: '#f59e0b' },
    { key: 'vsLastYear', label: 'vs Año Anterior (m³)', color: '#8b5cf6' }
  ]

  // Filtrar datos por rango de fechas
  const filterDataByDateRange = (data) => {
    if (dateRange === 'all') return data;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'last6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case 'lastyear':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          const endDate = new Date(customEndDate);
          return data.filter(item => {
            // Para datos semanales, usar la fecha del período
            if (timeFilter === 'weekly' && item.period) {
              const itemDate = new Date(item.period.split(' - ')[0]);
              return itemDate >= startDate && itemDate <= endDate;
            }
            return true;
          });
        }
        return data;
      default:
        return data;
    }
    
    // Filtrar por año para datos anuales, trimestrales y mensuales
    if (timeFilter !== 'weekly') {
      return data.filter(item => {
        const itemYear = parseInt(item.year || item.quarter?.split(' ')[1] || item.period?.split(' ')[1]);
        return itemYear >= startDate.getFullYear();
      });
    }
    
    // Filtrar por fecha para datos semanales
    return data.filter(item => {
      const itemDate = new Date(item.fechaInicio);
      return itemDate >= startDate;
    });
  };

  // Preparar datos para los gráficos según el filtro de tiempo y tipo de visualización
  const getChartData = () => {
    let sourceData = []
    let labelKey = 'year'
    
    // Si es visualización de consumo por pozo, forzar vista mensual
    if (visualizationType === 'consumo-pozo') {
      sourceData = wellData.monthlyData || []
      labelKey = 'period'
    } else {
      switch (timeFilter) {
        case 'weekly':
          // Usar datos de Supabase si están disponibles, sino usar JSON
          sourceData = chartDataFromSupabase.length > 0 ? chartDataFromSupabase : wellData.weeklyData || []
          labelKey = 'period'
          break
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
    }
    
    // Aplicar filtros de fecha
    const filteredData = filterDataByDateRange(sourceData);
    
    if (visualizationType === 'consumo-pozo') {
      // Para la vista de consumo por pozo, usar datos mensuales del JSON
      const monthNames = {
        'enero': 'Ene', 'febrero': 'Feb', 'marzo': 'Mar', 
        'abril': 'Abr', 'mayo': 'May', 'junio': 'Jun',
        'julio': 'Jul', 'agosto': 'Ago', 'septiembre': 'Sep', 
        'octubre': 'Oct', 'noviembre': 'Nov', 'diciembre': 'Dic'
      }
      
      const monthlyData = []
      datosPozo12.datos_mensuales.consumo_mensual.forEach(yearData => {
        Object.entries(monthNames).forEach(([month, shortMonth]) => {
          if (yearData[month] !== null) {
            monthlyData.push({
              period: `${shortMonth} ${yearData.año}`,
              consumoServicios: yearData[month] * 0.6, // Estimado 60% para servicios
              consumoRiego: yearData[month] * 0.4, // Estimado 40% para riego
              total: yearData[month]
            })
          }
        })
      })
      
      return monthlyData
    }
    
    // Vista general
    return filteredData.map(data => ({
      [labelKey]: timeFilter === 'yearly' 
        ? data.year?.toString().replace(' (hasta mayo)', '')
        : data[labelKey] || data.period,
      reading: data.reading || 0,
      consumption: data.consumption || 0,
      realConsumption: data.realConsumption || 0,
      consumoServicios: data.consumoServicios || 0,
      consumoRiego: data.consumoRiego || 0,
      availableForConsumption: data.availableForConsumption || 0,
      m3CededByAnnex: data.m3CededByAnnex || 0,
      m3CededByTitle: data.m3CededByTitle || 0,
      vsLastWeek: data.vsLastWeek || 0,
      vsLastYear: data.vsLastYear || 0,
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
                        <label className="text-sm font-medium text-gray-500">m³ cedidos por Anexo (2025)</label>
                        <p className="text-sm text-gray-900">{wellData.m3CededByAnnex.toLocaleString()}</p>
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

            {/* Historial de consumo - DESHABILITADO */}
            {false && (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                          AÑO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                          m³ CEDIDOS POR ANO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                          m³ CEDIDOS POR TÍTULO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                         m³ DISPONIBLES PARA CONSUMIR
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                        CONSUMO REAL (m³) 
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                        ESTADO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider">
                        OBSERVACIONES
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
                              {data.availableForConsumption.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             
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
            )}

            {/* Análisis Gráfico de Datos Históricos */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3Icon className="h-5 w-5" />
                    Análisis Gráfico de Datos Históricos
                  </h2>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <BarChart3Icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Tipo de Visualización:</span>
                      <select 
                        value={visualizationType} 
                        onChange={(e) => setVisualizationType(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        {visualizationTypes.map(type => (
                          <option key={type.key} value={type.key}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
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
                        <option value="weekly">Semanal</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Rango:</span>
                      <select 
                        value={dateRange} 
                        onChange={(e) => setDateRange(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="all">Todos los datos</option>
                        <option value="lastyear">Último año</option>
                        <option value="last6months">Últimos 6 meses</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </div>
                    {dateRange === 'custom' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          placeholder="Fecha inicio"
                        />
                        <span className="text-sm text-gray-500">a</span>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          placeholder="Fecha fin"
                        />
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
                    {visualizationType === 'consumo-pozo' ? (
                      // Métricas específicas para vista de consumo por pozo
                      [
                        { key: 'consumoServicios', label: 'Consumo Servicios (m³)', color: '#f59e0b' },
                        { key: 'consumoRiego', label: 'Consumo Riego (m³)', color: '#10b981' },
                        { key: 'total', label: 'Consumo Total (m³)', color: '#dc2626' }
                      ].map((metric) => (
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
                      ))
                    ) : (
                      // Métricas para vista general
                      availableMetrics.map((metric) => (
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
                      ))
                    )}
                  </div>
                </div>

                {/* Gráfico principal con Chart.js */}
                <ChartComponent 
                  chartType={chartType}
                  chartData={chartData}
                  selectedMetrics={selectedMetrics}
                  availableMetrics={visualizationType === 'consumo-pozo' ? 
                    [
                      { key: 'consumoServicios', label: 'Consumo Servicios (m³)', color: '#f59e0b' },
                      { key: 'consumoRiego', label: 'Consumo Riego (m³)', color: '#10b981' },
                      { key: 'total', label: 'Consumo Total (m³)', color: '#dc2626' }
                    ] : 
                    availableMetrics
                  }
                />

                {/* Métricas en tiempo real desde Supabase */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  {loading ? (
                    <Card className="p-4 col-span-4">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2Icon className="h-5 w-5 animate-spin text-gray-400" />
                        <span className="text-sm text-gray-500">Cargando métricas...</span>
                      </div>
                    </Card>
                  ) : error ? (
                    <Card className="p-4 col-span-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangleIcon className="h-5 w-5" />
                        <span className="text-sm">Error: {error}</span>
                      </div>
                    </Card>
                  ) : (
                    <>
                      {/* Lectura Actual */}
                      <Card className="p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Lectura Actual</h4>
                        <div className="flex items-center gap-2">
                          <DropletIcon className="h-5 w-5 text-blue-500" />
                          <span className="text-lg font-semibold text-gray-900">
                            {currentReading.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Última semana registrada</p>
                      </Card>
                      
                      {/* Consumo Actual */}
                      <Card className="p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Consumo Actual</h4>
                        <div className="flex items-center gap-2">
                          <DropletIcon className="h-5 w-5 text-green-500" />
                          <span className="text-lg font-semibold text-gray-900">
                            {currentConsumption.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Última semana</p>
                      </Card>
                      
                      {/* vs Semana Anterior */}
                      <Card className="p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">vs Semana Anterior</h4>
                        <div className="flex items-center gap-2">
                          {vsLastWeek > 0 ? (
                            <TrendingUpIcon className="h-5 w-5 text-red-500" />
                          ) : vsLastWeek < 0 ? (
                            <TrendingDownIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5" />
                          )}
                          <span className={`text-lg font-semibold ${vsLastWeek > 0 ? 'text-red-600' : vsLastWeek < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {vsLastWeek > 0 ? '+' : ''}{vsLastWeek.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {vsLastWeek > 0 ? 'Aumento' : vsLastWeek < 0 ? 'Disminución' : 'Sin cambio'}
                        </p>
                      </Card>
                      
                      {/* vs Año Anterior */}
                      <Card className="p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">vs Año Anterior</h4>
                        <div className="flex items-center gap-2">
                          {vsLastYear > 0 ? (
                            <TrendingUpIcon className="h-5 w-5 text-red-500" />
                          ) : vsLastYear < 0 ? (
                            <TrendingDownIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5" />
                          )}
                          <span className={`text-lg font-semibold ${vsLastYear > 0 ? 'text-red-600' : vsLastYear < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {vsLastYear > 0 ? '+' : ''}{vsLastYear.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Misma semana 2024</p>
                      </Card>
                    </>
                  )}
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