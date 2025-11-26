import { supabase } from '../supabaseClient';

/**
 * Función para limpiar completamente el caché de autenticación
 * Útil cuando hay problemas de sesión corrupta
 * 
 * Ejecuta en la consola del navegador: clearAuthCache()
 */
export async function clearAuthCache() {
  console.log('🧹 === LIMPIANDO CACHÉ DE AUTENTICACIÓN ===');
  
  try {
    // 1. Cerrar sesión en Supabase
    console.log('1️⃣ Cerrando sesión en Supabase...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Error al cerrar sesión:', error);
    } else {
      console.log('✅ Sesión cerrada en Supabase');
    }
    
    // 2. Limpiar localStorage
    console.log('\n2️⃣ Limpiando localStorage...');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log('   🗑️ Eliminado:', key);
    });
    
    if (keysToRemove.length === 0) {
      console.log('   ℹ️ No se encontraron claves de autenticación en localStorage');
    } else {
      console.log(`   ✅ ${keysToRemove.length} claves eliminadas`);
    }
    
    // 3. Limpiar sessionStorage
    console.log('\n3️⃣ Limpiando sessionStorage...');
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('supabase') || key.includes('auth'))) {
        sessionKeysToRemove.push(key);
      }
    }
    
    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
      console.log('   🗑️ Eliminado:', key);
    });
    
    if (sessionKeysToRemove.length === 0) {
      console.log('   ℹ️ No se encontraron claves de autenticación en sessionStorage');
    } else {
      console.log(`   ✅ ${sessionKeysToRemove.length} claves eliminadas`);
    }
    
    console.log('\n✅ === CACHÉ LIMPIADO COMPLETAMENTE ===');
    console.log('💡 Recarga la página para aplicar los cambios');
    console.log('   Ejecuta: location.reload()');
    
  } catch (error) {
    console.error('❌ Error al limpiar caché:', error);
  }
}

/**
 * Función para verificar qué hay en el almacenamiento
 */
export function inspectAuthStorage() {
  console.log('🔍 === INSPECCIONANDO ALMACENAMIENTO ===');
  
  console.log('\n📦 localStorage:');
  let localCount = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('auth'))) {
      const value = localStorage.getItem(key);
      console.log(`   ${key}:`, value?.substring(0, 100) + '...');
      localCount++;
    }
  }
  if (localCount === 0) {
    console.log('   ℹ️ No hay datos de autenticación');
  }
  
  console.log('\n📦 sessionStorage:');
  let sessionCount = 0;
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.includes('supabase') || key.includes('auth'))) {
      const value = sessionStorage.getItem(key);
      console.log(`   ${key}:`, value?.substring(0, 100) + '...');
      sessionCount++;
    }
  }
  if (sessionCount === 0) {
    console.log('   ℹ️ No hay datos de autenticación');
  }
  
  console.log('\n✅ === INSPECCIÓN COMPLETADA ===');
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.clearAuthCache = clearAuthCache;
  window.inspectAuthStorage = inspectAuthStorage;
}
