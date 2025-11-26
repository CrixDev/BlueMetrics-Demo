# 🔐 Guía de Autenticación y Control de Roles

## 📋 Diferencia entre `auth.users` y `public.profiles`

### `auth.users` (Schema: auth)
**Propósito**: Tabla de Supabase que maneja la **autenticación**
- ✅ Login/Logout
- ✅ Tokens de sesión
- ✅ Contraseñas encriptadas
- ✅ Confirmación de email
- ✅ Recuperación de contraseña
- ❌ **NO contiene información de perfil personalizada**

**Columnas principales**:
```
- id (uuid)
- email
- encrypted_password
- email_confirmed_at
- last_sign_in_at
- raw_user_meta_data (jsonb)
```

### `public.profiles` (Schema: public)
**Propósito**: Tabla personalizada que almacena **información del perfil**
- ✅ Datos del usuario (nombre, empresa, etc.)
- ✅ **ROL del usuario** (admin, user, etc.)
- ✅ Avatar, username
- ✅ Información adicional personalizada

**Columnas**:
```
- id (uuid) → FK a auth.users.id
- email
- username
- full_name
- company
- role ← IMPORTANTE: Control de acceso
- avatar_url
- created_at
- updated_at
```

### 🔗 Relación 1:1
```
auth.users.id (PK) ←→ public.profiles.id (PK, FK)
```

---

## 🎯 Flujo de Autenticación

### 1. Login
```javascript
// AuthContext.jsx - Función login()
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
// ↑ Esto consulta auth.users

// Luego obtenemos el perfil:
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', data.user.id)
  .single();
// ↑ Esto consulta public.profiles para obtener el ROL
```

### 2. Verificación de Sesión
```javascript
// Obtener sesión actual (auth.users)
const { data: { session } } = await supabase.auth.getSession();

// Obtener rol del usuario (public.profiles)
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', session.user.id)
  .single();
```

---

## 🛡️ Sistema de Control de Acceso

### Niveles de Acceso

#### 1. **Rutas Públicas** (sin autenticación)
```jsx
<Route path="/" element={<LandingPage />} />
<Route path="/login" element={<LoginPage />} />
```

#### 2. **Rutas Protegidas** (requieren login)
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```
- Verifica: `auth.users` tiene sesión activa
- Redirige a `/login` si no está autenticado

#### 3. **Rutas de Administrador** (requieren rol admin)
```jsx
<Route path="/correos" element={
  <AdminRoute>
    <CorreosPage />
  </AdminRoute>
} />
```
- Verifica: `auth.users` tiene sesión activa
- Verifica: `profiles.role === 'admin'`
- Muestra "Acceso Denegado" si no es admin

---

## 📦 Componentes de Autenticación

### `AuthContext.jsx`
**Responsabilidad**: Gestionar el estado de autenticación global
```javascript
// Proporciona:
- user (objeto con datos de auth.users + profiles)
- isAuthenticated (boolean)
- isLoading (boolean)
- login(email, password)
- logout()
```

**Proceso al hacer login**:
1. Autentica con `supabase.auth.signInWithPassword()` → consulta `auth.users`
2. Obtiene perfil con `.from('profiles').select()` → consulta `public.profiles`
3. Combina datos en un objeto `user` con el `role`

### `ProtectedRoute.jsx`
**Responsabilidad**: Proteger rutas que requieren autenticación
```javascript
// Verifica solo si hay sesión activa
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

### `AdminRoute.jsx`
**Responsabilidad**: Proteger rutas que requieren rol admin
```javascript
// 1. Verifica sesión (auth.users)
const { data: { session } } = await supabase.auth.getSession();

// 2. Consulta rol desde profiles
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', session.user.id)
  .single();

// 3. Verifica si es admin
if (profile.role !== 'admin') {
  return <AccessDenied />;
}
```

---

## 🎨 Hook Personalizado: `useUserRole`

```javascript
import { useUserRole } from '../hooks/useUserRole';

function MyComponent() {
  const { role, isAdmin, isLoading } = useUserRole();
  
  if (isLoading) return <Loading />;
  
  return (
    <div>
      <p>Tu rol: {role}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

**Características**:
- Consulta directa a `public.profiles`
- Retorna: `{ role, isAdmin, isLoading, error }`
- Se actualiza automáticamente con cambios de sesión

---

## ⚠️ Errores Comunes

### ❌ Error 1: Intentar obtener rol de `auth.users`
```javascript
// INCORRECTO
const { data: user } = await supabase.auth.getUser();
console.log(user.role); // ❌ No existe en auth.users
```

```javascript
// CORRECTO
const { data: { user } } = await supabase.auth.getUser();
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();
console.log(profile.role); // ✅ Correcto
```

### ❌ Error 2: Confundir `user.role` con `profile.role`
```javascript
// En auth.users existe un campo 'role' pero es para uso interno de Supabase
// NO es el rol personalizado de tu aplicación

// INCORRECTO
const { data: { session } } = await supabase.auth.getSession();
if (session.user.role === 'admin') { } // ❌ Campo incorrecto

// CORRECTO
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', session.user.id)
  .single();
if (profile.role === 'admin') { } // ✅ Correcto
```

### ❌ Error 3: No verificar RLS (Row Level Security)
Si obtienes error al consultar `profiles`, verifica que:
1. RLS está habilitado en la tabla
2. Tienes políticas que permiten SELECT
3. El usuario está autenticado

```sql
-- Política de ejemplo para permitir que usuarios lean su propio perfil
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);
```

---

## 🔍 Debugging

### Ver logs en consola
El sistema incluye logs detallados:
```
🔍 [AuthContext] Iniciando verificación de sesión...
✅ [AuthContext] Sesión encontrada
🔍 [AuthContext] Consultando tabla profiles...
✅ [AuthContext] Perfil obtenido de tabla profiles:
   🎭 ROL: admin
```

### Verificar en Supabase Dashboard
1. **Auth → Users**: Ver usuarios autenticados
2. **Table Editor → profiles**: Ver roles asignados
3. **SQL Editor**: Consultar directamente
```sql
SELECT 
  u.email,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
```

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────────────────────────┐
│                    FLUJO DE LOGIN                       │
└─────────────────────────────────────────────────────────┘

1. Usuario ingresa email/password
         ↓
2. supabase.auth.signInWithPassword()
         ↓
3. Consulta auth.users → ✅ Autenticación exitosa
         ↓
4. Obtener session.user.id
         ↓
5. Consultar profiles WHERE id = session.user.id
         ↓
6. Obtener profile.role
         ↓
7. Crear objeto user con:
   - Datos de auth.users (email, id)
   - Datos de profiles (role, full_name, company)
         ↓
8. Guardar en AuthContext
         ↓
9. Redirigir según rol:
   - admin → Acceso completo
   - user → Acceso limitado
```

---

## 🚀 Uso en Componentes

### Obtener usuario actual
```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <Login />;
  
  return (
    <div>
      <p>Hola, {user.name}</p>
      <p>Tu rol: {user.role}</p>
      <p>Empresa: {user.company}</p>
    </div>
  );
}
```

### Verificar si es admin
```javascript
import { useAuth } from '../contexts/AuthContext';

function AdminPanel() {
  const { user } = useAuth();
  
  if (user.role !== 'admin') {
    return <p>No tienes permisos</p>;
  }
  
  return <AdminDashboard />;
}
```

### Cerrar sesión
```javascript
import { useAuth } from '../contexts/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout}>
      Cerrar Sesión
    </button>
  );
}
```

---

## 📝 Notas Importantes

1. **Siempre consulta `profiles` para obtener el rol**, no `auth.users`
2. **`auth.users`** = Autenticación (login/logout)
3. **`profiles`** = Información de perfil y control de acceso (rol)
4. El `id` es el mismo en ambas tablas (relación 1:1)
5. Los logs en consola te ayudarán a debuggear problemas
6. Verifica las políticas RLS si tienes errores de permisos

---

## 🎯 Checklist de Implementación

- [x] AuthContext configurado
- [x] ProtectedRoute implementado
- [x] AdminRoute implementado
- [x] App.jsx con rutas protegidas
- [x] Hook useUserRole creado
- [x] Logs de debugging activos
- [x] Documentación completa

**Estado**: ✅ Sistema de autenticación completamente funcional
