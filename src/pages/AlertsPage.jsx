import { useState } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  X, 
  Bell, 
  MapPin, 
  Clock, 
  Activity,
  Filter,
  Search,
  Eye,
  Settings,
  Archive,
  Zap
} from "lucide-react"

// Datos fake de alertas más extensos
const alertsData = [
  {
    id: 1,
    type: "critical",
    title: "Límite Diario Excedido",
    message: "El Pozo 11 superó el límite diario permitido en 15%",
    timestamp: "Hace 5 min",
    action: "Reducir flujo",
    status: "active",
    location: "Sector Norte",
    affectedSystems: ["Riego", "Torres de enfriamiento"],
    priority: "alta",
    estimatedImpact: "Alto",
    responsibleTeam: "Operaciones",
    category: "consumo"
  },
  {
    id: 2,
    type: "warning",
    title: "Posible Fuga Detectada",
    message: "Pozo 7 muestra patrones anómalos de consumo",
    timestamp: "Hace 12 min",
    action: "Inspeccionar",
    status: "active",
    location: "Sector Centro",
    affectedSystems: ["Distribución principal"],
    priority: "media",
    estimatedImpact: "Medio",
    responsibleTeam: "Mantenimiento",
    category: "fuga"
  },
  {
    id: 3,
    type: "info",
    title: "Mantenimiento Programado",
    message: "Torre de enfriamiento 3 requiere mantenimiento en 2 días",
    timestamp: "Hace 1 hora",
    action: "Programar",
    status: "pending",
    location: "Edificio Industrial",
    affectedSystems: ["Climatización"],
    priority: "baja",
    estimatedImpact: "Bajo",
    responsibleTeam: "Mantenimiento",
    category: "mantenimiento"
  },
  {
    id: 4,
    type: "critical",
    title: "Presión Baja Sistema Principal",
    message: "Presión en línea principal descendió a 2.1 bar (mín: 2.5 bar)",
    timestamp: "Hace 8 min",
    action: "Activar bomba de respaldo",
    status: "active",
    location: "Red principal",
    affectedSystems: ["Distribución", "Torres", "Riego"],
    priority: "alta",
    estimatedImpact: "Crítico",
    responsibleTeam: "Operaciones",
    category: "presion"
  },
  {
    id: 5,
    type: "warning",
    title: "Calidad del Agua Comprometida",
    message: "Niveles de cloro residual por debajo del mínimo en Pozo 3",
    timestamp: "Hace 25 min",
    action: "Ajustar dosificación",
    status: "active",
    location: "Sector Sur",
    affectedSystems: ["Agua potable"],
    priority: "alta",
    estimatedImpact: "Alto",
    responsibleTeam: "Calidad",
    category: "calidad"
  },
  {
    id: 6,
    type: "success",
    title: "Eficiencia Meta Alcanzada",
    message: "Sistema superó meta mensual de eficiencia (96% vs 90%)",
    timestamp: "Hace 2 horas",
    action: "Ver reporte",
    status: "resolved",
    location: "Sistema completo",
    affectedSystems: ["Todos"],
    priority: "baja",
    estimatedImpact: "Positivo",
    responsibleTeam: "Operaciones",
    category: "eficiencia"
  },
  {
    id: 7,
    type: "warning",
    title: "Nivel Tanque de Reserva Bajo",
    message: "Tanque de reserva Norte al 25% de capacidad",
    timestamp: "Hace 1h 15min",
    action: "Activar llenado",
    status: "acknowledged",
    location: "Sector Norte",
    affectedSystems: ["Almacenamiento", "Reserva"],
    priority: "media",
    estimatedImpact: "Medio",
    responsibleTeam: "Operaciones",
    category: "almacenamiento"
  },
  {
    id: 8,
    type: "critical",
    title: "Falla de Sensor Primario",
    message: "Sensor de caudal principal sin señal desde hace 30 minutos",
    timestamp: "Hace 30 min",
    action: "Verificar conexiones",
    status: "active",
    location: "Pozo 8",
    affectedSystems: ["Monitoreo", "Control automático"],
    priority: "alta",
    estimatedImpact: "Alto",
    responsibleTeam: "Técnico",
    category: "sensor"
  },
  {
    id: 9,
    type: "info",
    title: "Optimización Energética Disponible",
    message: "Se detectó oportunidad de ahorro del 8% en horario nocturno",
    timestamp: "Hace 45 min",
    action: "Implementar programa",
    status: "pending",
    location: "Sistema completo",
    affectedSystems: ["Bombeo", "Distribución"],
    priority: "baja",
    estimatedImpact: "Positivo",
    responsibleTeam: "Eficiencia",
    category: "optimizacion"
  },
  {
    id: 10,
    type: "warning",
    title: "Temperatura Agua Elevada",
    message: "Temperatura en Pozo 5 superior a 28°C (límite: 25°C)",
    timestamp: "Hace 1h 30min",
    action: "Revisar sistema de enfriamiento",
    status: "active",
    location: "Sector Este",
    affectedSystems: ["Refrigeración"],
    priority: "media",
    estimatedImpact: "Medio",
    responsibleTeam: "Mantenimiento",
    category: "temperatura"
  }
]

function getAlertIcon(type) {
  switch (type) {
    case "critical":
      return <AlertTriangle className="w-4 h-4" />
    case "warning":
      return <AlertCircle className="w-4 h-4" />
    case "info":
      return <Info className="w-4 h-4" />
    case "success":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <Bell className="w-4 h-4" />
  }
}

function getAlertColor(type) {
  switch (type) {
    case "critical":
      return "text-red-600 bg-red-50 border-red-200"
    case "warning":
      return "text-orange-600 bg-orange-50 border-orange-200"
    case "info":
      return "text-blue-600 bg-blue-50 border-blue-200"
    case "success":
      return "text-green-600 bg-green-50 border-green-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

function getPriorityBadge(priority) {
  const colors = {
    alta: "bg-red-100 text-red-800",
    media: "bg-yellow-100 text-yellow-800",
    baja: "bg-blue-100 text-blue-800"
  }
  return colors[priority] || "bg-gray-100 text-gray-800"
}

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedAlert, setSelectedAlert] = useState(null)

  // Filtrar alertas
  const filteredAlerts = alertsData.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === "all" || alert.type === filterType
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    const matchesPriority = filterPriority === "all" || alert.priority === filterPriority
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  // Estadísticas de alertas
  const alertStats = {
    total: alertsData.length,
    active: alertsData.filter(a => a.status === "active").length,
    critical: alertsData.filter(a => a.type === "critical").length,
    resolved: alertsData.filter(a => a.status === "resolved").length
  }

  const handleResolveAlert = (alertId) => {
    console.log("Resolviendo alerta:", alertId)
    // Aquí iría la lógica para resolver la alerta
  }

  const handleAcknowledgeAlert = (alertId) => {
    console.log("Reconociendo alerta:", alertId)
    // Aquí iría la lógica para reconocer la alerta
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Centro de Alertas</h1>
                <p className="text-muted-foreground">
                  Monitoreo y gestión de alertas del sistema
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="w-4 h-4 mr-2" />
                  Historial
                </Button>
              </div>
            </div>

            {/* Estadísticas de alertas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{alertStats.total}</div>
                      <div className="text-sm text-muted-foreground">Total Alertas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Activity className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{alertStats.active}</div>
                      <div className="text-sm text-muted-foreground">Activas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{alertStats.critical}</div>
                      <div className="text-sm text-muted-foreground">Críticas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{alertStats.resolved}</div>
                      <div className="text-sm text-muted-foreground">Resueltas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros y búsqueda */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar alertas..."
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <select 
                    className="px-3 py-2 border border-border rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="critical">Críticas</option>
                    <option value="warning">Advertencias</option>
                    <option value="info">Información</option>
                    <option value="success">Exitosas</option>
                  </select>

                  <select 
                    className="px-3 py-2 border border-border rounded-md"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activas</option>
                    <option value="acknowledged">Reconocidas</option>
                    <option value="resolved">Resueltas</option>
                    <option value="pending">Pendientes</option>
                  </select>

                  <select 
                    className="px-3 py-2 border border-border rounded-md"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="all">Todas las prioridades</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de alertas */}
          <div className="grid gap-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`border ${getAlertColor(alert.type)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{alert.title}</h3>
                          <Badge className={getPriorityBadge(alert.priority)}>
                            {alert.priority}
                          </Badge>
                          <Badge variant={alert.status === "active" ? "destructive" : 
                                         alert.status === "resolved" ? "default" : "secondary"}>
                            {alert.status}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{alert.message}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{alert.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            <span>Impacto: {alert.estimatedImpact}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {alert.affectedSystems.map((system) => (
                            <Badge key={system} variant="outline" className="text-xs">
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {alert.status === "active" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAcknowledgeAlert(alert.id)}
                          >
                            Reconocer
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            Resolver
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay alertas</h3>
                <p className="text-muted-foreground">
                  No se encontraron alertas que coincidan con los filtros seleccionados.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
