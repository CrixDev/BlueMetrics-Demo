import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook personalizado para obtener el rol del usuario desde la tabla profiles
 * 
 * IMPORTANTE: Este hook hace una consulta directa a la tabla 'profiles'
 * NO confundir con auth.users que solo maneja autenticación
 * 
 * @returns {Object} { role, isLoading, error }
 */
export const useUserRole = () => {
  const { user, isAuthenticated } = useAuth();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isAuthenticated || !user?.id) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 [useUserRole] Consultando rol desde tabla profiles...');
        
        // GET directo a la tabla profiles (NO auth.users)
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) {
          console.error('❌ [useUserRole] Error al obtener rol:', fetchError);
          setError(fetchError);
          setRole('user'); // Rol por defecto en caso de error
        } else if (data) {
          console.log('✅ [useUserRole] Rol obtenido:', data.role);
          setRole(data.role || 'user');
        } else {
          console.log('⚠️ [useUserRole] No se encontró perfil, usando rol user');
          setRole('user');
        }
      } catch (err) {
        console.error('❌ [useUserRole] Error inesperado:', err);
        setError(err);
        setRole('user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user, isAuthenticated]);

  return { role, isLoading, error, isAdmin: role === 'admin' };
};
