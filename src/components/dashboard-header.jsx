import { Badge } from "../components/ui/badge"
import { dashboardData, getAlertCount } from "../lib/dashboard-data"

export function DashboardHeader() {
  const criticalAlerts = getAlertCount("critical")
  const warningAlerts = getAlertCount("warning")

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-6">
          {/* Mensaje de bienvenida */}
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Bienvenido al Panel de Control</h1>
            <p className="text-sm text-muted-foreground font-medium">Monitoreo y gestión en tiempo real</p>
          </div>
          
          {/* Alertas */}
          <div className="flex items-center gap-3">
            {criticalAlerts > 0 && (
              <Badge variant="destructive" className="text-xs px-3 py-1 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                {criticalAlerts} Crítica{criticalAlerts > 1 ? "s" : ""}
              </Badge>
            )}
            {warningAlerts > 0 && (
              <Badge className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 border-amber-200 shadow-sm">
                <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                {warningAlerts} Advertencia{warningAlerts > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Estado del sistema y eficiencia */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground font-medium">Estado del Sistema</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">Operativo</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-sm text-muted-foreground">Administrador</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>

          </div>
        </div>
      </div>
    </header>
  )
}
