import { useNavigate } from "react-router"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
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
  PlusIcon
} from "lucide-react"

export default function WellsPage() {
  const navigate = useNavigate()
  // Datos de los pozos - Servicios primero, luego Riego
  const wells = [
    // POZOS DE SERVICIOS
    {
      id: 11,
      name: "Pozo 11",
      type: "Servicios",
      location: "Zona Servicios",
      depth: "150m",
      waterLevel: "45m",
      flow: "1200 L/min",
      pressure: "2.5 bar",
      status: "active",
      quality: "excellent",
      lastMaintenance: "2024-01-15",
      temperature: "18°C",
      ph: "7.2"
    },
    {
      id: 12,
      name: "Pozo 12",
      type: "Servicios",
      location: "Calle Navio 358",
      depth: "45m",
      waterLevel: "12m",
      flow: "850 L/min",
      pressure: "2.3 bar",
      status: "active",
      quality: "good",
      lastMaintenance: "2024-01-08",
      temperature: "19°C",
      ph: "7.1"
    },
    {
      id: 3,
      name: "Pozo 3",
      type: "Servicios",
      location: "Zona Servicios",
      depth: "120m",
      waterLevel: "38m",
      flow: "800 L/min",
      pressure: "1.8 bar",
      status: "active",
      quality: "fair",
      lastMaintenance: "2024-01-05",
      temperature: "20°C",
      ph: "6.8"
    },
    {
      id: 7,
      name: "Pozo 7",
      type: "Servicios",
      location: "Zona Servicios",
      depth: "160m",
      waterLevel: "55m",
      flow: "950 L/min",
      pressure: "2.1 bar",
      status: "active",
      quality: "good",
      lastMaintenance: "2024-01-10",
      temperature: "16°C",
      ph: "7.0"
    },
    {
      id: 14,
      name: "Pozo 14",
      type: "Servicios",
      location: "Zona Servicios",
      depth: "140m",
      waterLevel: "42m",
      flow: "1100 L/min",
      pressure: "2.4 bar",
      status: "active",
      quality: "excellent",
      lastMaintenance: "2024-01-12",
      temperature: "17°C",
      ph: "7.3"
    },
    // POZOS DE RIEGO
    {
      id: 4,
      name: "Pozo 4",
      type: "Riego",
      location: "Zona Riego",
      depth: "200m",
      waterLevel: "78m",
      flow: "1350 L/min",
      pressure: "2.8 bar",
      status: "active",
      quality: "excellent",
      lastMaintenance: "2024-01-20",
      temperature: "17°C",
      ph: "7.4"
    },
    {
      id: 8,
      name: "Pozo 8",
      type: "Riego",
      location: "Zona Riego",
      depth: "180m",
      waterLevel: "65m",
      flow: "1250 L/min",
      pressure: "2.6 bar",
      status: "active",
      quality: "good",
      lastMaintenance: "2024-01-18",
      temperature: "18°C",
      ph: "7.2"
    },
    {
      id: 15,
      name: "Pozo 15",
      type: "Riego",
      location: "Zona Riego",
      depth: "170m",
      waterLevel: "60m",
      flow: "1150 L/min",
      pressure: "2.5 bar",
      status: "active",
      quality: "good",
      lastMaintenance: "2024-01-14",
      temperature: "19°C",
      ph: "7.1"
    }
  ]

  

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

            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DropletIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pozos de Servicios</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DropletIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pozos de Riego</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Pozos</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </Card>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Caudal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Presión
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nivel de Agua
                        </th>
                       
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {wells.map((well) => (
                        <tr key={well.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getStatusIcon(well.status)}
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
                          <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={well.status === 'active' ? 'secondary' : 'default'}>
                              {well.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {well.flow}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {well.pressure}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {well.waterLevel}
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

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

