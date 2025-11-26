import { useAuth } from '../contexts/AuthContext';

/**
 * Componente para renderizar contenido basado en el rol del usuario
 * 
 * Ejemplo de uso:
 * 
 * <RoleBasedAccess allowedRoles={['admin']}>
 *   <AdminPanel />
 * </RoleBasedAccess>
 * 
 * <RoleBasedAccess allowedRoles={['admin', 'user']}>
 *   <Dashboard />
 * </RoleBasedAccess>
 */
const RoleBasedAccess = ({ allowedRoles = [], children, fallback = null }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada
  if (!isAuthenticated) {
    return fallback;
  }

  // Verificar si el rol del usuario está en la lista de roles permitidos
  // IMPORTANTE: user.role viene de la tabla profiles, no de auth.users
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    console.log(`⚠️ [RoleBasedAccess] Acceso denegado. Rol requerido: ${allowedRoles.join(', ')}, Rol actual: ${user.role}`);
    return fallback;
  }

  console.log(`✅ [RoleBasedAccess] Acceso permitido. Rol: ${user.role}`);
  return children;
};

export default RoleBasedAccess;

/**
 * Hook personalizado para verificar roles
 * 
 * Ejemplo:
 * const { hasRole, isAdmin } = useRoleCheck();
 * 
 * if (isAdmin) {
 *   // Mostrar opciones de admin
 * }
 */
export const useRoleCheck = () => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role) => {
    if (!isAuthenticated || !user) return false;
    // user.role viene de profiles, no de auth.users
    return user.role === role;
  };

  const hasAnyRole = (roles = []) => {
    if (!isAuthenticated || !user) return false;
    return roles.includes(user.role);
  };

  return {
    hasRole,
    hasAnyRole,
    isAdmin: hasRole('admin'),
    isUser: hasRole('user'),
    currentRole: user?.role || null
  };
};
