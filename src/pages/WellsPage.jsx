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
  // Datos mock para los pozos
  const wells = [
    {
      id: 1,
      name: "Pozo Norte #1",
      location: "Sector Norte",
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
      id: 2,
      name: "Pozo Central #2",
      location: "Sector Central",
      depth: "180m",
      waterLevel: "62m",
      flow: "950 L/min",
      pressure: "2.1 bar",
      status: "active",
      quality: "good",
      lastMaintenance: "2024-01-10",
      temperature: "16°C",
      ph: "7.0"
    },
    {
      id: 3,
      name: "Pozo Sur #3",
      location: "Sector Sur",
      depth: "120m",
      waterLevel: "38m",
      flow: "800 L/min",
      pressure: "1.8 bar",
      status: "maintenance",
      quality: "fair",
      lastMaintenance: "2024-01-05",
      temperature: "20°C",
      ph: "6.8"
    },
    {
      id: 4,
      name: "Pozo Este #4",
      location: "Sector Este",
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
      id: 5,
      name: "Pozo Oeste #5",
      location: "Sector Oeste",
      depth: "160m",
      waterLevel: "55m",
      flow: "0 L/min",
      pressure: "0 bar",
      status: "inactive",
      quality: "poor",
      lastMaintenance: "2023-12-15",
      temperature: "N/A",
      ph: "N/A"
    },
    {
      id: 12,
      name: "Pozo 12",
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
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Mantenimiento</Badge>
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inactivo</Badge>
      default:
        return <Badge>Desconocido</Badge>
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

            {/* Estadísticas generales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pozos Activos</p>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En Mantenimiento</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inactivos</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DropletIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Caudal Total</p>
                    <p className="text-2xl font-bold text-gray-900">5,150 L/min</p>
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
                          Calidad
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
                            {getStatusBadge(well.status)}
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getQualityBadge(well.quality)}
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
                    <div className="flex items-center p-3 bg-red-50 border-l-4 border-red-400">
                      <AlertTriangleIcon className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          Pozo Oeste #5 - Fuera de servicio
                        </p>
                        <p className="text-sm text-red-700">
                          Requiere mantenimiento urgente
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-400">
                      <AlertTriangleIcon className="h-5 w-5 text-yellow-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">
                          Pozo Sur #3 - Mantenimiento programado
                        </p>
                        <p className="text-sm text-yellow-700">
                          Finaliza el 2024-01-25
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Próximos mantenimientos */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximos Mantenimientos</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Pozo Norte #1</p>
                        <p className="text-sm text-blue-700">Revisión trimestral</p>
                      </div>
                      <span className="text-sm text-blue-600 font-medium">15 Feb 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Pozo Central #2</p>
                        <p className="text-sm text-blue-700">Cambio de bomba</p>
                      </div>
                      <span className="text-sm text-blue-600 font-medium">28 Feb 2024</span>
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

