import { useState, useEffect, useRef } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import gasConsumptionPointsData from '../lib/gas-consumption-points.json'
import { supabase } from '../supabaseClient'
import { 
  SaveIcon, 
  CopyIcon, 
  SearchIcon,
  CheckCircle2Icon,
  CircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  TrendingUpIcon,
  DownloadIcon,
  PlusIcon,
  Loader2Icon,
  RefreshCwIcon
} from 'lucide-react'
import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth'
import { getGasTableNameByYear, AVAILABLE_YEARS, DEFAULT_YEAR } from '../utils/tableHelpers'

export default function AddWeeklyGasReadingsPage() {
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR)
  const [newWeekData, setNewWeekData] = useState({ startDate: '', endDate: '' })
  const [readings, setReadings] = useState({})
  const [activeCategory, setActiveCategory] = useState('acometidas_campus')
  const [searchTerm, setSearchTerm] = useState('')
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved') // 'saved', 'saving', 'error'
  const [showNewWeekModal, setShowNewWeekModal] = useState(false)
  const firstInputRef = useRef(null)

  // Estados para datos de Supabase
  const [existingWeeks, setExistingWeeks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar semanas existentes desde Supabase cuando cambia el año
  useEffect(() => {
    fetchExistingWeeks()
  }, [selectedYear])

  const fetchExistingWeeks = async () => {
    try {
      setLoading(true)
      setError(null)

      const tableName = getGasTableNameByYear(selectedYear)
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('numero_semana, fecha_inicio, fecha_fin')
        .order('numero_semana', { ascending: true })

      if (fetchError) throw fetchError

      console.log('✅ Semanas obtenidas desde Supabase:', data)

      const weeks = (data || []).map(week => ({
        weekNumber: week.numero_semana,
        startDate: week.fecha_inicio,
        endDate: week.fecha_fin
      }))

      setExistingWeeks(weeks)

    } catch (err) {
      console.error('❌ Error al cargar semanas:', err)
      setError(err.message)
      
      // Fallback a datos del JSON
      setExistingWeeks(gasConsumptionPointsData.metadata.weeks)
    } finally {
      setLoading(false)
    }
  }

  // Cargar lecturas de una semana específica al seleccionarla
  useEffect(() => {
    if (selectedWeek) {
      loadWeekReadings(selectedWeek)
    }
  }, [selectedWeek])

  const loadWeekReadings = async (weekNumber) => {
    try {
      const tableName = getGasTableNameByYear(selectedYear)
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('numero_semana', weekNumber)
        .single()

      if (fetchError) {
        // Si no existe, es una semana nueva
        console.log('🆕 Semana nueva, sin datos previos')
        setReadings({})
        return
      }

      console.log('✅ Lecturas cargadas:', data)

      // Convertir los datos de la base de datos al formato de readings
      const loadedReadings = {}
      
      gasConsumptionPointsData.categories.forEach(category => {
        category.points.forEach(point => {
          if (!point.noRead && data[point.id] !== null) {
            const key = `${point.id}_${weekNumber}`
            loadedReadings[key] = data[point.id].toString()
          }
        })
      })

      setReadings(loadedReadings)

    } catch (err) {
      console.error('❌ Error al cargar lecturas:', err)
    }
  }

  // Calcular progreso de entrada de datos
  const calculateProgress = () => {
    const category = gasConsumptionPointsData.categories.find(c => c.id === activeCategory)
    if (!category) return { completed: 0, total: 0, percentage: 0 }

    const activePoints = category.points.filter(p => !p.noRead)
    const total = activePoints.length
    const completed = activePoints.filter(p => {
      const key = `${p.id}_${selectedWeek}`
      return readings[key] && readings[key].trim() !== ''
    }).length

    return { 
      completed, 
      total, 
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0 
    }
  }

  const progress = calculateProgress()

  // Auto-guardar cada 3 segundos
  useEffect(() => {
    if (Object.keys(readings).length === 0) return

    const timer = setTimeout(() => {
      saveReadings()
    }, 3000)

    return () => clearTimeout(timer)
  }, [readings])

  // Guardar lecturas en Supabase
  const saveReadings = async () => {
    if (!selectedWeek) {
      console.warn('⚠️ No hay semana seleccionada')
      return
    }

    setAutoSaveStatus('saving')
    try {
      // Preparar objeto con todas las lecturas
      const weekData = {
        numero_semana: selectedWeek
      }

      // Agregar todas las lecturas al objeto
      gasConsumptionPointsData.categories.forEach(category => {
        category.points.forEach(point => {
          if (!point.noRead) {
            const key = `${point.id}_${selectedWeek}`
            const value = readings[key]
            
            // Solo agregar si hay un valor
            if (value && value.trim() !== '') {
              weekData[point.id] = parseFloat(value)
            }
          }
        })
      })

      console.log('💾 Guardando datos:', weekData)

      const tableName = getGasTableNameByYear(selectedYear)
      
      // Verificar si la semana ya existe
      const { data: existingData } = await supabase
        .from(tableName)
        .select('id')
        .eq('numero_semana', selectedWeek)
        .single()

      if (existingData) {
        // UPDATE - Actualizar semana existente
        const { error: updateError } = await supabase
          .from(tableName)
          .update(weekData)
          .eq('numero_semana', selectedWeek)

        if (updateError) throw updateError
        
        console.log('✅ Lecturas actualizadas exitosamente')
      } else {
        // INSERT - Crear nueva semana
        const weekInfo = existingWeeks.find(w => w.weekNumber === selectedWeek)
        if (weekInfo) {
          weekData.fecha_inicio = weekInfo.startDate
          weekData.fecha_fin = weekInfo.endDate
        }

        const { error: insertError } = await supabase
          .from(tableName)
          .insert([weekData])

        if (insertError) throw insertError
        
        console.log('✅ Lecturas guardadas exitosamente')
      }

      setAutoSaveStatus('saved')
      setTimeout(() => setAutoSaveStatus('saved'), 2000)

    } catch (error) {
      console.error('❌ Error guardando:', error)
      setAutoSaveStatus('error')
      setError(error.message)
    }
  }

  // Copiar lecturas de la semana anterior desde Supabase
  const copyPreviousWeekReadings = async () => {
    if (!selectedWeek || selectedWeek === 1) {
      alert('No hay semana anterior para copiar')
      return
    }

    const previousWeek = selectedWeek - 1

    try {
      const tableName = getGasTableNameByYear(selectedYear)
      // Obtener datos de la semana anterior desde Supabase
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('numero_semana', previousWeek)
        .single()

      if (fetchError) throw fetchError

      if (!data) {
        alert('No se encontraron datos de la semana anterior')
        return
      }

      const newReadings = {}

      // Copiar todas las lecturas de la semana anterior
      gasConsumptionPointsData.categories.forEach(category => {
        category.points.forEach(point => {
          if (!point.noRead && data[point.id] !== null) {
            const key = `${point.id}_${selectedWeek}`
            newReadings[key] = data[point.id].toString()
          }
        })
      })

      setReadings({ ...readings, ...newReadings })
      alert('Lecturas de la semana anterior copiadas exitosamente')

    } catch (err) {
      console.error('❌ Error al copiar lecturas:', err)
      alert(`Error al copiar lecturas: ${err.message}`)
    }
  }

  // Manejar cambio de lectura
  const handleReadingChange = (pointId, value) => {
    const key = `${pointId}_${selectedWeek}`
    setReadings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Manejar Enter para pasar al siguiente campo
  const handleKeyDown = (e, pointId, index, filteredPoints) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const nextIndex = index + 1
      if (nextIndex < filteredPoints.length) {
        const nextPointId = filteredPoints[nextIndex].id
        const nextInput = document.getElementById(`input-${nextPointId}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  // Crear nueva semana
  const createNewWeek = async () => {
    if (!newWeekData.startDate || !newWeekData.endDate) {
      alert('Por favor completa las fechas de inicio y fin')
      return
    }

    const newWeekNumber = existingWeeks.length + 1

    try {
      const tableName = getGasTableNameByYear(selectedYear)
      // Insertar nueva semana en Supabase
      const { error: insertError } = await supabase
        .from(tableName)
        .insert([{
          numero_semana: newWeekNumber,
          fecha_inicio: newWeekData.startDate,
          fecha_fin: newWeekData.endDate
        }])

      if (insertError) throw insertError

      console.log('✅ Nueva semana creada en Supabase')

      // Actualizar lista de semanas
      await fetchExistingWeeks()

      setSelectedWeek(newWeekNumber)
      setShowNewWeekModal(false)
      setNewWeekData({ startDate: '', endDate: '' })
      
      alert(`Semana ${newWeekNumber} creada exitosamente. Ahora puedes ingresar las lecturas.`)

    } catch (err) {
      console.error('❌ Error al crear semana:', err)
      alert(`Error al crear la semana: ${err.message}`)
    }
  }

  // Filtrar puntos por búsqueda
  const getFilteredPoints = (category) => {
    let points = category.points
    
    if (searchTerm) {
      points = points.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return points
  }

  // Exportar datos ingresados
  const exportReadings = () => {
    if (Object.keys(readings).length === 0) {
      alert('No hay datos para exportar')
      return
    }

    const exportData = {
      week: selectedWeek,
      date: new Date().toISOString(),
      readings: readings
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lecturas_semana_${selectedWeek}_${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  return (
    <RedirectIfNotAuth>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="ml-64">
          <DashboardHeader />
          <main className="p-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Agregar Lecturas Semanales de Gas
                  </h1>
                  <p className="text-muted-foreground">
                    Sistema optimizado para entrada rápida de datos de consumo de gas - Año {selectedYear}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Selector de Año */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Año:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value)
                        setSelectedWeek(null)
                        setReadings({})
                      }}
                      className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {AVAILABLE_YEARS.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Auto-save status */}
                  <div className="flex items-center gap-2 text-sm">
                    {autoSaveStatus === 'saving' && (
                      <span className="text-blue-500 flex items-center gap-1">
                        <Loader2Icon className="h-4 w-4 animate-spin" />
                        Guardando...
                      </span>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle2Icon className="h-4 w-4" />
                        Guardado en Supabase
                      </span>
                    )}
                    {autoSaveStatus === 'error' && (
                      <span className="text-destructive flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        Error: {error}
                      </span>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchExistingWeeks}
                    disabled={loading}
                  >
                    <RefreshCwIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Recargar
                  </Button>

                  <Button variant="outline" size="sm" onClick={exportReadings}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowNewWeekModal(true)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nueva Semana
                  </Button>
                </div>
              </div>
            </div>

            {/* Selección de Semana */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Seleccionar Semana</h3>
                  </div>
                  
                  {selectedWeek && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyPreviousWeekReadings}
                      disabled={selectedWeek === 1}
                    >
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Copiar Semana Anterior
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2Icon className="h-8 w-8 animate-spin text-primary mr-3" />
                    <span className="text-muted-foreground">Cargando semanas desde Supabase...</span>
                  </div>
                ) : error && existingWeeks.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircleIcon className="h-12 w-12 text-destructive mx-auto mb-3" />
                    <p className="text-destructive font-semibold mb-2">Error al cargar semanas</p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <Button onClick={fetchExistingWeeks} size="sm">
                      <RefreshCwIcon className="h-4 w-4 mr-2" />
                      Reintentar
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {existingWeeks.map(week => (
                        <button
                          key={week.weekNumber}
                          onClick={() => setSelectedWeek(week.weekNumber)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedWeek === week.weekNumber
                              ? 'border-primary bg-primary/10 shadow-md'
                              : 'border-muted hover:border-primary/50'
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-semibold text-lg">Semana {week.weekNumber}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {week.startDate} - {week.endDate}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    {!selectedWeek && !loading && (
                      <div className="text-center py-8 text-muted-foreground">
                        Selecciona una semana para comenzar a ingresar lecturas
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {selectedWeek && (
              <>
                {/* Barra de progreso y búsqueda */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Progreso: {progress.completed} de {progress.total} medidores
                          </span>
                          <span className="text-sm font-bold text-orange-500">
                            {progress.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Búsqueda */}
                      <div className="relative w-80">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Buscar medidor..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs de Categorías */}
                <div className="mb-6 overflow-x-auto">
                  <div className="flex gap-2 border-b border-muted pb-2">
                    {gasConsumptionPointsData.categories.map(category => {
                      const categoryPoints = category.points.filter(p => !p.noRead)
                      const categoryCompleted = categoryPoints.filter(p => {
                        const key = `${p.id}_${selectedWeek}`
                        return readings[key] && readings[key].trim() !== ''
                      }).length

                      return (
                        <button
                          key={category.id}
                          onClick={() => setActiveCategory(category.id)}
                          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                            activeCategory === category.id
                              ? 'bg-orange-500 text-white shadow-sm'
                              : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                          }`}
                        >
                          {category.name}
                          <span className="ml-2 text-xs opacity-70">
                            ({categoryCompleted}/{categoryPoints.length})
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Formulario de Entrada de Datos */}
                {gasConsumptionPointsData.categories.map(category => {
                  if (category.id !== activeCategory) return null

                  const filteredPoints = getFilteredPoints(category)

                  return (
                    <Card key={category.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {category.description}
                            </p>
                          </div>
                          <Button 
                            size="sm"
                            onClick={saveReadings}
                            disabled={autoSaveStatus === 'saving'}
                          >
                            <SaveIcon className="h-4 w-4 mr-2" />
                            Guardar Ahora
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {filteredPoints.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No se encontraron medidores
                            </div>
                          ) : (
                            filteredPoints.map((point, index) => {
                              const key = `${point.id}_${selectedWeek}`
                              const value = readings[key] || ''
                              const isCompleted = value.trim() !== ''
                              const previousWeekData = point.weeklyData?.find(w => w.week === selectedWeek - 1)

                              // Saltar medidores sin lectura
                              if (point.noRead) return null

                              return (
                                <div 
                                  key={point.id}
                                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                                    isCompleted 
                                      ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10' 
                                      : 'border-muted hover:border-primary/50'
                                  }`}
                                >
                                  {/* Indicador de estado */}
                                  <div className="flex-shrink-0">
                                    {isCompleted ? (
                                      <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <CircleIcon className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>

                                  {/* Información del medidor */}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {point.name}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-xs text-muted-foreground">
                                        {point.type?.replace(/_/g, ' ')}
                                      </span>
                                      {previousWeekData && (
                                        <span className="text-xs text-blue-600 dark:text-blue-400">
                                          Última lectura: {previousWeekData.reading.toLocaleString()} m³
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Input de lectura */}
                                  <div className="flex items-center gap-2">
                                    <input
                                      id={`input-${point.id}`}
                                      ref={index === 0 ? firstInputRef : null}
                                      type="number"
                                      placeholder="Lectura en m³"
                                      value={value}
                                      onChange={(e) => handleReadingChange(point.id, e.target.value)}
                                      onKeyDown={(e) => handleKeyDown(e, point.id, index, filteredPoints)}
                                      className={`w-40 px-3 py-2 border rounded-lg text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-primary ${
                                        isCompleted 
                                          ? 'border-green-300 bg-white dark:bg-gray-900' 
                                          : 'border-muted'
                                      }`}
                                    />
                                    <span className="text-sm text-muted-foreground">m³</span>
                                  </div>

                                  {/* Diferencia vs anterior */}
                                  {isCompleted && previousWeekData && (
                                    <div className="flex items-center gap-1 text-xs">
                                      <TrendingUpIcon className="h-3 w-3 text-primary" />
                                      <span className="font-medium">
                                        +{(parseFloat(value) - previousWeekData.reading).toLocaleString()} m³
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>

                        {/* Ayuda rápida */}
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                            💡 Atajos de teclado:
                          </p>
                          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border">Enter</kbd> - Siguiente campo</li>
                            <li>• <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border">Tab</kbd> - Navegar entre campos</li>
                            <li>• Auto-guardado cada 3 segundos</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            )}

            {/* Modal Nueva Semana */}
            {showNewWeekModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Crear Nueva Semana</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Número de Semana
                        </label>
                        <input
                          type="text"
                          value={`Semana ${existingWeeks.length + 1}`}
                          disabled
                          className="w-full px-3 py-2 border border-muted rounded-lg bg-muted text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Fecha de Inicio
                        </label>
                        <input
                          type="date"
                          value={newWeekData.startDate}
                          onChange={(e) => setNewWeekData(prev => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Fecha de Fin
                        </label>
                        <input
                          type="date"
                          value={newWeekData.endDate}
                          onChange={(e) => setNewWeekData(prev => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setShowNewWeekModal(false)
                            setNewWeekData({ startDate: '', endDate: '' })
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={createNewWeek}
                        >
                          Crear Semana
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </RedirectIfNotAuth>
  )
}


