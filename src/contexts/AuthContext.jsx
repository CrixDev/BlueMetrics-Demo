import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initializingRef = useRef(false); // Prevenir inicializaciones duplicadas
  const initialCheckDone = useRef(false); // Marcar cuando initAuth termina

  useEffect(() => {
    const initAuth = async () => {
      // Prevenir ejecuciones duplicadas
      if (initializingRef.current) {
        console.log('⏭️ [AuthContext] Ya se está inicializando, saltando...');
        return;
      }
      
      initializingRef.current = true;
      
      try {
        console.log('🔍 [AuthContext] Iniciando verificación de sesión...');
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ [AuthContext] Error al obtener sesión:', sessionError);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('✅ [AuthContext] Sesión encontrada');
          console.log('   📧 Email:', session.user.email);
          console.log('   🆔 ID:', session.user.id);
          
          // IMPORTANTE: Consultar la tabla PROFILES (no auth.users)
          console.log('🔍 [AuthContext] Consultando tabla profiles...');
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle(); // Usar maybeSingle en lugar de single para evitar errores si no existe

          if (profileError) {
            console.error('❌ [AuthContext] Error al obtener perfil de tabla profiles:');
            console.error('   Código:', profileError.code);
            console.error('   Mensaje:', profileError.message);
            console.error('   Detalles:', profileError.details);
            console.log('⚠️ [AuthContext] Usando datos básicos de auth.users');
          } else if (profile) {
            console.log('✅ [AuthContext] Perfil obtenido de tabla profiles:');
            console.log('   👤 Username:', profile.username);
            console.log('   📛 Nombre:', profile.full_name);
            console.log('   🏢 Empresa:', profile.company);
            console.log('   🎭 ROL:', profile.role, '<-- ESTE ES EL DATO IMPORTANTE');
          } else {
            console.log('⚠️ [AuthContext] No se encontró perfil, creando uno básico...');
          }

          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: profile?.full_name || session.user.user_metadata?.full_name || 'Usuario',
            username: profile?.username || session.user.email.split('@')[0],
            company: profile?.company || 'Sin empresa',
            role: profile?.role || 'user', // ⬅️ ROL viene de la tabla PROFILES
            avatar_url: profile?.avatar_url,
            loginTime: new Date().toISOString()
          };
          
          console.log('👤 [AuthContext] Usuario final configurado:');
          console.log('   Rol asignado:', userData.role);
          console.log('   Es admin?', userData.role === 'admin');
          
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log('ℹ️ [AuthContext] No hay sesión activa');
        }
      } catch (error) {
        console.error('❌ [AuthContext] Error inesperado:', error);
      } finally {
        console.log('✅ [AuthContext] Verificación completada, isLoading = false');
        setIsLoading(false);
        initialCheckDone.current = true; // Marcar que initAuth terminó
      }
    };

    initAuth();

    // Escuchar SOLO cambios de autenticación (no INITIAL_SESSION)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AuthContext] Evento de autenticación:', event);
      
      // Ignorar INITIAL_SESSION siempre
      if (event === 'INITIAL_SESSION') {
        console.log('⏭️ [AuthContext] Ignorando INITIAL_SESSION (ya manejado por initAuth)');
        return;
      }
      
      // Ignorar SIGNED_IN solo si initAuth aún no termina (para evitar duplicados)
      if (event === 'SIGNED_IN' && !initialCheckDone.current) {
        console.log('⏭️ [AuthContext] Ignorando SIGNED_IN inicial (initAuth en progreso)');
        return;
      }
      
      // Procesar SIGNED_IN después de que initAuth terminó (login manual)
      if (event === 'SIGNED_IN' && session?.user && initialCheckDone.current) {
        console.log('✅ [AuthContext] Procesando login manual');
        console.log('   📧 Email:', session.user.email);
        
        // Consultar perfil desde la tabla PROFILES
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: profile?.full_name || session.user.user_metadata?.full_name || 'Usuario',
          username: profile?.username || session.user.email.split('@')[0],
          company: profile?.company || 'Sin empresa',
          role: profile?.role || 'user',
          avatar_url: profile?.avatar_url,
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        return;
      }
      
      // Solo procesar SIGNED_OUT y TOKEN_REFRESHED
      if (event === 'SIGNED_OUT') {
        console.log('🚪 [AuthContext] Usuario cerró sesión');
        setUser(null);
        setIsAuthenticated(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 [AuthContext] Token actualizado (manteniendo usuario actual)');
        // No hacer nada, el usuario ya está configurado
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Función de login
  const login = async (email, password) => {
    try {
      console.log('🔐 [Login] Intentando iniciar sesión:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ [Login] Error de autenticación:', error);
        throw error;
      }

      if (data?.user) {
        console.log('✅ [Login] Autenticación exitosa');
        console.log('🔍 [Login] Obteniendo perfil de tabla profiles...');
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('❌ [Login] Error al obtener perfil:', profileError);
        } else {
          console.log('✅ [Login] Perfil obtenido:');
          console.log('   🎭 ROL:', profile.role);
        }

        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: profile?.full_name || data.user.user_metadata?.full_name || 'Usuario',
          username: profile?.username || data.user.email.split('@')[0],
          company: profile?.company || 'Sin empresa',
          role: profile?.role || 'user',
          avatar_url: profile?.avatar_url,
          loginTime: new Date().toISOString()
        };
        
        console.log('👤 [Login] Usuario configurado con rol:', userData.role);
        
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true, message: 'Login exitoso' };
      }
    } catch (error) {
      console.error('❌ [Login] Error completo:', error);
      return { success: false, message: error.message || 'Error en el sistema' };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      console.log('🚪 [Logout] Cerrando sesión...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('✅ [Logout] Sesión cerrada');
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ [Logout] Error al cerrar sesión:', error);
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};