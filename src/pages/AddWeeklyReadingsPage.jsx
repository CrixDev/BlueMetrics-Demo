import { useState, useEffect } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import consumptionPointsData from '../lib/consumption-points.json'
import { supabase } from '../supabaseClient'
import * as XLSX from 'xlsx'
import { 
  SaveIcon, 
  UploadIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  CalendarIcon,
  Loader2Icon,
  FileSpreadsheetIcon,
  EyeIcon,
  DownloadIcon
} from 'lucide-react'
import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth'
import { getTableNameByYear, AVAILABLE_YEARS, DEFAULT_YEAR } from '../utils/tableHelpers'

export default function AddWeeklyReadingsPage() {
  // Estados principales
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR)
  const [step, setStep] = useState(1) // 1: crear semana, 2: subir excel, 3: verificar datos, 4: confirmación
  
  // Estados para la semana
  const [weekNumber, setWeekNumber] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Estados para Excel y datos
  const [excelFile, setExcelFile] = useState(null)
  const [readings, setReadings] = useState({})
  const [excelData, setExcelData] = useState(null)
  
  // Estados de UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeCategory, setActiveCategory] = useState('pozos_servicios')

  // Calcular siguiente número de semana al cargar
  useEffect(() => {
    fetchNextWeekNumber()
  }, [selectedYear])

  const fetchNextWeekNumber = async () => {
    try {
      const tableName = getTableNameByYear(selectedYear)
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select('l_numero_semana')
        .order('l_numero_semana', { ascending: false })
        .limit(1)

      if (fetchError) throw fetchError

      const nextWeek = data && data.length > 0 ? data[0].l_numero_semana + 1 : 1
      setWeekNumber(nextWeek)
      console.log('📅 Siguiente número de semana:', nextWeek)
    } catch (err) {
      console.error('❌ Error al obtener número de semana:', err)
      setWeekNumber(1)
    }
  }

  // Crear nueva semana
  const createWeek = async () => {
    if (!startDate || !endDate) {
      setError('Por favor completa las fechas de inicio y fin')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const tableName = getTableNameByYear(selectedYear)
      
      // Crear la semana en Supabase
      const { error: insertError } = await supabase
        .from(tableName)
        .insert([{
          l_numero_semana: weekNumber,
          l_fecha_inicio: startDate,
          l_fecha_fin: endDate
        }])

      if (insertError) throw insertError

      console.log('✅ Semana creada:', weekNumber)
      setSuccess(`Semana ${weekNumber} creada exitosamente`)
      setStep(2)
      
    } catch (err) {
      console.error('❌ Error al crear semana:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Procesar archivo Excel
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setExcelFile(file)
    setLoading(true)
    setError(null)

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      console.log('📊 Datos del Excel:', jsonData)
      setExcelData(jsonData)

      if (!jsonData || jsonData.length === 0) {
        throw new Error('El archivo Excel está vacío')
      }

      // Detectar columnas automáticamente
      const firstRow = jsonData[0]
      const columns = Object.keys(firstRow)
      
      // Buscar columnas de nombre/ID (case insensitive)
      const nameColumn = columns.find(col => 
        /^(punto|nombre|name|id|medidor)$/i.test(col.toLowerCase().trim())
      ) || columns.find(col => 
        /(punto|nombre|name|id|medidor)/i.test(col.toLowerCase())
      )

      // Buscar columnas de lectura (case insensitive)
      const readingColumn = columns.find(col => 
        /^(lectura|valor|value|m3|m³|reading)$/i.test(col.toLowerCase().trim())
      ) || columns.find(col => 
        /(lectura|valor|value|m3|m³|reading)/i.test(col.toLowerCase())
      )

      console.log('🔍 Columnas detectadas:', { nameColumn, readingColumn })

      if (!nameColumn || !readingColumn) {
        throw new Error('No se pudieron detectar las columnas necesarias. Asegúrate de tener columnas para nombre y lectura.')
      }

      // Procesar y mapear datos del Excel a readings
      const newReadings = {}
      let matched = 0
      let unmatched = []
      
      jsonData.forEach(row => {
        const pointName = row[nameColumn]?.toString().trim()
        const reading = row[readingColumn]
        
        if (!pointName || !reading) return

        let found = false

        // Buscar el punto de consumo por nombre o ID
        consumptionPointsData.categories.forEach(category => {
          category.points.forEach(point => {
            if (!point.noRead) {
              // Coincidencia exacta o parcial (case insensitive)
              const pointNameLower = pointName.toLowerCase()
              const pointIdLower = point.id.toLowerCase()
              const pointDisplayNameLower = point.name.toLowerCase()
              
              if (pointNameLower === pointIdLower || 
                  pointNameLower === pointDisplayNameLower ||
                  pointIdLower.includes(pointNameLower) ||
                  pointDisplayNameLower.includes(pointNameLower)) {
                const key = `${point.id}_${weekNumber}`
                newReadings[key] = reading.toString()
                found = true
                matched++
              }
            }
          })
        })

        if (!found) {
          unmatched.push(pointName)
        }
      })

      setReadings(newReadings)

      let message = `✅ Excel procesado: ${matched} lecturas cargadas`
      if (unmatched.length > 0) {
        message += `. ${unmatched.length} puntos no encontrados: ${unmatched.slice(0, 3).join(', ')}${unmatched.length > 3 ? '...' : ''}`
        console.warn('⚠️ Puntos no encontrados:', unmatched)
      }

      setSuccess(message)
      setStep(3)
      
    } catch (err) {
      console.error('❌ Error al procesar Excel:', err)
      setError(err.message || 'Error al procesar el archivo Excel. Verifica el formato.')
    } finally {
      setLoading(false)
    }
  }

  // Guardar lecturas en Supabase (método POST normal)
  const saveReadings = async () => {
    if (!weekNumber) return

    setLoading(true)
    setError(null)

    try {
      // Preparar objeto con todas las lecturas
      const weekData = {
        l_numero_semana: weekNumber,
        l_fecha_inicio: startDate,
        l_fecha_fin: endDate
      }

      // Agregar todas las lecturas al objeto
      let readingsCount = 0
      consumptionPointsData.categories.forEach(category => {
        category.points.forEach(point => {
          if (!point.noRead) {
            const key = `${point.id}_${weekNumber}`
            const value = readings[key]
            
            if (value && value.trim() !== '') {
              const numValue = parseFloat(value)
              if (!isNaN(numValue)) {
                weekData[`l_${point.id}`] = numValue
                readingsCount++
              }
            }
          }
        })
      })

      console.log('💾 Guardando datos:', weekData)
      console.log(`📊 Total de lecturas a guardar: ${readingsCount}`)

      if (readingsCount === 0) {
        throw new Error('No hay lecturas para guardar')
      }

      const tableName = getTableNameByYear(selectedYear)
      
      // Verificar que la semana existe
      const { data: existingWeek, error: checkError } = await supabase
        .from(tableName)
        .select('l_id, l_numero_semana')
        .eq('l_numero_semana', weekNumber)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error verificando semana:', checkError)
        throw new Error(`Error verificando semana: ${checkError.message}`)
      }

      if (!existingWeek) {
        console.error('❌ La semana no existe en la base de datos')
        throw new Error(`La semana ${weekNumber} no existe. Por favor créala primero.`)
      }

      console.log('✅ Semana encontrada:', existingWeek)
      
      // UPDATE - Actualizar la semana que creamos
      const { data, error: updateError } = await supabase
        .from(tableName)
        .update(weekData)
        .eq('l_numero_semana', weekNumber)
        .select()

      if (updateError) {
        console.error('❌ Error de Supabase:', updateError)
        console.error('❌ Detalles del error:', JSON.stringify(updateError, null, 2))
        throw new Error(`Error al actualizar: ${updateError.message}`)
      }

      if (!data || data.length === 0) {
        throw new Error('No se actualizó ningún registro')
      }
      
      console.log('✅ Lecturas guardadas exitosamente:', data)
      console.log(`✅ Se guardaron ${readingsCount} lecturas en la semana ${weekNumber}`)
      
      setSuccess(`✅ ${readingsCount} lecturas guardadas exitosamente en Supabase`)
      setStep(4)

    } catch (error) {
      console.error('❌ Error guardando:', error)
      setError(`Error al guardar: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Reiniciar formulario
  const resetForm = () => {
    setStep(1)
    setStartDate('')
    setEndDate('')
    setExcelFile(null)
    setReadings({})
    setExcelData(null)
    setError(null)
    setSuccess(null)
    fetchNextWeekNumber()
  }

  // Descargar plantilla de Excel
  const downloadTemplate = () => {
    // Crear datos de plantilla con TODOS los 147 puntos - solo 3 columnas
    const templateData = []
    
    consumptionPointsData.categories.forEach(category => {
      category.points.forEach(point => {
        templateData.push({
          'Punto de Consumo': point.name,
          'ID': point.id,
          'Lectura': 0
        })
      })
    })

    // Crear hoja de trabajo
    const ws = XLSX.utils.json_to_sheet(templateData)
    
    // Ajustar anchos de columna
    ws['!cols'] = [
      { wch: 70 },  // Punto de Consumo
      { wch: 35 },  // ID
      { wch: 15 }   // Lectura
    ]

    // Crear libro de Excel
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Lecturas Semanales')
    
    // Agregar hoja de instrucciones
    const totalPuntos = consumptionPointsData.categories.reduce((acc, cat) => acc + cat.points.length, 0)
    
    const instrucciones = [
      { 'INSTRUCCIONES': 'Plantilla de Lecturas Semanales de Agua - Aquanet' },
      { 'INSTRUCCIONES': '' },
      { 'INSTRUCCIONES': '📋 INSTRUCCIONES:' },
      { 'INSTRUCCIONES': '' },
      { 'INSTRUCCIONES': '1. Complete la columna "Lectura" con los valores en m³' },
      { 'INSTRUCCIONES': '2. NO modifique las columnas "Punto de Consumo" ni "ID"' },
      { 'INSTRUCCIONES': '3. Guarde el archivo y súbalo en el sistema' },
      { 'INSTRUCCIONES': '' },
      { 'INSTRUCCIONES': '📊 Total de puntos: ' + totalPuntos },
      { 'INSTRUCCIONES': '' },
      { 'INSTRUCCIONES': '⚠️ Nota: Algunos puntos están marcados como "(NO TOMAR LECTURA)"' },
      { 'INSTRUCCIONES': '   Puede dejar esos en 0 o vacío.' }
    ]
    
    const wsInstrucciones = XLSX.utils.json_to_sheet(instrucciones)
    wsInstrucciones['!cols'] = [{ wch: 80 }]
    XLSX.utils.book_append_sheet(wb, wsInstrucciones, 'Instrucciones')

    // Descargar archivo con fecha
    const fecha = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `Plantilla_Lecturas_Semanales_${fecha}.xlsx`)
  }

  // Calcular progreso
  const calculateProgress = () => {
    const total = consumptionPointsData.categories.reduce((acc, cat) => 
      acc + cat.points.filter(p => !p.noRead).length, 0
    )
    const completed = Object.keys(readings).filter(key => readings[key] && readings[key].trim() !== '').length
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const progress = calculateProgress()

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
                    Agregar Lecturas Semanales de Agua
                  </h1>
                  <p className="text-muted-foreground">
                    Crea semana, sube Excel y verifica datos antes de guardar - Año {selectedYear}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Año:</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value)
                        resetForm()
                      }}
                      className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {AVAILABLE_YEARS.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicador de pasos */}
            {step < 4 && (
              <div className="mb-8">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  {[
                    { num: 1, title: 'Crear Semana', icon: CalendarIcon },
                    { num: 2, title: 'Subir Excel', icon: UploadIcon },
                    { num: 3, title: 'Verificar y Guardar', icon: EyeIcon }
                  ].map((s, idx) => (
                    <div key={s.num} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          step >= s.num 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'border-muted text-muted-foreground'
                        }`}>
                          <s.icon className="h-5 w-5" />
                        </div>
                        <p className={`text-sm mt-2 font-medium ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                          {s.title}
                        </p>
                      </div>
                      {idx < 2 && (
                        <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensajes de estado */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircleIcon className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* PASO 1: Crear Semana */}
            {step === 1 && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold">Paso 1: Crear Nueva Semana</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Define las fechas de la semana {weekNumber}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Número de Semana
                      </label>
                      <input
                        type="text"
                        value={`Semana ${weekNumber || '...'}`}
                        disabled
                        className="w-full px-4 py-3 border border-muted rounded-lg bg-muted text-sm font-medium"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Fecha de Inicio
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-3 border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Fecha de Fin
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-4 py-3 border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-4" 
                      size="lg"
                      onClick={createWeek}
                      disabled={loading || !startDate || !endDate}
                    >
                      {loading ? (
                        <>
                          <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Crear Semana y Continuar
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PASO 2: Subir Excel */}
            {step === 2 && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <FileSpreadsheetIcon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold">Paso 2: Subir Archivo Excel</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Semana {weekNumber}: {startDate} - {endDate}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <FileSpreadsheetIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Sube un archivo Excel con las lecturas semanales
                      </p>
                      <label className="inline-block">
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleExcelUpload}
                          className="hidden"
                          disabled={loading}
                        />
                        <Button asChild disabled={loading}>
                          <span>
                            {loading ? (
                              <>
                                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                                Procesando...
                              </>
                            ) : (
                              <>
                                <UploadIcon className="h-4 w-4 mr-2" />
                                Seleccionar Excel
                              </>
                            )}
                          </span>
                        </Button>
                      </label>
                      {excelFile && (
                        <p className="text-sm text-green-600 mt-4">
                          ✓ Archivo cargado: {excelFile.name}
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                            📋 Formato esperado del Excel:
                          </p>
                          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Columna "Punto de Consumo", "Nombre" o "ID"</li>
                            <li>• Columna "Lectura", "Valor" o "m³"</li>
                            <li>• Los nombres deben coincidir con los puntos de consumo</li>
                          </ul>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={downloadTemplate}
                          className="ml-4 bg-white dark:bg-gray-800"
                        >
                          <DownloadIcon className="h-4 w-4 mr-2" />
                          Descargar Plantilla
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PASO 3: Verificar y Guardar */}
            {step === 3 && (
              <>
                {/* Barra de progreso */}
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            Progreso: {progress.completed} de {progress.total} lecturas
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
                      <Button 
                        size="lg"
                        onClick={saveReadings}
                        disabled={loading || progress.completed === 0}
                      >
                        {loading ? (
                          <>
                            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <SaveIcon className="h-4 w-4 mr-2" />
                            Guardar Lecturas
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs de Categorías */}
                <div className="mb-6 overflow-x-auto">
                  <div className="flex gap-2 border-b border-muted pb-2">
                    {consumptionPointsData.categories.map(category => {
                      const categoryPoints = category.points.filter(p => !p.noRead)
                      const categoryCompleted = categoryPoints.filter(p => {
                        const key = `${p.id}_${weekNumber}`
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

                {/* Lista de lecturas por categoría */}
                {consumptionPointsData.categories.map(category => {
                  if (category.id !== activeCategory) return null

                  const filteredPoints = category.points.filter(p => !p.noRead)

                  return (
                    <Card key={category.id}>
                      <CardHeader>
                        <div>
                          <h3 className="text-lg font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Verifica los datos antes de guardar
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {filteredPoints.map(point => {
                            const key = `${point.id}_${weekNumber}`
                            const value = readings[key] || ''
                            const isCompleted = value.trim() !== ''

                            return (
                              <div 
                                key={point.id}
                                className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                                  isCompleted 
                                    ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10' 
                                    : 'border-muted bg-muted/30'
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <AlertCircleIcon className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm">{point.name}</p>
                                  <p className="text-xs text-muted-foreground">{point.id}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isCompleted ? (
                                    <span className="text-sm font-bold text-green-600">
                                      {parseFloat(value).toLocaleString()} m³
                                    </span>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">Sin dato</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            )}

            {/* PASO 4: Confirmación de Éxito */}
            {step === 4 && (
              <div className="max-w-2xl mx-auto">
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-12 pb-12">
                    <div className="text-center">
                      {/* Icono de éxito animado */}
                      <div className="mb-6 flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2Icon className="h-16 w-16 text-green-600" />
                        </div>
                      </div>

                      {/* Título */}
                      <h2 className="text-3xl font-bold text-green-800 mb-3">
                        ¡Lecturas Guardadas Exitosamente!
                      </h2>

                      {/* Mensaje de confirmación */}
                      <p className="text-lg text-green-700 mb-6">
                        {success}
                      </p>

                      {/* Detalles de la operación */}
                      <div className="bg-white rounded-lg p-6 mb-8 border border-green-200">
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Semana</p>
                            <p className="text-2xl font-bold text-primary">{weekNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Período</p>
                            <p className="text-sm font-semibold text-foreground">
                              {startDate} - {endDate}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Lecturas</p>
                            <p className="text-2xl font-bold text-green-600">{progress.completed}</p>
                          </div>
                        </div>
                      </div>

                      {/* Resumen por categoría */}
                      <div className="mb-8 text-left">
                        <h3 className="text-lg font-semibold mb-4 text-center">Resumen por Categoría</h3>
                        <div className="space-y-3">
                          {consumptionPointsData.categories.map(category => {
                            const categoryPoints = category.points.filter(p => !p.noRead)
                            const categoryCompleted = categoryPoints.filter(p => {
                              const key = `${p.id}_${weekNumber}`
                              return readings[key] && readings[key].trim() !== ''
                            }).length

                            return (
                              <div key={category.id} className="bg-white rounded-lg p-4 border border-green-200">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-foreground">{category.name}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                      {categoryCompleted} de {categoryPoints.length}
                                    </span>
                                    <CheckCircle2Icon className="h-5 w-5 text-green-600" />
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-4 justify-center">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => window.location.href = '/'}
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          Ir al Dashboard
                        </Button>
                        <Button
                          size="lg"
                          onClick={resetForm}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Agregar Otra Semana
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


