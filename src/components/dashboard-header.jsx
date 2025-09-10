import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { dashboardData, getAlertCount } from "../lib/dashboard-data"
import { useAuth } from "../contexts/AuthContext"

export function DashboardHeader() {
  const { user, logout } = useAuth()
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-foreground">{user?.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user?.role === 'admin' ? 'Administrador' : 'Operador'}</div>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="text-sm px-3 py-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
