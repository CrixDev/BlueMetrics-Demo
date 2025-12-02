import { useState, useEffect, useRef } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { supabase } from '../supabaseClient'
import { 
  SaveIcon, 
  CheckCircle2Icon,
  CircleIcon,
  AlertCircleIcon,
  CalendarIcon,
  DownloadIcon,
  Loader2Icon,
  RefreshCwIcon,
  Droplets
} from 'lucide-react'
import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth'

// Definición de puntos de medición para PTAR
const ptarReadingPoints = [
  { id: 'medidor_entrada', name: 'Medidor de Entrada', type: 'medidor', unit: 'm³' },
  { id: 'medidor_salida', name: 'Medidor de Salida', type: 'medidor', unit: 'm³' },
  { id: 'ar', name: 'Agua Residual (AR)', type: 'proceso', unit: 'm³' },
  { id: 'at', name: 'Agua Tratada (AT)', type: 'proceso', unit: 'm³' },
  { id: 'recirculacion', name: 'Recirculación', type: 'proceso', unit: 'm³' },
  { id: 'total_dia', name: 'Total del Día', type: 'total', unit: 'm³' }
]

export default function AddPTARReadingsPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [readings, setReadings] = useState({})
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
        .from('lecturas_ptar')
        .select('id, fecha, hora, created_at')
        .order('fecha', { ascending: false })
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
        .from('lecturas_ptar')
        .select('*')
        .eq('fecha', dateStr)
        .single()

      if (fetchError) {
        console.log('🆕 Nueva lectura, sin datos previos')
        setReadings({})
        setSelectedTime('09:00')
        return
      }

      console.log('✅ Lectura cargada:', data)

      const loadedReadings = {}
      ptarReadingPoints.forEach(point => {
        if (data[point.id] !== null && data[point.id] !== undefined) {
          loadedReadings[point.id] = data[point.id].toString()
        }
      })

      setReadings(loadedReadings)
      if (data.hora) {
        setSelectedTime(data.hora)
      }
    } catch (err) {
      console.error('❌ Error al cargar lectura:', err)
    }
  }

  const calculateProgress = () => {
    const total = ptarReadingPoints.length
    const completed = ptarReadingPoints.filter(p => {
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
        fecha: selectedDate,
        hora: selectedTime || '09:00'
      }

      ptarReadingPoints.forEach(point => {
        const value = readings[point.id]
        if (value && value.trim() !== '') {
          readingData[point.id] = parseFloat(value)
        }
      })

      console.log('💾 Guardando datos:', readingData)

      // Verificar si ya existe
      const { data: existingData } = await supabase
        .from('lecturas_ptar')
        .select('id')
        .eq('fecha', selectedDate)
        .single()

      if (existingData) {
        // UPDATE
        const { error: updateError } = await supabase
          .from('lecturas_ptar')
          .update(readingData)
          .eq('fecha', selectedDate)

        if (updateError) throw updateError
        console.log('✅ Lectura actualizada exitosamente')
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from('lecturas_ptar')
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

  const handleReadingChange = (pointId, value) => {
    setReadings(prev => ({
      ...prev,
      [pointId]: value
    }))
  }

  const handleKeyDown = (e, pointId, index) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const nextIndex = index + 1
      if (nextIndex < ptarReadingPoints.length) {
        const nextPointId = ptarReadingPoints[nextIndex].id
        const nextInput = document.getElementById(`input-${nextPointId}`)
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  const exportReadings = () => {
    if (Object.keys(readings).length === 0) {
      alert('No hay datos para exportar')
      return
    }

    const exportData = {
      date: selectedDate,
      time: selectedTime,
      timestamp: new Date().toISOString(),
      readings: readings
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lectura_ptar_${selectedDate}.json`
    a.click()
  }

  const calculateTotal = () => {
    const ar = parseFloat(readings.ar) || 0
    const at = parseFloat(readings.at) || 0
    const recirculacion = parseFloat(readings.recirculacion) || 0
    return (ar + at + recirculacion).toFixed(2)
  }

  // Auto-calcular total cuando cambian los valores
  useEffect(() => {
    if (readings.ar || readings.at || readings.recirculacion) {
      const total = calculateTotal()
      if (total !== readings.total_dia) {
        setReadings(prev => ({
          ...prev,
          total_dia: total
        }))
      }
    }
  }, [readings.ar, readings.at, readings.recirculacion])

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
                  <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Droplets className="h-8 w-8 text-blue-600" />
                    Agregar Lecturas PTAR
                  </h1>
                  <p className="text-muted-foreground">
                    Sistema para entrada de datos de la Planta de Tratamiento de Aguas Residuales
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
                    <label className="block text-sm font-medium mb-2">Hora</label>
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
                {/* Barra de progreso */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
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
                  </CardContent>
                </Card>

                {/* Formulario de Entrada de Datos */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Lecturas PTAR</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Ingresa las lecturas de los medidores y procesos de la planta
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
                      {ptarReadingPoints.map((point, index) => {
                        const value = readings[point.id] || ''
                        const isCompleted = value.trim() !== ''
                        const isTotal = point.id === 'total_dia'

                        return (
                          <div 
                            key={point.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                              isCompleted 
                                ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10' 
                                : 'border-muted hover:border-primary/50'
                            } ${isTotal ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''}`}
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
                              <span className="text-xs text-muted-foreground capitalize">
                                {point.type}
                              </span>
                            </div>

                            {/* Input de lectura */}
                            <div className="flex items-center gap-2">
                              <input
                                id={`input-${point.id}`}
                                ref={index === 0 ? firstInputRef : null}
                                type="number"
                                step="0.01"
                                placeholder={`Lectura en ${point.unit}`}
                                value={value}
                                onChange={(e) => handleReadingChange(point.id, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, point.id, index)}
                                disabled={isTotal}
                                className={`w-40 px-3 py-2 border rounded-lg text-sm text-right font-medium focus:outline-none focus:ring-2 focus:ring-primary ${
                                  isCompleted 
                                    ? 'border-green-300 bg-white dark:bg-gray-900' 
                                    : 'border-muted'
                                } ${isTotal ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : ''}`}
                              />
                              <span className="text-sm text-muted-foreground">{point.unit}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                        💡 Información:
                      </p>
                      <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded border">Enter</kbd> - Siguiente campo</li>
                        <li>• El <strong>Total del Día</strong> se calcula automáticamente (AR + AT + Recirculación)</li>
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
