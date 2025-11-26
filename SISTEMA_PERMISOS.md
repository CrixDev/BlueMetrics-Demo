# 🔐 Sistema de Permisos por Rol

## 📋 Roles Disponibles

### 1. **admin** - Administrador
- ✅ Acceso completo a todo
- ✅ Gestión hídrica (agua)
- ✅ Gestión de gas
- ✅ PTAR
- ✅ Agregar datos
- ✅ Ver correos
- ✅ Excel to SQL

### 2. **water** - Gestión Hídrica
- ✅ Consumo de agua
- ✅ Balance hídrico
- ✅ Pozos
- ✅ Lecturas diarias de agua
- ✅ Alertas (solo agua)
- ✅ Predicciones (solo agua)
- ✅ Análisis (solo agua)
- ❌ NO puede ver gas
- ❌ NO puede ver PTAR
- ❌ NO puede agregar datos

### 3. **gas** - Gestión de Gas
- ✅ Consumo de gas
- ✅ Alertas (solo gas)
- ✅ Predicciones (solo gas)
- ✅ Análisis (solo gas)
- ❌ NO puede ver agua
- ❌ NO puede ver PTAR
- ❌ NO puede agregar datos

### 4. **ptar** - Planta de Tratamiento
- ✅ PTAR
- ✅ Alertas (solo PTAR)
- ✅ Análisis (solo PTAR)
- ❌ NO puede ver agua
- ❌ NO puede ver gas
- ❌ NO puede agregar datos

### 5. **user** - Usuario Básico
- ✅ Ver todo (solo lectura)
- ❌ NO puede agregar datos
- ❌ NO puede ver correos
- ❌ NO puede usar Excel to SQL

---

## 🎯 Rutas y Permisos

### Rutas Públicas (sin login)
- `/` - Landing page
- `/login` - Login
- `/confirmacion` - Confirmación

### Rutas Protegidas (requieren login)
- `/dashboard` - Dashboard (todos)
- `/alertas` - Alertas (todos)
- `/predicciones` - Predicciones (todos)
- `/analisis` - Análisis (todos)
- `/contacto` - Contacto (todos)

### Rutas de AGUA (permiso: `water`)
- `/consumo` - Consumo de agua
- `/balance` - Balance hídrico
- `/pozos` - Lista de pozos
- `/pozos/:id` - Detalle de pozo
- `/lecturas-diarias` - Lecturas diarias

**Roles con acceso**: `admin`, `water`, `user`

### Rutas de GAS (permiso: `gas`)
- `/consumo-gas` - Consumo de gas

**Roles con acceso**: `admin`, `gas`, `user`

### Rutas de PTAR (permiso: `ptar`)
- `/ptar` - Planta de tratamiento

**Roles con acceso**: `admin`, `ptar`, `user`

### Rutas de ADMIN (permiso: `addData`)
- `/agregar-datos` - Agregar datos
- `/agregar-lecturas` - Agregar lecturas de agua
- `/agregar-lecturas-gas` - Agregar lecturas de gas
- `/correos` - Ver correos
- `/excel-to-sql/*` - Todas las rutas de Excel to SQL
- `/csv-to-sql-daily` - CSV to SQL

**Roles con acceso**: Solo `admin`

---

## 🔧 Uso en Código

### Hook `usePermissions`

```javascript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const { can, canViewWater, canViewGas, role } = usePermissions();
  
  return (
    <div>
      <p>Tu rol: {role}</p>
      
      {canViewWater && <WaterSection />}
      {canViewGas && <GasSection />}
      {can('addData') && <AddDataButton />}
    </div>
  );
}
```

### Componente `PermissionRoute`

```javascript
<Route 
  path="/consumo" 
  element={
    <PermissionRoute permission="water">
      <ConsumptionPage />
    </PermissionRoute>
  } 
/>
```

### Verificación Manual

```javascript
import { hasPermission } from '../config/permissions';

const userRole = 'water';
const canView = hasPermission(userRole, 'water'); // true
const canViewGas = hasPermission(userRole, 'gas'); // false
```

---

## 👥 Usuarios de Prueba

| Email | Rol | Acceso |
|-------|-----|--------|
| devoracristian100@gmail.com | admin | Todo |
| contacto@bluemetrics.mx | admin | Todo |
| devoracristian1000@gmail.com | water | Solo agua |

---

## 🧪 Cómo Probar

### 1. Login como admin
```
Email: devoracristian100@gmail.com
Password: tu contraseña
```
- Deberías ver TODAS las opciones en el menú
- Puedes acceder a todas las rutas

### 2. Login como water
```
Email: devoracristian1000@gmail.com
Password: tu contraseña
```
- Deberías ver solo opciones de agua
- Si intentas acceder a `/consumo-gas` → Acceso Restringido
- Si intentas acceder a `/ptar` → Acceso Restringido

### 3. Crear usuario con rol gas
```sql
-- Primero crear en auth.users (desde Supabase Dashboard)
-- Luego actualizar el rol en profiles:
UPDATE profiles 
SET role = 'gas' 
WHERE email = 'nuevo@usuario.com';
```

---

## 📝 Modificar Permisos

Para cambiar los permisos de un rol, edita:
```
src/config/permissions.js
```

Ejemplo - Dar permiso de PTAR al rol water:
```javascript
water: {
  water: true,
  gas: false,
  ptar: true,  // ← Cambiar a true
  // ...
}
```

---

## 🔄 Cambiar Rol de Usuario

```sql
-- Ver roles actuales
SELECT id, email, role FROM profiles;

-- Cambiar rol
UPDATE profiles 
SET role = 'water'  -- o 'admin', 'gas', 'ptar', 'user'
WHERE email = 'usuario@ejemplo.com';
```

---

## ✅ Checklist de Implementación

- [x] Sistema de permisos configurado
- [x] Hook `usePermissions` creado
- [x] Componente `PermissionRoute` creado
- [x] Rutas protegidas por permisos
- [x] Normalización de roles (case-insensitive)
- [x] Usuarios de prueba configurados
- [x] Documentación completa

**Estado**: ✅ Sistema de permisos completamente funcional
