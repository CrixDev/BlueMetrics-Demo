# 📝 Crear Usuario Manualmente en Supabase

## Opción 1: Desde Supabase Dashboard (Recomendado)

### Paso 1: Ir a Authentication
1. Abre [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Users**
4. Click en **Add user** → **Create new user**

### Paso 2: Crear el usuario
Ingresa estos datos:
```
Email: emg@tec.mx
Password: 7s*R#JzQ%hV2yW8t9E
Auto Confirm User: ✅ (activar)
```

Click en **Create user**

### Paso 3: Copiar el User ID
Después de crear el usuario, copia el **User ID** (UUID) que aparece.

### Paso 4: Crear el perfil
Ve a **Table Editor** → **profiles** → **Insert** → **Insert row**

Ingresa:
```
id: [pega el User ID copiado]
email: emg@tec.mx
username: Admin
full_name: Administrador
company: Tec
role: water
created_at: now()
updated_at: now()
```

Click en **Save**

---

## Opción 2: Usando SQL (Si tienes trigger configurado)

Si tienes un trigger que crea automáticamente el perfil, solo necesitas crear el usuario desde el Dashboard y el perfil se creará solo.

Luego actualiza el rol:
```sql
UPDATE profiles 
SET 
  role = 'water',
  username = 'Admin',
  full_name = 'Administrador',
  company = 'Tec'
WHERE email = 'emg@tec.mx';
```

---

## Opción 3: Desde la App (Registro Temporal)

He creado un formulario de registro en el LoginPage. 

1. Ve a `/login`
2. Click en "¿No tienes cuenta? Regístrate"
3. Llena el formulario:
   - Email: emg@tec.mx
   - Password: 7s*R#JzQ%hV2yW8t9E
   - Username: Admin
   - Nombre: Administrador
   - Empresa: Tec
   - Rol: water

---

## ✅ Verificar que se creó correctamente

```sql
-- Ver el usuario en auth
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'emg@tec.mx';

-- Ver el perfil
SELECT id, email, username, full_name, company, role 
FROM profiles 
WHERE email = 'emg@tec.mx';

-- Verificar que los IDs coinciden
SELECT 
  u.id as auth_id,
  u.email,
  p.id as profile_id,
  p.role,
  p.username
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'emg@tec.mx';
```

---

## 📋 Datos de la Cuenta

```
Email: emg@tec.mx
Password: 7s*R#JzQ%hV2yW8t9E
Rol: water
Username: Admin
Nombre: Administrador
Empresa: Tec
```

**Permisos del rol `water`:**
- ✅ Consumo de agua
- ✅ Pozos
- ✅ Lecturas diarias
- ✅ PTAR
- ❌ Dashboard
- ❌ Gas
- ❌ Otras secciones
