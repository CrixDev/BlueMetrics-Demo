# 📚 Ejemplos Prácticos de Uso del Sistema de Autenticación

## 🎯 Índice
1. [Obtener datos del usuario actual](#1-obtener-datos-del-usuario-actual)
2. [Verificar si es administrador](#2-verificar-si-es-administrador)
3. [Mostrar contenido según rol](#3-mostrar-contenido-según-rol)
4. [Consultar datos de profiles](#4-consultar-datos-de-profiles)
5. [Actualizar perfil de usuario](#5-actualizar-perfil-de-usuario)
6. [Crear nuevo usuario con rol](#6-crear-nuevo-usuario-con-rol)

---

## 1. Obtener datos del usuario actual

### ✅ Forma Correcta
```javascript
import { useAuth } from '../contexts/AuthContext';

function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <div>Por favor inicia sesión</div>;
  }

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p>Email: {user.email}</p>
      <p>Nombre: {user.name}</p>
      <p>Usuario: {user.username}</p>
      <p>Empresa: {user.company}</p>
      <p>Rol: {user.role}</p> {/* ← Viene de profiles */}
    </div>
  );
}
```

### ❌ Forma Incorrecta
```javascript
// NO HACER ESTO
function UserProfile() {
  const { user } = useAuth();
  
  // ❌ INCORRECTO: Intentar obtener rol de auth.users
  const role = user.auth_role; // No existe
  
  // ❌ INCORRECTO: Consultar auth.users directamente
  const { data } = await supabase.auth.getUser();
  console.log(data.user.role); // Este no es tu rol personalizado
}
```

---

## 2. Verificar si es administrador

### ✅ Opción 1: Usando useAuth
```javascript
import { useAuth } from '../contexts/AuthContext';

function AdminButton() {
  const { user } = useAuth();
  
  // user.role viene de la tabla profiles
  const isAdmin = user?.role === 'admin';
  
  if (!isAdmin) {
    return null; // No mostrar el botón
  }
  
  return (
    <button onClick={handleAdminAction}>
      Acción de Administrador
    </button>
  );
}
```

### ✅ Opción 2: Usando useRoleCheck
```javascript
import { useRoleCheck } from '../components/RoleBasedAccess';

function AdminPanel() {
  const { isAdmin, currentRole } = useRoleCheck();
  
  console.log('Rol actual:', currentRole); // 'admin' o 'user'
  
  if (!isAdmin) {
    return <div>No tienes permisos de administrador</div>;
  }
  
  return (
    <div>
      <h2>Panel de Administrador</h2>
      {/* Contenido solo para admins */}
    </div>
  );
}
```

### ✅ Opción 3: Usando RoleBasedAccess
```javascript
import RoleBasedAccess from '../components/RoleBasedAccess';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Contenido visible para todos los usuarios autenticados */}
      <UserStats />
      
      {/* Contenido solo para administradores */}
      <RoleBasedAccess allowedRoles={['admin']}>
        <AdminControls />
        <UserManagement />
      </RoleBasedAccess>
      
      {/* Contenido para admin y user */}
      <RoleBasedAccess allowedRoles={['admin', 'user']}>
        <Reports />
      </RoleBasedAccess>
    </div>
  );
}
```

---

## 3. Mostrar contenido según rol

### ✅ Ejemplo: Menú con opciones según rol
```javascript
import { useAuth } from '../contexts/AuthContext';

function Sidebar() {
  const { user } = useAuth();
  
  // user.role viene de profiles
  const isAdmin = user?.role === 'admin';
  
  return (
    <nav>
      <ul>
        {/* Opciones para todos */}
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/consumo">Consumo</a></li>
        <li><a href="/pozos">Pozos</a></li>
        
        {/* Opciones solo para administradores */}
        {isAdmin && (
          <>
            <li><a href="/agregar-datos">Agregar Datos</a></li>
            <li><a href="/correos">Correos</a></li>
            <li><a href="/excel-to-sql">Excel to SQL</a></li>
          </>
        )}
      </ul>
    </nav>
  );
}
```

### ✅ Ejemplo: Botones condicionales
```javascript
import { useRoleCheck } from '../components/RoleBasedAccess';

function DataTable() {
  const { isAdmin } = useRoleCheck();
  
  return (
    <div>
      <table>
        {/* Tabla de datos */}
      </table>
      
      {/* Botones de edición solo para admins */}
      {isAdmin && (
        <div className="actions">
          <button>Editar</button>
          <button>Eliminar</button>
          <button>Agregar</button>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Consultar datos de profiles

### ✅ Obtener perfil del usuario actual
```javascript
import { supabase } from '../supabaseClient';

async function getCurrentUserProfile() {
  // 1. Obtener sesión de auth.users
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log('No hay sesión activa');
    return null;
  }
  
  // 2. Consultar profiles con el ID del usuario
  const { data: profile, error } = await supabase
    .from('profiles') // ← Tabla profiles, NO auth.users
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (error) {
    console.error('Error al obtener perfil:', error);
    return null;
  }
  
  console.log('Perfil obtenido:', profile);
  console.log('Rol del usuario:', profile.role); // ← Aquí está el rol
  
  return profile;
}
```

### ✅ Obtener perfiles de todos los usuarios (solo admin)
```javascript
import { supabase } from '../supabaseClient';

async function getAllProfiles() {
  // Consultar tabla profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, username, full_name, company, role, created_at')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error:', error);
    return [];
  }
  
  console.log('Usuarios encontrados:', profiles.length);
  profiles.forEach(profile => {
    console.log(`- ${profile.email}: ${profile.role}`);
  });
  
  return profiles;
}
```

### ✅ Filtrar usuarios por rol
```javascript
import { supabase } from '../supabaseClient';

async function getAdminUsers() {
  const { data: admins, error } = await supabase
    .from('profiles') // ← profiles, no auth.users
    .select('*')
    .eq('role', 'admin'); // ← Filtrar por rol
  
  if (error) {
    console.error('Error:', error);
    return [];
  }
  
  console.log('Administradores:', admins);
  return admins;
}

async function getRegularUsers() {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'user');
  
  return users || [];
}
```

---

## 5. Actualizar perfil de usuario

### ✅ Actualizar datos del perfil actual
```javascript
import { supabase } from '../supabaseClient';

async function updateUserProfile(updates) {
  // 1. Obtener ID del usuario actual
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('No hay sesión activa');
  }
  
  // 2. Actualizar en la tabla profiles
  const { data, error } = await supabase
    .from('profiles') // ← profiles, no auth.users
    .update({
      full_name: updates.full_name,
      company: updates.company,
      username: updates.username,
      avatar_url: updates.avatar_url,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error al actualizar perfil:', error);
    throw error;
  }
  
  console.log('Perfil actualizado:', data);
  return data;
}

// Uso:
updateUserProfile({
  full_name: 'Nuevo Nombre',
  company: 'Nueva Empresa'
});
```

### ✅ Cambiar rol de un usuario (solo admin)
```javascript
import { supabase } from '../supabaseClient';

async function changeUserRole(userId, newRole) {
  // Verificar que el rol sea válido
  const validRoles = ['admin', 'user'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Rol inválido');
  }
  
  // Actualizar rol en profiles
  const { data, error } = await supabase
    .from('profiles') // ← profiles, no auth.users
    .update({ 
      role: newRole,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error al cambiar rol:', error);
    throw error;
  }
  
  console.log(`Rol actualizado a '${newRole}' para usuario:`, data.email);
  return data;
}

// Uso:
changeUserRole('user-id-aqui', 'admin');
```

---

## 6. Crear nuevo usuario con rol

### ✅ Registro de usuario con perfil
```javascript
import { supabase } from '../supabaseClient';

async function registerUser(email, password, profileData) {
  try {
    // 1. Crear usuario en auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: profileData.full_name
        }
      }
    });
    
    if (authError) throw authError;
    
    console.log('✅ Usuario creado en auth.users:', authData.user.id);
    
    // 2. Crear perfil en profiles (si no se crea automáticamente con trigger)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id, // ← Mismo ID que auth.users
        email: email,
        full_name: profileData.full_name,
        username: profileData.username,
        company: profileData.company,
        role: profileData.role || 'user', // ← Asignar rol
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('Error al crear perfil:', profileError);
      throw profileError;
    }
    
    console.log('✅ Perfil creado en profiles:', profile);
    console.log('   Rol asignado:', profile.role);
    
    return {
      user: authData.user,
      profile: profile
    };
    
  } catch (error) {
    console.error('❌ Error en registro:', error);
    throw error;
  }
}

// Uso:
registerUser(
  'nuevo@usuario.com',
  'password123',
  {
    full_name: 'Juan Pérez',
    username: 'juanp',
    company: 'Mi Empresa',
    role: 'user' // o 'admin'
  }
);
```

---

## 🔍 Debugging: Verificar datos

### Verificar sesión y perfil
```javascript
import { supabase } from '../supabaseClient';

async function debugAuthAndProfile() {
  console.log('=== DEBUG: Auth y Profile ===');
  
  // 1. Verificar sesión en auth.users
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log('❌ No hay sesión activa');
    return;
  }
  
  console.log('✅ Sesión activa:');
  console.log('   ID:', session.user.id);
  console.log('   Email:', session.user.email);
  console.log('   Metadata:', session.user.user_metadata);
  
  // 2. Verificar perfil en profiles
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (error) {
    console.error('❌ Error al obtener perfil:', error);
    return;
  }
  
  console.log('✅ Perfil encontrado:');
  console.log('   Username:', profile.username);
  console.log('   Nombre:', profile.full_name);
  console.log('   Empresa:', profile.company);
  console.log('   🎭 ROL:', profile.role); // ← IMPORTANTE
  console.log('   Creado:', profile.created_at);
  
  // 3. Verificar relación
  if (session.user.id === profile.id) {
    console.log('✅ Relación correcta: auth.users.id = profiles.id');
  } else {
    console.error('❌ ERROR: IDs no coinciden');
  }
}

// Ejecutar en consola del navegador
debugAuthAndProfile();
```

---

## 📊 Consultas SQL útiles

### Ver todos los usuarios con sus roles
```sql
SELECT 
  u.id,
  u.email,
  u.created_at as auth_created_at,
  u.last_sign_in_at,
  p.username,
  p.full_name,
  p.company,
  p.role,
  p.created_at as profile_created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

### Contar usuarios por rol
```sql
SELECT 
  role,
  COUNT(*) as total
FROM public.profiles
GROUP BY role;
```

### Encontrar usuarios sin perfil
```sql
SELECT 
  u.id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

---

## ⚠️ Errores Comunes y Soluciones

### Error 1: "Cannot read property 'role' of undefined"
```javascript
// ❌ PROBLEMA
const { user } = useAuth();
console.log(user.role); // Error si user es null

// ✅ SOLUCIÓN
const { user } = useAuth();
console.log(user?.role); // Usar optional chaining
// o
if (user) {
  console.log(user.role);
}
```

### Error 2: "Row Level Security policy violation"
```javascript
// Si obtienes este error al consultar profiles:

// 1. Verifica que estés autenticado
const { data: { session } } = await supabase.auth.getSession();
console.log('Sesión:', session);

// 2. Verifica las políticas RLS en Supabase Dashboard
// Debe existir una política que permita SELECT
```

### Error 3: "El rol no se actualiza"
```javascript
// Si cambias el rol en la BD pero no se refleja en la app:

// 1. Cierra sesión y vuelve a iniciar
await supabase.auth.signOut();

// 2. O refresca el perfil manualmente
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();
  
console.log('Rol actualizado:', profile.role);
```

---

## 🎯 Resumen de Buenas Prácticas

1. ✅ **Siempre consulta `profiles` para obtener el rol**
2. ✅ **Usa `useAuth()` para obtener el usuario actual**
3. ✅ **Verifica `isLoading` antes de acceder a `user`**
4. ✅ **Usa optional chaining (`user?.role`)**
5. ✅ **Consulta `auth.users` solo para autenticación**
6. ✅ **Consulta `profiles` para datos de perfil y rol**
7. ✅ **Mantén sincronizados los IDs entre ambas tablas**
8. ✅ **Verifica las políticas RLS en Supabase**

---

## 🚀 Próximos Pasos

1. Implementa estos ejemplos en tu aplicación
2. Prueba con diferentes roles
3. Verifica los logs en consola
4. Ajusta las políticas RLS según necesites
5. Crea roles adicionales si es necesario (ej: 'moderator', 'viewer')

**¿Dudas?** Revisa `GUIA_AUTENTICACION.md` para más detalles técnicos.
