import { Button } from "../components/ui/button"
import { useLocation, useNavigate } from "react-router"
import { 
  Mail, Recycle, PlusCircle, Flame, LayoutDashboard, 
  Droplets, Scale, Drill, Database, FileInput, 
  TrendingUp, Bell, ChevronDown, ChevronRight, BarChart3 
} from "lucide-react"
import { useState } from "react"
// import { useEffect } from "react"
// import { supabase } from "../supabaseClient"

export function DashboardSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  // const [userRole, setUserRole] = useState(null)
  // TEMPORALMENTE DESACTIVADO - Todos tienen acceso de admin para pruebas
  const [userRole, setUserRole] = useState('admin')
  
  // Estado para secciones colapsables
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    water: true,
    gas: true,
    data: true,
    analysis: true,
    admin: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

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

  // Estructura de menú organizada por secciones
  const menuSections = [
    {
      id: 'general',
      label: 'General',
      items: [
        { id: "dashboard", label: "Dashboard Principal", path: "/dashboard", icon: LayoutDashboard }
      ]
    },
    {
      id: 'water',
      label: 'Gestión Hídrica',
      items: [
        { id: "consumption", label: "Consumo Agua", path: "/consumo", icon: Droplets },
        { id: "balance", label: "Balance Hídrico", path: "/balance", icon: Scale },
        { id: "wells", label: "Pozos", path: "/pozos", icon: Drill },
        { id: "ptar", label: "PTAR", path: "/ptar", icon: Recycle }
      ]
    },
    {
      id: 'gas',
      label: 'Gestión de Gas',
      items: [
        { id: "gas-consumption", label: "Consumo Gas", path: "/consumo-gas", icon: Flame },
        { id: "add-gas-readings", label: "Lecturas Gas", path: "/agregar-lecturas-gas", icon: PlusCircle }
      ]
    },
    {
      id: 'data',
      label: 'Administración de Datos',
      items: [
        { id: "add-data", label: "Agregar Datos", path: "/agregar-datos", icon: Database },
        { id: "add-readings", label: "Lecturas Agua", path: "/agregar-lecturas", icon: FileInput }
      ]
    },
    {
      id: 'analysis',
      label: 'Análisis',
      items: [
        { id: "analysis-section", label: "Centro de Análisis", path: "/analisis", icon: BarChart3 },
        { id: "predictions", label: "Predicciones", path: "/predicciones", icon: TrendingUp },
        { id: "alerts", label: "Alertas", path: "/alertas", icon: Bell }
      ]
    }
  ]

  // Agregar sección de administración solo para admins
  if (userRole === 'admin') {
    menuSections.push({
      id: 'admin',
      label: 'Administración',
      items: [
        { id: "correos", label: "Correos", path: "/correos", icon: Mail, badge: "Admin" }
      ]
    })
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50">
      {/* Logo de la empresa */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-sidebar-foreground tracking-wide">
            BlueMetrics
          </h1>
        </div>
      </div>

      {/* Menú de navegación */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide">
        <nav className="space-y-4">
          {menuSections.map((section) => (
            <div key={section.id} className="space-y-1">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors uppercase tracking-wider"
              >
                <span>{section.label}</span>
                {expandedSections[section.id] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Section Items */}
              {expandedSections[section.id] && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={`w-full justify-start ${
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                        onClick={() => handleNavigation(item.path)}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
