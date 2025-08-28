import { Button } from "../components/ui/button"

export function DashboardSidebar() {
  const menuItems = [
    { id: "dashboard", label: "Dashboard Principal", active: true },
    { id: "consumption", label: "Consumo", active: false },
    { id: "wells", label: "Pozos", active: false },
    { id: "balance", label: "Balance Hídrico", active: false },
    { id: "predictions", label: "Predicciones", active: false },
    { id: "alerts", label: "Alertas", active: false },
  ]

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
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
