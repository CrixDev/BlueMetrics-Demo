# ⚡ Inicio Rápido - Solucionar Loading Infinito

## 🚨 Problema Actual
La app se queda cargando porque hay una sesión activa corrupta.

## ✅ Solución en 3 Pasos

### Paso 1: Abrir la consola del navegador
1. Abre la app en el navegador (http://localhost:5173)
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña **Console**

### Paso 2: Limpiar el caché de autenticación
En la consola, ejecuta:
```javascript
clearAuthCache()
```

Deberías ver:
```
🧹 === LIMPIANDO CACHÉ DE AUTENTICACIÓN ===
✅ Sesión cerrada en Supabase
✅ X claves eliminadas
✅ === CACHÉ LIMPIADO COMPLETAMENTE ===
```

### Paso 3: Recargar la página
En la consola, ejecuta:
```javascript
location.reload()
```

## ✅ Resultado Esperado

Después de recargar, deberías ver en la consola:
```
🔍 [AuthContext] Iniciando verificación de sesión...
ℹ️ [AuthContext] No hay sesión activa
✅ [AuthContext] Verificación completada, isLoading = false
```

Y la página debería cargar normalmente mostrando la landing page o el login.

## 🔄 Si Necesitas Iniciar Sesión de Nuevo

1. Ve a `/login`
2. Ingresa tus credenciales:
   - Email: `devoracristian100@gmail.com`
   - Password: tu contraseña
3. El sistema debería funcionar correctamente ahora

## 📝 Cambios Aplicados

Se han hecho mejoras para evitar este problema en el futuro:
- ✅ Prevención de inicializaciones duplicadas
- ✅ Ignorar evento INITIAL_SESSION
- ✅ Mejor manejo de errores de RLS
- ✅ StrictMode desactivado (evita renders dobles)

## 🧪 Comandos de Diagnóstico

Si sigues teniendo problemas, ejecuta en la consola:

```javascript
// Ver diagnóstico completo
testSupabaseConnection()

// Ver qué hay en el almacenamiento
inspectAuthStorage()

// Limpiar todo
clearAuthCache()

// Recargar
location.reload()
```

---

**Última actualización**: 26 de Noviembre, 2025
