import { Button } from "../components/ui/button"
import { useLocation, useNavigate } from "react-router"

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { id: "dashboard", label: "Dashboard Principal", path: "/", active: location.pathname === "/" },
    { id: "consumption", label: "Consumo", path: "/consumo", active: false },
    { id: "wells", label: "Pozos", path: "/pozos", active: location.pathname === "/pozos" },
    { id: "balance", label: "Balance Hídrico", path: "/balance", active: false },
    { id: "predictions", label: "Predicciones", path: "/predicciones", active: false },
    { id: "alerts", label: "Alertas", path: "/alertas", active: false },
  ]

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50">
      {/* Logo y nombre de la empresa */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">AquaNet</h1>
            <p className="text-xs text-sidebar-foreground/70 font-medium">Sistema Hídrico Inteligente</p>
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start ${
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
