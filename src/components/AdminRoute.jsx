import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router';
import { supabase } from '../supabaseClient';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        console.log('🔍 [AdminRoute] Verificando rol del usuario...');
        
        // Obtener la sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('❌ [AdminRoute] No hay sesión activa');
          setIsLoadingRole(false);
          return;
        }

        console.log('✅ [AdminRoute] Sesión encontrada, consultando tabla profiles...');
        console.log('   🆔 User ID:', session.user.id);
        
        // GET directo a la tabla profiles
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('❌ [AdminRoute] Error al consultar profiles:', error);
          setUserRole('user'); // Si hay error, asignar rol 'user' por defecto
        } else if (profile) {
          console.log('✅ [AdminRoute] Perfil obtenido de tabla profiles:');
          console.log('   🎭 ROL:', profile.role);
          setUserRole(profile.role || 'user');
        } else {
          console.log('⚠️ [AdminRoute] No se encontró perfil, asignando rol user');
          setUserRole('user');
        }
      } catch (error) {
        console.error('❌ [AdminRoute] Error inesperado:', error);
        setUserRole('user');
      } finally {
        setIsLoadingRole(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      checkUserRole();
    } else if (!authLoading && !isAuthenticated) {
      setIsLoadingRole(false);
    }
  }, [isAuthenticated, authLoading]);

  // Mostrar loading mientras se verifica
  if (authLoading || isLoadingRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('⚠️ [AdminRoute] Usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Si no es admin, mostrar acceso denegado
  if (userRole !== 'admin') {
    console.log('❌ [AdminRoute] Acceso denegado. Rol actual:', userRole);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-2">
            Esta página es solo para administradores.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Tu rol actual es: <strong className="text-gray-900">{userRole || 'usuario'}</strong>
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Si es admin, mostrar el contenido
  console.log('✅ [AdminRoute] Acceso permitido. Usuario es admin.');
  return children;
};

export default AdminRoute;
