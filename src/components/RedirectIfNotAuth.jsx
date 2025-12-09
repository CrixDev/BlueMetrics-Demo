import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../supabaseClient';

export function RedirectIfNotAuth({ children }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error al verificar sesión:', error);
        setIsAuthenticated(false);
        return;
      }

      if (!session) {
        console.log('⚠️ No hay sesión activa');
        setIsAuthenticated(false);
        return;
      }

      console.log('✅ Sesión activa:', session.user.email);

      // Obtener el rol del usuario
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('❌ Error al obtener rol:', profileError);
        setUserRole('user');
      } else {
        console.log('✅ Rol del usuario:', profile?.role);
        setUserRole(profile?.role || 'user');
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para manejar la redirección según el rol
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🔄 Redirigiendo a landing...');
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Efecto para redirigir según el rol cuando está autenticado
  useEffect(() => {
    if (!isLoading && isAuthenticated && userRole) {
      const currentPath = window.location.pathname;
      
      // Si el usuario tiene rol "datos", redirigir siempre a lecturas semanales
      // excepto si ya está en una página de datos permitida
      if (userRole === 'datos') {
        const allowedPaths = [
          '/agregar-lecturas',
          '/editar-lecturas',
          '/agregar-datos',
          '/agregar-lecturas-diarias',
          '/agregar-lecturas-gas',
          '/agregar-lecturas-ptar',
          '/excel-to-sql',
          '/excel-to-sql/agua/2023',
          '/excel-to-sql/agua/2024',
          '/excel-to-sql/agua/2025',
          '/excel-to-sql/gas/2023',
          '/excel-to-sql/gas/2024',
          '/excel-to-sql/gas/2025',
          '/excel-to-sql/ptar',
          '/csv-to-sql-daily'
        ];
        
        if (!allowedPaths.includes(currentPath)) {
          console.log('🔄 Redirigiendo usuario con rol "datos" a lecturas semanales...');
          navigate('/agregar-lecturas', { replace: true });
        }
      }
    }
  }, [isLoading, isAuthenticated, userRole, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // La redirección ya se habrá realizado en checkAuth
  }

  return children;
}
