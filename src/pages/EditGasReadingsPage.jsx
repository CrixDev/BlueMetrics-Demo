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
  Loader2Icon,
  RefreshCwIcon
} from 'lucide-react'
import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth'
import { getGasTableNameByYear, AVAILABLE_YEARS, DEFAULT_YEAR } from '../utils/tableHelpers'

export default function EditGasReadingsPage() {
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR)
  const [readings, setReadings] = useState({})
  const [activeCategory, setActiveCategory] = useState('acometidas_campus')
  const [searchTerm, setSearchTerm] = useState('')
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved')
  const firstInputRef = useRef(null)

  const [existingWeeks, setExistingWeeks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar semanas existentes
  useEffect(() => {
    fetchExistingWeeks()
  }, [selectedYear])

  const fetchExistingWeeks = async () => {
    try {
      setLoading(true)
      setError(null)

      const tableName = getGasTableNameByYear(selectedYear)
      console.log('🔍 Cargando desde tabla:', tableName)
      
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('numero_semana, fecha_inicio, fecha_fin')
        .order('numero_semana', { ascending: true })

      if (fetchError) throw fetchError

      console.log('✅ Semanas gas obtenidas:', data)

      const weeks = (data || []).map(week => ({
        weekNumber: week.numero_semana,
        startDate: week.fecha_inicio,
        endDate: week.fecha_fin
      }))

      setExistingWeeks(weeks)

    } catch (err) {
      console.error('❌ Error al cargar semanas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Cargar lecturas de una semana específica
  useEffect(() => {
    if (selectedWeek) {
      loadWeekReadings(selectedWeek)
    }
  }, [selectedWeek])

  const loadWeekReadings = async (weekNumber) => {
    try {
      setLoading(true)
      const tableName = getGasTableNameByYear(selectedYear)
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('numero_semana', weekNumber)
        .single()

      if (fetchError) {
        console.log('🆕 Semana sin datos')
        setReadings({})
        return
      }

      console.log('✅ Lecturas gas cargadas:', data)

      const loadedReadings = {}
      
      gasConsumptionPointsData.categories.forEach(category => {
        category.points.forEach(point => {
          if (!point.noRead) {
            const dbFieldName = point.id
            if (data[dbFieldName] !== null && data[dbFieldName] !== undefined) {
              const key = `${point.id}_${weekNumber}`
              loadedReadings[key] = data[dbFieldName].toString()
            }
          }
        })
      })

      setReadings(loadedReadings)

    } catch (err) {
      console.error('❌ Error al cargar lecturas:', err)
    } finally {
      setLoading(false)
    }
  }

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
    if (Object.keys(readings).length === 0 || !selectedWeek) return

    const timer = setTimeout(() => {
      saveReadings()
    }, 3000)

    return () => clearTimeout(timer)
  }, [readings])

  const saveReadings = async () => {
    if (!selectedWeek) {
      console.warn('⚠️ No hay semana seleccionada')
      return
    }

    setAutoSaveStatus('saving')
    try {
      const weekData = {
        numero_semana: selectedWeek
      }

      gasConsumptionPointsData.categories.forEach(category => {
        category.points.forEach(point => {
          if (!point.noRead) {
            const key = `${point.id}_${selectedWeek}`
            const value = readings[key]
            
            if (value && value.trim() !== '') {
              weekData[point.id] = parseFloat(value)
            }
          }
        })
      })

      console.log('💾 Guardando datos gas:', weekData)

      const tableName = getGasTableNameByYear(selectedYear)
      const weekInfo = existingWeeks.find(w => w.weekNumber === selectedWeek)
      
      if (weekInfo) {
        weekData.fecha_inicio = weekInfo.startDate
        weekData.fecha_fin = weekInfo.endDate
      }

      const { error: updateError } = await supabase
        .from(tableName)
        .update(weekData)
        .eq('numero_semana', selectedWeek)

      if (updateError) throw updateError
      
      console.log('✅ Lecturas gas actualizadas exitosamente')
      setAutoSaveStatus('saved')
      setTimeout(() => setAutoSaveStatus('saved'), 2000)

    } catch (error) {
      console.error('❌ Error guardando:', error)
      setAutoSaveStatus('error')
      setError(error.message)
    }
  }

  const copyPreviousWeekReadings = async () => {
    if (!selectedWeek || selectedWeek === 1) {
      alert('No hay semana anterior para copiar')
      return
    }

    const previousWeek = selectedWeek - 1

    try {
      const tableName = getGasTableNameByYear(selectedYear)
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

      gasConsumptionPointsData.categories.forEach(category => {
        category.points.forEach(point => {
          if (!point.noRead) {
            const dbFieldName = point.id
            if (data[dbFieldName] !== null && data[dbFieldName] !== undefined) {
              const key = `${point.id}_${selectedWeek}`
              newReadings[key] = data[dbFieldName].toString()
            }
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

  const handleReadingChange = (pointId, value) => {
    const key = `${pointId}_${selectedWeek}`
    setReadings(prev => ({
      ...prev,
      [key]: value
    }))
  }

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
                    Editar Lecturas Semanales de Gas
                  </h1>
                  <p className="text-muted-foreground">
                    Edita manualmente las lecturas de consumo de gas - Año {selectedYear}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Año:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value)
                        setSelectedWeek(null)
                        setReadings({})
                      }}
                      className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {AVAILABLE_YEARS.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

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
                        Guardado
                      </span>
                    )}
                    {autoSaveStatus === 'error' && (
                      <span className="text-destructive flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        Error
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
                    <span className="text-muted-foreground">Cargando semanas...</span>
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
                        Selecciona una semana para editar sus lecturas
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
                          <span className="text-sm font-bold text-primary">
                            {progress.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="relative w-80">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Buscar medidor..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                              ? 'bg-primary text-primary-foreground shadow-sm'
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
                                  <div className="flex-shrink-0">
                                    {isCompleted ? (
                                      <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <CircleIcon className="h-5 w-5 text-muted-foreground" />
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {point.name}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                      {point.id}
                                    </span>
                                  </div>

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
                                </div>
                              )
                            })
                          )}
                        </div>

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
          </main>
        </div>
      </div>
    </RedirectIfNotAuth>
  )
}
