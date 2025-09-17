import { Button } from "../components/ui/button"
import { useLocation, useNavigate } from "react-router"
import AquaNetLogoWhite from "./svg/AquaNetLogoWhite"
import AquaNetTextWhite from "./svg/AquaNetTextWhite"

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { id: "dashboard", label: "Dashboard Principal", path: "/dashboard", active: location.pathname === "/dashboard" },
    { id: "consumption", label: "Consumo", path: "/consumo", active: location.pathname === "/consumo" },
    { id: "balance", label: "Balance Hídrico", path: "/balance", active: location.pathname === "/balance" },
    { id: "wells", label: "Pozos", path: "/pozos", active: location.pathname === "/pozos" },
    { id: "add-data", label: "Agregar Datos", path: "/agregar-datos", active: location.pathname === "/agregar-datos" },
    { id: "predictions", label: "Predicciones", path: "/predicciones", active: location.pathname === "/predicciones" },
    { id: "alerts", label: "Alertas", path: "/alertas", active: location.pathname === "/alertas" },
  ]

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50">
      {/* Logo y nombre de la empresa */}
      <div className="p-2 border-b border-sidebar-border">
        <div className="flex items-center ">
          <div className="h-10 w-10  rounded-xl flex items-center justify-center shadow-lg">
            <AquaNetLogoWhite className="w-10 h-10" />
          </div>
          <div>
            <AquaNetTextWhite className="w-36 h-12 pt-3" />
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
