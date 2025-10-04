import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../supabaseClient';

export function RedirectIfNotAuth({ children }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      setIsAuthenticated(true);
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para manejar la redirección
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🔄 Redirigiendo a landing...');
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

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
