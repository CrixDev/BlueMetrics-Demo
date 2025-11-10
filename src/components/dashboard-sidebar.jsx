import { Button } from "../components/ui/button"
import { useLocation, useNavigate } from "react-router"
import { Mail, Recycle, PlusCircle, Flame } from "lucide-react"
import AquaNetLogoWhite from "./svg/AquaNetLogoWhite"
import { useState } from "react"
// import { useEffect } from "react"
// import { supabase } from "../supabaseClient"

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  // const [userRole, setUserRole] = useState(null)
  // TEMPORALMENTE DESACTIVADO - Todos tienen acceso de admin para pruebas
  const [userRole, setUserRole] = useState('admin')

  // useEffect(() => {
  //   const getUserRole = async () => {
  //     try {
  //       console.log('🔍 [Sidebar] Obteniendo rol del usuario...');
  //       const { data: { session } } = await supabase.auth.getSession()
        
  //       if (session?.user) {
  //         console.log('✅ [Sidebar] Sesión encontrada, consultando profiles...');
          
  //         // GET directo a profiles para obtener el rol
  //         const { data: profile, error } = await supabase
  //           .from('profiles')
  //           .select('role')
  //           .eq('id', session.user.id)
  //           .single()
          
  //         if (error) {
  //           console.error('❌ [Sidebar] Error al obtener rol:', error);
  //           setUserRole('user');
  //         } else {
  //           console.log('✅ [Sidebar] Rol obtenido:', profile?.role);
  //           setUserRole(profile?.role || 'user');
  //         }
  //       }
  //     } catch (error) {
  //       console.error('❌ [Sidebar] Error inesperado:', error)
  //       setUserRole('user')
  //     }
  //   }

  //   getUserRole()
  // }, [])

  const menuItems = [
    { id: "dashboard", label: "Dashboard Principal", path: "/dashboard", active: location.pathname === "/dashboard" },
    { id: "consumption", label: "Consumo Agua", path: "/consumo", active: location.pathname === "/consumo" },
    { id: "balance", label: "Balance Hídrico", path: "/balance", active: location.pathname === "/balance" },
    { id: "wells", label: "Pozos", path: "/pozos", active: location.pathname === "/pozos" },
    { id: "ptar", label: "PTAR", path: "/ptar", active: location.pathname === "/ptar", icon: Recycle },
    { id: "add-data", label: "Agregar Datos", path: "/agregar-datos", active: location.pathname === "/agregar-datos" },
    { id: "add-readings", label: "Agregar Lecturas Agua", path: "/agregar-lecturas", active: location.pathname === "/agregar-lecturas", icon: PlusCircle },
    { id: "gas-consumption", label: "Consumo Gas", path: "/consumo-gas", active: location.pathname === "/consumo-gas", icon: Flame },
    { id: "add-gas-readings", label: "Agregar Lecturas Gas", path: "/agregar-lecturas-gas", active: location.pathname === "/agregar-lecturas-gas", icon: Flame },
    { id: "predictions", label: "Predicciones", path: "/predicciones", active: location.pathname === "/predicciones" },
    { id: "alerts", label: "Alertas", path: "/alertas", active: location.pathname === "/alertas" },
  ]

  // SOLO agregar Correos si el rol es admin
  const allMenuItems = userRole === 'admin' 
    ? [...menuItems, { id: "correos", label: "Correos", path: "/correos", active: location.pathname === "/correos", icon: Mail }]
    : menuItems

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50">
      {/* Logo de la empresa */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg">
            <AquaNetLogoWhite className="w-12 h-12" />
          </div>
        </div>
      </div>

      {/* Menú de navegación */}
      <div className="p-4">
        <nav className="space-y-2">
          {allMenuItems.map((item) => (
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
              {item.icon && <item.icon className="w-4 h-4 mr-2" />}
              {item.label}
              {item.id === "correos" && (
                <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
