import { useState, useEffect } from 'react'
import { useNavigate } from "react-router"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { supabase } from '../supabaseClient'
import WellsGeneralCharts from '../components/WellsGeneralCharts'
import { 
  DropletIcon, 
  TrendingUpIcon, 
  TrendingDownIcon, 
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SettingsIcon,
  EyeIcon,
  Plus,
  PlusIcon,
  Loader2Icon
} from "lucide-react"

export default function WellsPage() {
  const navigate = useNavigate()
  const [wellsData, setWellsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Definición de pozos con sus columnas en Supabase
  const wellsConfig = [
    // POZOS DE SERVICIOS
    { id: 11, name: "Pozo 11", type: "Servicios", column: "l_pozo_11", location: "Zona Servicios" },
    { id: 12, name: "Pozo 12", type: "Servicios", column: "l_pozo_12", location: "Calle Navio 358" },
    { id: 3, name: "Pozo 3", type: "Servicios", column: "l_pozo_3", location: "Zona Servicios" },
    { id: 7, name: "Pozo 7", type: "Servicios", column: "l_pozo_7", location: "Zona Servicios" },
    { id: 14, name: "Pozo 14", type: "Servicios", column: "l_pozo_14", location: "Zona Servicios" },
    // POZOS DE RIEGO
    { id: 4, name: "Pozo 4", type: "Riego", column: "l_pozo_4_riego", location: "Zona Riego" },
    { id: 8, name: "Pozo 8", type: "Riego", column: "l_pozo_8_riego", location: "Zona Riego" },
    { id: 15, name: "Pozo 15", type: "Riego", column: "l_pozo_15_riego", location: "Zona Riego" }
  ]

  // Cargar datos de Supabase
  useEffect(() => {
    fetchWellsData()
  }, [])

  const fetchWellsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const year = 2025
      const readingsTable = `lecturas_semana_agua_${year}`
      const consumptionTable = `lecturas_semana_agua_consumo_${year}`

      console.log('🔍 Cargando datos de pozos desde:', readingsTable, consumptionTable)

      // Cargar lecturas
      const { data: readingsData, error: readingsError } = await supabase
        .from(readingsTable)
        .select('*')
        .order('l_numero_semana', { ascending: false })
        .limit(2) // Últimas 2 semanas

      if (readingsError) throw readingsError

      // Cargar consumo
      const { data: consumptionData, error: consumptionError } = await supabase
        .from(consumptionTable)
        .select('*')
        .order('l_numero_semana', { ascending: false })
        .limit(2) // Últimas 2 semanas

      if (consumptionError) throw consumptionError

      console.log('✅ Lecturas:', readingsData)
      console.log('✅ Consumo:', consumptionData)

      // Procesar datos para cada pozo
      const processedWells = wellsConfig.map(well => {
        const lastWeekReading = readingsData?.[0]?.[well.column] || 0
        const previousWeekReading = readingsData?.[1]?.[well.column] || 0
        const lastWeekConsumption = consumptionData?.[0]?.[well.column] || 0
        const previousWeekConsumption = consumptionData?.[1]?.[well.column] || 0

        // Calcular vs semana anterior
        const vsLastWeek = lastWeekConsumption - previousWeekConsumption
        
        // Calcular % de ahorro (negativo = ahorro, positivo = aumento)
        const savingsPercent = previousWeekConsumption > 0
          ? ((vsLastWeek / previousWeekConsumption) * 100)
          : 0

        return {
          ...well,
          lastWeekReading: parseFloat(lastWeekReading) || 0,
          lastWeekConsumption: parseFloat(lastWeekConsumption) || 0,
          vsLastWeek: parseFloat(vsLastWeek) || 0,
          savingsPercent: parseFloat(savingsPercent.toFixed(1)) || 0,
          weekNumber: readingsData?.[0]?.l_numero_semana || 0
        }
      })

      setWellsData(processedWells)
      console.log('✅ Datos procesados:', processedWells)
    } catch (err) {
      console.error('❌ Error cargando datos de pozos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  

  const getQualityBadge = (quality) => {
    switch (quality) {
      case 'excellent':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Excelente</Badge>
      case 'good':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Buena</Badge>
      case 'fair':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Regular</Badge>
      case 'poor':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Deficiente</Badge>
      default:
        return <Badge>N/A</Badge>
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'maintenance':
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />
      case 'inactive':
        return <XCircleIcon className="h-5 w-5 text-red-600" />
      default:
        return null
    }
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
            {/* Header de la página */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Pozos</h1>
                <p className="text-gray-600 mt-1">Monitoreo y control de pozos de agua</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Pozo
              </Button>
            </div>

            {/* Lista de pozos */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lista de Pozos</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pozo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lectura Última Semana (m³)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consumo Última Semana (m³)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          vs Semana Anterior (m³)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % Cambio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <Loader2Icon className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                            <p className="text-sm text-gray-500 mt-2">Cargando datos...</p>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <AlertTriangleIcon className="h-8 w-8 mx-auto text-red-500" />
                            <p className="text-sm text-red-600 mt-2">Error: {error}</p>
                          </td>
                        </tr>
                      ) : wellsData.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <p className="text-sm text-gray-500">No hay datos disponibles</p>
                          </td>
                        </tr>
                      ) : (
                        wellsData.map((well) => (
                          <tr key={well.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {well.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {well.location}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={well.type === 'Servicios' ? 'default' : 'secondary'}>
                                {well.type}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                              {well.lastWeekReading.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                              {well.lastWeekConsumption.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <div className="flex items-center justify-end gap-1">
                                {well.vsLastWeek > 0 ? (
                                  <TrendingUpIcon className="h-4 w-4 text-red-500" />
                                ) : well.vsLastWeek < 0 ? (
                                  <TrendingDownIcon className="h-4 w-4 text-green-500" />
                                ) : null}
                                <span className={well.vsLastWeek > 0 ? 'text-red-600 font-medium' : well.vsLastWeek < 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                  {well.vsLastWeek > 0 ? '+' : ''}{well.vsLastWeek.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                              <div className="flex items-center justify-end gap-1">
                                {well.savingsPercent > 0 ? (
                                  <TrendingUpIcon className="h-4 w-4 text-red-500" />
                                ) : well.savingsPercent < 0 ? (
                                  <TrendingDownIcon className="h-4 w-4 text-green-500" />
                                ) : null}
                                <span className={well.savingsPercent > 0 ? 'text-red-600 font-medium' : well.savingsPercent < 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                  {well.savingsPercent > 0 ? '+' : ''}{well.savingsPercent}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => navigate(`/pozos/${well.id}`)}
                                  title="Ver detalles"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" title="Configuración">
                                  <SettingsIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Gráficos Generales de Consumo */}
            <WellsGeneralCharts />

            {/* Sección de detalles adicionales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alertas de pozos */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Recientes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-green-50 border-l-4 border-green-400">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Todos los pozos operando normalmente
                        </p>
                        <p className="text-sm text-green-700">
                          Sistema funcionando correctamente
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400">
                      <DropletIcon className="h-5 w-5 text-blue-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Pozos de servicios - Rendimiento óptimo
                        </p>
                        <p className="text-sm text-blue-700">
                          5 pozos activos cumpliendo con los estándares
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recomendaciones */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-bold text-sm">💡</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-900">Monitoreo continuo</p>
                        <p className="text-sm text-purple-700">Mantener vigilancia en niveles de agua de todos los pozos</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">📊</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900">Optimización de recursos</p>
                        <p className="text-sm text-blue-700">Revisar distribución de carga entre pozos de servicios y riego</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold text-sm">🔧</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-900">Mantenimiento preventivo</p>
                        <p className="text-sm text-green-700">Programar revisiones periódicas para garantizar eficiencia</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Botón flotante para agregar datos */}
      <Button
        onClick={() => navigate('/agregar-datos')}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
        size="icon"
      >
        <PlusIcon className="h-6 w-6" />
      </Button>
    </div>
  )
}

