import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Bell } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "Límite Diario Excedido",
    message: "El Pozo 11 superó el límite diario permitido en 15%",
    timestamp: "Hace 5 min",
    action: "Reducir flujo",
    status: "active",
  },
  {
    id: 2,
    type: "warning",
    title: "Posible Fuga Detectada",
    message: "Pozo 7 muestra patrones anómalos de consumo",
    timestamp: "Hace 12 min",
    action: "Inspeccionar",
    status: "active",
  },
  {
    id: 3,
    type: "info",
    title: "Mantenimiento Programado",
    message: "Torre de enfriamiento 3 requiere mantenimiento en 2 días",
    timestamp: "Hace 1 hora",
    action: "Programar",
    status: "pending",
  },
  {
    id: 4,
    type: "success",
    title: "Eficiencia Mejorada",
    message: "Sistema alcanzó 98% de eficiencia este mes",
    timestamp: "Hace 2 horas",
    action: "Ver reporte",
    status: "resolved",
  },
]

const recommendations = [
  {
    id: 1,
    priority: "high",
    title: "Optimizar Riego Nocturno",
    description: "Activar sistema de riego entre 2:00-4:00 AM para reducir evaporación",
    impact: "Ahorro estimado: 12% consumo diario",
    action: "Programar",
  },
  {
    id: 2,
    priority: "medium",
    title: "Recirculación de Agua",
    description: "Conectar torre 5 al sistema de tratamiento para reciclar agua",
    impact: "Reducción: 8% consumo total",
    action: "Implementar",
  },
  {
    id: 3,
    priority: "low",
    title: "Calibración de Sensores",
    description: "Actualizar calibración de sensores en pozos 3, 7 y 11",
    impact: "Mejora precisión: +5%",
    action: "Calibrar",
  },
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
      return "text-destructive bg-destructive/10 border-destructive/20"
    case "warning":
      return "text-orange-600 bg-orange-50 border-orange-200"
    case "info":
      return "text-blue-600 bg-blue-50 border-blue-200"
    case "success":
      return "text-secondary bg-secondary/10 border-secondary/20"
    default:
      return "text-muted-foreground bg-muted border-border"
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case "high":
      return "destructive"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "outline"
  }
}

export function AlertsRecommendationsSystem() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Alerts Panel */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="font-semibold">Alertas del Sistema</span>
            </div>
            <Badge variant="secondary" className="bg-primary-foreground text-primary">
              {alerts.filter((a) => a.status === "active").length} Activas
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{alert.title}</div>
                      <div className="text-sm opacity-90 mb-2">{alert.message}</div>
                      <div className="text-xs opacity-70">{alert.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      {alert.action}
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-destructive">2</div>
                <div className="text-xs text-muted-foreground">Críticas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">1</div>
                <div className="text-xs text-muted-foreground">Advertencias</div>
              </div>
              <div>
                <div className="text-lg font-bold text-secondary">1</div>
                <div className="text-xs text-muted-foreground">Resueltas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Panel */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="font-semibold">Recomendaciones IA</span>
            </div>
            <Badge variant="secondary" className="bg-primary-foreground text-primary">
              94% Precisión
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                        {rec.priority.toUpperCase()}
                      </Badge>
                      <span className="font-medium text-sm">{rec.title}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{rec.description}</div>
                    <div className="text-xs text-secondary font-medium">{rec.impact}</div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs ml-4 bg-transparent">
                    {rec.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-secondary">12</div>
                <div className="text-xs text-muted-foreground">Implementadas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
