import { useParams, useNavigate } from "react-router"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
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
  SettingsIcon
} from "lucide-react"

export default function WellDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Datos específicos del Pozo 12 basados en la información proporcionada
  const wellData = {
    id: 12,
    name: "Pozo 12",
    service: "Servicios",
    location: "Calle Navio 358",
    annexCode: "06NVL14666/24ELGR06 (21)",
    titleCode: "06NVL108500/24EMOC08",
    m3PerAnnex: 90.885,
    status: "active",
    yearlyData: [
      {
        year: 2022,
        m3CededByAnnex: 25.000,
        m3CededByTitle: 0,
        realConsumption: 670.9,
        availableForConsumption: 65.885,
        observations: "Consumo muy bajo respecto al volumen disponible."
      },
      {
        year: 2023,
        m3CededByAnnex: 80.000,
        m3CededByTitle: 0,
        realConsumption: 0,
        availableForConsumption: 10.885,
        observations: "Sin consumo registrado en el año."
      },
      {
        year: 2024,
        m3CededByAnnex: 20.000,
        m3CededByTitle: 0,
        realConsumption: 36152.49,
        availableForConsumption: 70.885,
        observations: "Se realizó el consumo, aunque menor a lo permitido."
      },
      {
        year: "2025 (hasta mayo)",
        m3CededByAnnex: 20.000,
        m3CededByTitle: 0,
        realConsumption: 84493.00,
        availableForConsumption: 70.885,
        observations: "El consumo hasta mayo ya excede el volumen disponible."
      }
    ],
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
                        <label className="text-sm font-medium text-gray-500">m³ por Anexo</label>
                        <p className="text-sm text-gray-900">{wellData.m3PerAnnex.toLocaleString()}</p>
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

            {/* Historial de consumo */}
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Año
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          m³ cedidos por anexo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          m³ cedidos por título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consumo real (m³)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          m³ disponibles para consumir
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Observaciones
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
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {data.availableForConsumption.toLocaleString()}
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
