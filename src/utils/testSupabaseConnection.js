import { supabase } from '../supabaseClient';

/**
 * Función de diagnóstico para verificar la conexión con Supabase
 * Ejecuta en la consola del navegador: testSupabaseConnection()
 */
export async function testSupabaseConnection() {
  console.log('🔍 === DIAGNÓSTICO DE CONEXIÓN SUPABASE ===');
  
  try {
    // 1. Verificar que el cliente está configurado
    console.log('1️⃣ Verificando cliente Supabase...');
    if (!supabase) {
      console.error('❌ Cliente Supabase no está configurado');
      return;
    }
    console.log('✅ Cliente Supabase configurado');
    
    // 2. Verificar sesión actual
    console.log('\n2️⃣ Verificando sesión actual...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error al obtener sesión:', sessionError);
      return;
    }
    
    if (!session) {
      console.log('ℹ️ No hay sesión activa (esto es normal si no has iniciado sesión)');
    } else {
      console.log('✅ Sesión activa encontrada:');
      console.log('   📧 Email:', session.user.email);
      console.log('   🆔 ID:', session.user.id);
      
      // 3. Verificar acceso a tabla profiles
      console.log('\n3️⃣ Verificando acceso a tabla profiles...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('❌ Error al consultar profiles:', profileError);
        console.log('   Código:', profileError.code);
        console.log('   Mensaje:', profileError.message);
        console.log('   💡 Esto puede ser un problema de RLS (Row Level Security)');
      } else if (profile) {
        console.log('✅ Perfil obtenido correctamente:');
        console.log('   👤 Username:', profile.username);
        console.log('   📛 Nombre:', profile.full_name);
        console.log('   🏢 Empresa:', profile.company);
        console.log('   🎭 ROL:', profile.role);
      } else {
        console.log('⚠️ No se encontró perfil para este usuario');
        console.log('   💡 Puede que necesites crear el perfil manualmente');
      }
    }
    
    // 4. Probar consulta simple a profiles (sin filtro)
    console.log('\n4️⃣ Probando consulta general a profiles...');
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(1);
    
    if (allError) {
      console.error('❌ Error en consulta general:', allError);
    } else {
      console.log('✅ Consulta general exitosa, profiles encontrados:', allProfiles?.length || 0);
    }
    
    console.log('\n✅ === DIAGNÓSTICO COMPLETADO ===');
    
  } catch (error) {
    console.error('❌ Error inesperado en diagnóstico:', error);
  }
}

// Hacer disponible globalmente para uso en consola
if (typeof window !== 'undefined') {
  window.testSupabaseConnection = testSupabaseConnection;
}
