import { useState, useEffect, useRef } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { supabase } from '../supabaseClient'
import { 
  SaveIcon, 
  SearchIcon,
  CheckCircle2Icon,
  CircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  DownloadIcon,
  Loader2Icon,
  RefreshCwIcon,
  PlusIcon
} from 'lucide-react'
import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth'

// Definición de puntos de medición para lecturas diarias
const dailyReadingPoints = [
  { id: 'consumo', name: 'Consumo Total', type: 'general' },
  { id: 'general_pozos', name: 'General Pozos', type: 'pozo' },
  { id: 'pozo_3', name: 'Pozo 3', type: 'pozo' },
  { id: 'pozo_8', name: 'Pozo 8', type: 'pozo' },
  { id: 'pozo_15', name: 'Pozo 15', type: 'pozo' },
  { id: 'pozo_4', name: 'Pozo 4', type: 'pozo' },
  { id: 'pozo7', name: 'Pozo 7', type: 'pozo' },
  { id: 'pozo11', name: 'Pozo 11', type: 'pozo' },
  { id: 'pozo_12', name: 'Pozo 12', type: 'pozo' },
  { id: 'pozo_14', name: 'Pozo 14', type: 'pozo' },
  { id: 'a_y_d', name: 'A y D', type: 'zona' },
  { id: 'campus_8', name: 'Campus 8', type: 'zona' },
  { id: 'a7_cc', name: 'A7-CC', type: 'zona' },
  { id: 'megacentral', name: 'Megacentral', type: 'zona' },
  { id: 'planta_fisica', name: 'Planta Física', type: 'zona' },
  { id: 'residencias', name: 'Residencias', type: 'zona' }
]

export default function AddDailyReadingsPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [readings, setReadings] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [existingReadings, setExistingReadings] = useState([])
  const firstInputRef = useRef(null)

  // Cargar lecturas existentes
  useEffect(() => {
    fetchExistingReadings()
  }, [])

  // Cargar lectura específica cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate) {
      loadReadingByDate(selectedDate)
    }
  }, [selectedDate])

  const fetchExistingReadings = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('lecturas_diarias')
        .select('id, mes_anio, dia_hora, created_at')
        .order('created_at', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError
      setExistingReadings(data || [])
    } catch (err) {
      console.error('❌ Error al cargar lecturas:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadReadingByDate = async (dateStr) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('lecturas_diarias')
        .select('*')
        .eq('dia_hora', dateStr)
        .single()

      if (fetchError) {
        console.log('🆕 Nueva lectura, sin datos previos')
        setReadings({})
        return
      }

      console.log('✅ Lectura cargada:', data)

      const loadedReadings = {}
      dailyReadingPoints.forEach(point => {
        if (data[point.id] !== null && data[point.id] !== undefined) {
          loadedReadings[point.id] = data[point.id].toString()
        }
      })

      setReadings(loadedReadings)
    } catch (err) {
      console.error('❌ Error al cargar lectura:', err)
    }
  }

  const calculateProgress = () => {
    const total = dailyReadingPoints.length
    const completed = dailyReadingPoints.filter(p => {
      return readings[p.id] && readings[p.id].trim() !== ''
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
    if (Object.keys(readings).length === 0 || !selectedDate) return

    const timer = setTimeout(() => {
      saveReadings()
    }, 3000)

    return () => clearTimeout(timer)
  }, [readings])

  const saveReadings = async () => {
    if (!selectedDate) {
      console.warn('⚠️ No hay fecha seleccionada')
      return
    }

    setAutoSaveStatus('saving')
    try {
      const readingData = {
        dia_hora: selectedDate,
        mes_anio: getMesAnio(selectedDate)
      }

      dailyReadingPoints.forEach(point => {
        const value = readings[point.id]
        if (value && value.trim() !== '') {
          readingData[point.id] = parseFloat(value)
        }
      })

      console.log('💾 Guardando datos:', readingData)

      // Verificar si ya existe
      const { data: existingData } = await supabase
        .from('lecturas_diarias')
        .select('id')
        .eq('dia_hora', selectedDate)
        .single()

      if (existingData) {
        // UPDATE
        const { error: updateError } = await supabase
          .from('lecturas_diarias')
          .update(readingData)
          .eq('dia_hora', selectedDate)

        if (updateError) throw updateError
        console.log('✅ Lectura actualizada exitosamente')
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from('lecturas_diarias')
          .insert([readingData])

        if (insertError) throw insertError
        console.log('✅ Lectura guardada exitosamente')
      }

      setAutoSaveStatus('saved')
      await fetchExistingReadings()

    } catch (error) {
      console.error('❌ Error guardando:', error)
      setAutoSaveStatus('error')
      setError(error.message)
    }
  }

  const getMesAnio = (dateStr) => {
    const date = new Date(dateStr)
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    return `${meses[date.getMonth()]} ${date.getFullYear()}`
  }

  const handleReadingChange = (pointId, value) => {
    setReadings(prev => ({
      ...prev,
      [pointId]: value
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

  const getFilteredPoints = () => {
    if (!searchTerm) return dailyReadingPoints
    
    return dailyReadingPoints.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const exportReadings = () => {
    if (Object.keys(readings).length === 0) {
      alert('No hay datos para exportar')
      return
    }

    const exportData = {
      date: selectedDate,
      timestamp: new Date().toISOString(),
      readings: readings
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lectura_diaria_${selectedDate}.json`
    a.click()
  }

  const filteredPoints = getFilteredPoints()

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
                    Agregar Lecturas Diarias
                  </h1>
                  <p className="text-muted-foreground">
                    Sistema para entrada de datos de consumo diario de agua
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
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
                        Guardado
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
                    onClick={fetchExistingReadings}
                    disabled={loading}
                  >
                    <RefreshCwIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Recargar
                  </Button>

                  <Button variant="outline" size="sm" onClick={exportReadings}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </div>

            {/* Selección de Fecha y Hora */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Seleccionar Fecha y Hora</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fecha</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hora (opcional)</label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {!selectedDate && (
                  <div className="text-center py-4 text-muted-foreground text-sm mt-4">
                    Selecciona una fecha para comenzar a ingresar lecturas
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedDate && (
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

                      {/* Búsqueda */}
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

                {/* Formulario de Entrada de Datos */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Lecturas del Día</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ingresa las lecturas de todos los puntos de medición
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
                          const value = readings[point.id] || ''
                          const isCompleted = value.trim() !== ''

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
                                <span className="text-xs text-muted-foreground">
                                  {point.type === 'pozo' ? 'Pozo' : point.type === 'zona' ? 'Zona' : 'General'}
                                </span>
                              </div>

                              {/* Input de lectura */}
                              <div className="flex items-center gap-2">
                                <input
                                  id={`input-${point.id}`}
                                  ref={index === 0 ? firstInputRef : null}
                                  type="number"
                                  step="0.01"
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
              </>
            )}
          </main>
        </div>
      </div>
    </RedirectIfNotAuth>
  )
}
