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
  Loader2Icon,
  X,
  GaugeIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon
} from "lucide-react"

export default function WellsPage() {
  const navigate = useNavigate()
  const [wellsData, setWellsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [selectedWell, setSelectedWell] = useState(null)
  
  // Información estática de pozos (igual que en WellDetailPage)
  const [wellsStaticInfo, setWellsStaticInfo] = useState({
    11: {
      location: "Calle Talía 318",
      service: "Servicios",
      title: "06NVL114666/24ELGR06",
      annex: "2.1",
      m3CededByAnnex: 50000,
      m3PorAnexo: 190229.00,
      medidor: {
        fechaInstalacion: "2020-01-15",
        vidaUtilMeses: 60,
        topeLectura: 999999.99,
        estado: "activo",
        tipoFalla: null,
        fechaFalla: null
      },
      historialEstado: []
    },
    12: {
      location: "Calle Navio 358",
      service: "Servicios",
      title: "06NVL114666/24ELGR06",
      annex: "2.2",
      m3CededByAnnex: 20000,
      m3PorAnexo: 90885.00,
      medidor: {
        fechaInstalacion: "2019-08-20",
        vidaUtilMeses: 72,
        topeLectura: 999999.99,
        estado: "activo",
        tipoFalla: null,
        fechaFalla: null
      },
      historialEstado: [
        { fechaInicio: "2023-02-10", fechaFin: "2023-02-25", motivo: "Mantenimiento preventivo de bomba", estado: "parado" },
        { fechaInicio: "2024-07-05", fechaFin: "2024-07-08", motivo: "Reparación de tubería", estado: "mantenimiento" }
      ]
    },
    3: {
      location: "Gimnasio sur",
      service: "Servicios",
      title: "06NVL102953/24EMGR06",
      annex: "2.1",
      m3CededByAnnex: 0,
      m3PorAnexo: 1148.00,
      medidor: {
        fechaInstalacion: "2021-03-10",
        vidaUtilMeses: 48,
        topeLectura: 999999.99,
        estado: "activo",
        tipoFalla: null,
        fechaFalla: null
      },
      historialEstado: []
    },
    7: {
      location: "Zona Servicios",
      service: "Servicios",
      title: "06NVL102953/24EMGR06",
      annex: "2.3",
      m3CededByAnnex: 0,
      m3PorAnexo: 50000.00,
      medidor: {
        fechaInstalacion: "2020-06-15",
        vidaUtilMeses: 60,
        topeLectura: 999999.99,
        estado: "activo",
        tipoFalla: null,
        fechaFalla: null
      },
      historialEstado: []
    },
    14: {
      location: "Zona Servicios",
      service: "Servicios",
      title: "06NVL102953/24EMGR06",
      annex: "2.4",
      m3CededByAnnex: 0,
      m3PorAnexo: 50000.00,
      medidor: {
        fechaInstalacion: "2019-11-20",
        vidaUtilMeses: 72,
        topeLectura: 999999.99,
        estado: "activo",
        tipoFalla: null,
        fechaFalla: null
      },
      historialEstado: []
    },
    4: {
      location: "Zona Riego",
      service: "Riego",
      title: "06NVL102953/24EMGR06",
      annex: "2.4",
      m3CededByAnnex: 0,
      m3PorAnexo: 50000.00,
      medidor: {
        fechaInstalacion: "2021-01-10",
        vidaUtilMeses: 60,
        topeLectura: 999999.99,
        estado: "activo",
        tipoFalla: null,
        fechaFalla: null
      },
      historialEstado: []
    },
    8: {
      location: "Zona Riego",
      service: "Riego",
      title: "06NVL102953/24EMGR06",
      annex: "2.5",
      m3CededByAnnex: 0,
      m3PorAnexo: 50000.00,
      medidor: {
        fechaInstalacion: "2020-09-05",
        vidaUtilMeses: 60,
        topeLectura: 999999.99,
        estado: "activo",
        tipoFalla: null,
        fechaFalla: null
      },
      historialEstado: []
    },
    15: {
      location: "Posterior a Cedes (enfrente de Núcleo)",
      service: "Riego",
      title: "06NVL102953/24EMGR06",
      annex: "2.6",
      m3CededByAnnex: 40000,
      m3PorAnexo: 78000.00,
      medidor: {
        fechaInstalacion: "2020-04-12",
        vidaUtilMeses: 60,
        topeLectura: 999999.99,
        estado: "activo",
        tipoFalla: null,
        fechaFalla: null
      },
      historialEstado: []
    }
  })
  
  // Definición de pozos con sus columnas en Supabase
  const wellsConfig = [
    // POZOS DE SERVICIOS
    { id: 11, name: "Pozo 11", column: "l_pozo_11" },
    { id: 12, name: "Pozo 12", column: "l_pozo_12" },
    { id: 3, name: "Pozo 3", column: "l_pozo_3" },
    { id: 7, name: "Pozo 7", column: "l_pozo_7" },
    { id: 14, name: "Pozo 14", column: "l_pozo_14" },
    // POZOS DE RIEGO
    { id: 4, name: "Pozo 4", column: "l_pozo_4_riego" },
    { id: 8, name: "Pozo 8", column: "l_pozo_8_riego" },
    { id: 15, name: "Pozo 15", column: "l_pozo_15_riego" }
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
        const staticInfo = wellsStaticInfo[well.id] || {}
        const lastWeekReading = readingsData?.[0]?.[well.column] || 0
        const previousWeekReading = readingsData?.[1]?.[well.column] || 0
        const lastWeekConsumption = consumptionData?.[0]?.[well.column] || 0
        const previousWeekConsumption = consumptionData?.[1]?.[well.column] || 0

        // Calcular m³ disponibles
        const m3Disponibles = (staticInfo.m3PorAnexo || 0) - (staticInfo.m3CededByAnnex || 0)
        
        // Calcular consumo total del año 2025
        const totalConsumption2025 = consumptionData?.reduce((sum, row) => {
          return sum + (parseFloat(row[well.column]) || 0)
        }, 0) || 0
        
        // Calcular % de consumo
        const consumptionPercent = m3Disponibles > 0 ? (totalConsumption2025 / m3Disponibles) * 100 : 0
        
        // Calcular vs semana anterior
        const vsLastWeek = lastWeekConsumption - previousWeekConsumption

        return {
          ...well,
          location: staticInfo.location || 'N/A',
          service: staticInfo.service || 'N/A',
          lastWeekReading: parseFloat(lastWeekReading) || 0,
          lastWeekConsumption: parseFloat(lastWeekConsumption) || 0,
          m3Disponibles: m3Disponibles,
          totalConsumption2025: totalConsumption2025,
          consumptionPercent: parseFloat(consumptionPercent.toFixed(2)) || 0,
          vsLastWeek: parseFloat(vsLastWeek) || 0,
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 tracking-wider">
                          Semana Evaluada
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                          m³ Disponibles
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                          m³ Consumidos (Semana)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                          Consumo Última Semana (m³)
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 tracking-wider">
                          vs Semana Anterior
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider">
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
                        wellsData.map((well) => {
                          return (
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
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <Badge variant="outline" className="font-mono">
                                  Semana {well.weekNumber}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                                {well.m3Disponibles.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                                {well.totalConsumption2025.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                                {well.lastWeekConsumption.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {well.vsLastWeek > 0 ? (
                                    <TrendingUpIcon className="h-4 w-4 text-red-500" />
                                  ) : well.vsLastWeek < 0 ? (
                                    <TrendingDownIcon className="h-4 w-4 text-green-500" />
                                  ) : null}
                                  <span className={well.vsLastWeek > 0 ? 'text-red-600 font-medium' : well.vsLastWeek < 0 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                    {well.vsLastWeek > 0 ? '+' : ''}{well.vsLastWeek.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
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
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    title="Configuración"
                                    onClick={() => {
                                      setSelectedWell(well)
                                      setConfigModalOpen(true)
                                    }}
                                  >
                                    <SettingsIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
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

      {/* Modal de Configuración */}
      {configModalOpen && selectedWell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Configuración - {selectedWell.name}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfigModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Sección: Información General */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5 text-blue-600" />
                    Información General
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                      <input
                        type="text"
                        defaultValue={wellsStaticInfo[selectedWell.id]?.location || ''}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              location: e.target.value
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Servicio</label>
                      <select
                        defaultValue={wellsStaticInfo[selectedWell.id]?.service || 'Servicios'}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              service: e.target.value
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Servicios">Servicios</option>
                        <option value="Riego">Riego</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                      <input
                        type="text"
                        defaultValue={wellsStaticInfo[selectedWell.id]?.title || ''}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              title: e.target.value
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Anexo</label>
                      <input
                        type="text"
                        defaultValue={wellsStaticInfo[selectedWell.id]?.annex || ''}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              annex: e.target.value
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">m³ por Anexo</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={wellsStaticInfo[selectedWell.id]?.m3PorAnexo || 0}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              m3PorAnexo: parseFloat(e.target.value) || 0
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">m³ Cedidos por Anexo</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={wellsStaticInfo[selectedWell.id]?.m3CededByAnnex || 0}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              m3CededByAnnex: parseFloat(e.target.value) || 0
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">m³ Disponibles Calculados</h4>
                    <p className="text-2xl font-bold text-blue-700">
                      {((wellsStaticInfo[selectedWell.id]?.m3PorAnexo || 0) - (wellsStaticInfo[selectedWell.id]?.m3CededByAnnex || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m³
                    </p>
                  </div>
                </div>

                {/* Sección: Información del Medidor */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GaugeIcon className="h-5 w-5 text-purple-600" />
                    Información del Medidor
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        Fecha de Instalación
                      </label>
                      <input
                        type="date"
                        defaultValue={wellsStaticInfo[selectedWell.id]?.medidor?.fechaInstalacion || ''}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              medidor: {
                                ...prev[selectedWell.id]?.medidor,
                                fechaInstalacion: e.target.value
                              }
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <ClockIcon className="h-4 w-4 inline mr-1" />
                        Vida Útil (meses)
                      </label>
                      <input
                        type="number"
                        defaultValue={wellsStaticInfo[selectedWell.id]?.medidor?.vidaUtilMeses || 60}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              medidor: {
                                ...prev[selectedWell.id]?.medidor,
                                vidaUtilMeses: parseInt(e.target.value) || 60
                              }
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tope de Lectura (m³)</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={wellsStaticInfo[selectedWell.id]?.medidor?.topeLectura || 999999.99}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              medidor: {
                                ...prev[selectedWell.id]?.medidor,
                                topeLectura: parseFloat(e.target.value) || 999999.99
                              }
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado del Medidor</label>
                      <select
                        defaultValue={wellsStaticInfo[selectedWell.id]?.medidor?.estado || 'activo'}
                        onChange={(e) => {
                          setWellsStaticInfo(prev => ({
                            ...prev,
                            [selectedWell.id]: {
                              ...prev[selectedWell.id],
                              medidor: {
                                ...prev[selectedWell.id]?.medidor,
                                estado: e.target.value
                              }
                            }
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="activo">Activo</option>
                        <option value="falla">Falla</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="reemplazo">Requiere Reemplazo</option>
                      </select>
                    </div>

                    {wellsStaticInfo[selectedWell.id]?.medidor?.estado === 'falla' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Falla</label>
                          <input
                            type="text"
                            defaultValue={wellsStaticInfo[selectedWell.id]?.medidor?.tipoFalla || ''}
                            placeholder="Ej: Lectura incorrecta, obstrucción, etc."
                            onChange={(e) => {
                              setWellsStaticInfo(prev => ({
                                ...prev,
                                [selectedWell.id]: {
                                  ...prev[selectedWell.id],
                                  medidor: {
                                    ...prev[selectedWell.id]?.medidor,
                                    tipoFalla: e.target.value
                                  }
                                }
                              }))
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Falla</label>
                          <input
                            type="date"
                            defaultValue={wellsStaticInfo[selectedWell.id]?.medidor?.fechaFalla || ''}
                            onChange={(e) => {
                              setWellsStaticInfo(prev => ({
                                ...prev,
                                [selectedWell.id]: {
                                  ...prev[selectedWell.id],
                                  medidor: {
                                    ...prev[selectedWell.id]?.medidor,
                                    fechaFalla: e.target.value
                                  }
                                }
                              }))
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Sección: Historial de Estado del Pozo */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5 text-orange-600" />
                    Historial de Estado del Pozo
                  </h3>
                  <div className="space-y-3">
                    {wellsStaticInfo[selectedWell.id]?.historialEstado?.length > 0 ? (
                      wellsStaticInfo[selectedWell.id].historialEstado.map((evento, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={
                              evento.estado === 'parado' ? 'bg-red-100 text-red-800' :
                              evento.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }>
                              {evento.estado === 'parado' ? '🔴 Parado' :
                               evento.estado === 'mantenimiento' ? '🟡 Mantenimiento' :
                               '🟢 Activo'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setWellsStaticInfo(prev => ({
                                  ...prev,
                                  [selectedWell.id]: {
                                    ...prev[selectedWell.id],
                                    historialEstado: prev[selectedWell.id].historialEstado.filter((_, i) => i !== index)
                                  }
                                }))
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700">
                            <strong>Periodo:</strong> {new Date(evento.fechaInicio).toLocaleDateString('es-MX')} - {evento.fechaFin ? new Date(evento.fechaFin).toLocaleDateString('es-MX') : 'Presente'}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Motivo:</strong> {evento.motivo}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No hay eventos registrados</p>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newEvento = {
                          fechaInicio: new Date().toISOString().split('T')[0],
                          fechaFin: null,
                          motivo: '',
                          estado: 'parado'
                        }
                        setWellsStaticInfo(prev => ({
                          ...prev,
                          [selectedWell.id]: {
                            ...prev[selectedWell.id],
                            historialEstado: [...(prev[selectedWell.id]?.historialEstado || []), newEvento]
                          }
                        }))
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Evento
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setConfigModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    fetchWellsData()
                    setConfigModalOpen(false)
                  }}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

