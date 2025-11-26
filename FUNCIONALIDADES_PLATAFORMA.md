# BlueMetrics - Documentación de Funcionalidades

## Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Arquitectura Técnica](#arquitectura-técnica)
3. [Módulos Principales](#módulos-principales)
4. [Funcionalidades Detalladas](#funcionalidades-detalladas)
5. [Gestión de Datos](#gestión-de-datos)
6. [Análisis y Reportes](#análisis-y-reportes)
7. [Seguridad y Autenticación](#seguridad-y-autenticación)

---

## Descripción General

**BlueMetrics** es una plataforma integral de monitoreo y gestión de recursos hídricos y energéticos diseñada para instituciones que requieren un control exhaustivo de sus sistemas de agua y gas. La plataforma integra análisis en tiempo real, predicciones basadas en IA, y herramientas avanzadas de visualización de datos.

### Objetivo Principal
Proporcionar una solución completa para la gestión eficiente de recursos hídricos y energéticos mediante:
- Monitoreo en tiempo real de consumos
- Análisis predictivo con inteligencia artificial
- Gestión de pozos de agua y sistemas de tratamiento
- Control de consumo de gas natural
- Generación de reportes y alertas automáticas

---

## Arquitectura Técnica

### Stack Tecnológico

#### Frontend
- **Framework**: React 19.1.1 con Vite
- **Enrutamiento**: React Router 7.8.2
- **Estilos**: TailwindCSS 4.1.12
- **Visualización de Datos**: 
  - Chart.js 4.5.0
  - Recharts 3.4.1
  - Lightweight Charts 5.0.8
  - React-Chartjs-2 5.3.0
- **Animaciones**: Framer Motion 12.23.24
- **Iconos**: Lucide React 0.542.0
- **3D Graphics**: Three.js 0.180.0 con React Three Fiber

#### Backend
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **API**: Supabase Client 2.58.0

#### Herramientas Adicionales
- **Procesamiento de Datos**: XLSX 0.18.5 (Excel)
- **Utilidades**: clsx, tailwind-merge

### Estructura de Base de Datos

#### Tablas Principales

**Gestión de Agua:**
- `lecturas_semana_agua_2023/2024/2025` - Lecturas semanales acumuladas
- `lecturas_semana_agua_consumo_2023/2024/2025` - Consumo semanal calculado
- `lecturas_diarias` - Lecturas diarias de todos los puntos de medición
- `ptar_lecturas` - Lecturas de planta de tratamiento
- `vista_ptar_resumen_anual/mensual/trimestral` - Vistas agregadas PTAR

**Gestión de Gas:**
- `lecturas_semanales_gas_2023/2024/2025` - Lecturas semanales de gas
- `lecturas_semanales_gas_consumo_2023/2024/2025` - Consumo semanal de gas

**Gestión de Usuarios:**
- `profiles` - Perfiles de usuario con roles y permisos
- Integración con `auth.users` de Supabase

---

## Módulos Principales

### 1. Dashboard Principal
**Ruta**: `/dashboard`

**Funcionalidades:**
- Vista general del sistema con métricas clave
- Resumen de consumo de agua (últimas 4 semanas)
- Resumen de consumo de gas
- Indicadores de eficiencia y KPIs
- Gráficos de tendencias
- Alertas críticas en tiempo real
- Información del usuario y sesión activa

**Métricas Mostradas:**
- Total de pozos (servicios + riego)
- Pozos de riego (4, 8, 15)
- Pozos de servicios (11, 12, 3, 7, 14)
- Consumo de gas (calderas, comedores, residencias)
- Datos de PTAR
- Lecturas diarias consolidadas

---

### 2. Gestión Hídrica

#### 2.1 Consumo de Agua
**Ruta**: `/consumo`

**Funcionalidades:**
- **Análisis de Consumo Detallado**:
  - Métricas de últimas 4 semanas vs 4 anteriores
  - Comparación de pozos totales, riego y servicios
  - Tendencias porcentuales de consumo

- **Visualización de Datos**:
  - Gráficos de líneas y barras
  - Comparativas multi-año (2023, 2024, 2025)
  - Filtros por punto de medición
  - Selección de tipo de gráfico (líneas/barras)

- **Puntos de Medición**:
  - **Pozos de Servicios**: 11, 12, 3, 7, 14
  - **Pozos de Riego**: 4, 8, 15
  - **Residencias**: 10-15, 1-5, 2 Oriente
  - **Edificios**: Wellness, Biblioteca, CETEC, Biotecnología, Arena Borrego, Centro de Congresos, Auditorio Luis Elizondo, Núcleo, Expedition
  - **Torres de Enfriamiento**: Wellness, CAH3, Megacentral TE 2, Estadio Banorte
  - **Circuitos**: Campus 8", Residencias 6", A7-CE 4", Planta Física, Megacentral

- **Tablas Detalladas**:
  - Consumo semanal por punto
  - Comparativas entre semanas
  - Exportación de datos

#### 2.2 Lecturas Diarias
**Ruta**: `/lecturas-diarias`

**Funcionalidades:**
- Visualización de lecturas diarias de todos los puntos
- Filtros por mes y punto de medición
- Estadísticas generales (consumo total, promedio, máximo, mínimo)
- Gráficos de tendencias diarias
- Distribución de consumo por punto
- Paginación de registros
- Exportación de datos

#### 2.3 Balance Hídrico
**Ruta**: `/balance`

**Funcionalidades:**
- **Análisis de Flujo de Agua**:
  - Entrada total (pozos, municipal, PTAR, pipas)
  - Salida total (riego, torres, edificios, industria, pérdidas, evaporación)
  - Balance neto del sistema
  - Eficiencia operativa

- **Diagrama de Flujo Visual**:
  - Fuentes de agua
  - Distribución (red principal, almacenamiento)
  - Usos finales
  - Flujos interconectados

- **Indicadores de Sostenibilidad**:
  - Estrés hídrico
  - Tasa de reutilización
  - Tasa de pérdidas
  - Resiliencia del sistema

- **Análisis Temporal**:
  - Filtros: mensual, trimestral, anual
  - Comparativas por año
  - Tendencias de eficiencia

#### 2.4 Gestión de Pozos
**Ruta**: `/pozos`

**Funcionalidades:**
- **Lista Completa de Pozos**:
  - 8 pozos monitoreados (5 servicios + 3 riego)
  - Datos en tiempo real de Supabase
  - Lectura última semana
  - Consumo última semana
  - Comparativa vs semana anterior
  - Porcentaje de cambio

- **Información por Pozo**:
  - Nombre y ubicación
  - Tipo (Servicios/Riego)
  - Estado operativo
  - Métricas de rendimiento
  - Acciones (ver detalles, configurar)

- **Gráficos Generales**:
  - Consumo consolidado de todos los pozos
  - Tendencias históricas
  - Comparativas entre pozos

- **Alertas y Recomendaciones**:
  - Alertas de rendimiento
  - Recomendaciones de optimización
  - Sugerencias de mantenimiento

#### 2.5 Detalle de Pozo Individual
**Ruta**: `/pozos/:id`

**Funcionalidades:**
- Vista detallada de un pozo específico
- Historial completo de lecturas
- Gráficos de tendencias
- Análisis de eficiencia
- Comparativas con otros pozos
- Configuración específica

#### 2.6 PTAR (Planta de Tratamiento)
**Ruta**: `/ptar`

**Funcionalidades:**
- **Métricas Principales**:
  - Agua Residual (AR) total
  - Agua Tratada (AT) total
  - Eficiencia de tratamiento (%)
  - Comparativas vs año anterior

- **Análisis Temporal Múltiple**:
  - Diario (con filtro de fechas)
  - Semanal
  - Mensual
  - Trimestral
  - Anual

- **Gráficos Especializados**:
  - Flujos de agua (AR vs AT)
  - Eficiencia de tratamiento
  - Balance de operación (recirculación + total día)
  - Medidores (entrada vs salida)

- **Filtros Avanzados**:
  - Selección de años múltiples
  - Rango de fechas personalizado
  - Tipo de gráfico (líneas, barras, área, combinado)

- **Estadísticas Detalladas**:
  - Total de registros
  - Promedio diario AR/AT
  - Resumen por período
  - Tabla de datos completa

---

### 3. Gestión de Gas

#### 3.1 Consumo de Gas
**Ruta**: `/consumo-gas`

**Funcionalidades:**
- **Métricas de Consumo**:
  - Consumo total de gas (últimas 4 semanas)
  - Calderas y calefacción
  - Comedores y restaurantes
  - Residencias estudiantiles

- **Puntos de Medición de Gas**:
  - **Calderas**: Caldera 1 León, Caldera 2, Caldera 3, Mega Calefacción 1, Wellness General, Residencias ABC
  - **Comedores**: Centrales Tec Food, Doña Tota, Chilaquiles Tec, Carl's Jr, Comedor Estudiantes, Wellness Supersalads
  - **Residencias**: Acometida Principal Digital, Residencias 1-5

- **Análisis Comparativo**:
  - Comparación multi-año (2023, 2024, 2025)
  - Gráficos de tendencias
  - Filtros por punto de medición
  - Tendencias porcentuales

- **Visualización**:
  - Gráficos de líneas y barras
  - Comparativas semanales
  - Exportación de reportes

#### 3.2 Lecturas de Gas
**Ruta**: `/agregar-lecturas-gas`

**Funcionalidades:**
- Ingreso de lecturas semanales de gas
- Validación de datos
- Cálculo automático de consumo
- Historial de lecturas

---

### 4. Administración de Datos

#### 4.1 Agregar Datos
**Ruta**: `/agregar-datos`

**Funcionalidades:**
- Formulario para ingreso de datos manuales
- Selección de pozo
- Tipo de datos (anual, trimestral, mensual)
- Campos de medición:
  - m³ por anexo
  - m³ cedidos por anexo
  - m³ por título
  - m³ cedidos por título
- Validación de formularios
- Observaciones y notas

#### 4.2 Lecturas de Agua Semanales
**Ruta**: `/agregar-lecturas`

**Funcionalidades:**
- Ingreso de lecturas semanales de agua
- Selección de semana y año
- Validación de datos
- Cálculo automático de consumo
- Historial de lecturas

#### 4.3 Herramientas de Importación Excel

**Excel to SQL - Agua (por año)**:
- `/excel-to-sql/agua/2023`
- `/excel-to-sql/agua/2024`
- `/excel-to-sql/agua/2025`

**Excel to SQL - Gas (por año)**:
- `/excel-to-sql/gas/2023`
- `/excel-to-sql/gas/2024`
- `/excel-to-sql/gas/2025`

**Excel to SQL - PTAR**:
- `/excel-to-sql/ptar`

**CSV to SQL - Lecturas Diarias**:
- `/csv-to-sql-daily`

**Funcionalidades Comunes**:
- Carga de archivos Excel/CSV
- Validación de estructura
- Mapeo de columnas
- Previsualización de datos
- Generación de SQL INSERT
- Importación directa a Supabase
- Manejo de errores y validaciones

---

### 5. Análisis y Predicciones

#### 5.1 Centro de Análisis
**Ruta**: `/analisis`

**Funcionalidades:**
- **Hub Central de Gráficos**:
  - Registro completo de gráficos disponibles
  - Búsqueda por nombre y descripción
  - Filtros por categoría
  - Filtros por tags
  - Vista destacados

- **Categorías de Análisis**:
  - Consumo de agua
  - Consumo de gas
  - PTAR
  - Pozos
  - Balance hídrico
  - Eficiencia
  - Comparativas

- **Visualización Modal**:
  - Vista ampliada de gráficos
  - Controles interactivos
  - Exportación de imágenes
  - Compartir análisis

#### 5.2 Predicciones con IA
**Ruta**: `/predicciones`

**Funcionalidades:**
- **Análisis Predictivo**:
  - Predicciones diarias (7 días)
  - Predicciones semanales (8 semanas)
  - Predicciones mensuales (6 meses)

- **Métricas de IA**:
  - Precisión del modelo (94%)
  - Confianza media (87%)
  - Detección de anomalías
  - Insights automáticos

- **Factores de Influencia**:
  - Temperatura (correlación 0.89)
  - Humedad (correlación -0.34)
  - Precipitación (correlación -0.67)
  - Demanda industrial (correlación 0.95)
  - Día de la semana
  - Eventos especiales

- **Gráficos Predictivos**:
  - Predicción vs realidad
  - Intervalos de confianza
  - Nivel de confianza por período

- **Anomalías Detectadas**:
  - Picos de consumo inesperados
  - Caídas de eficiencia
  - Rupturas de patrones
  - Variaciones de calidad
  - Severidad y acciones recomendadas

- **Insights de IA**:
  - Patrones estacionales
  - Picos de demanda predecibles
  - Correlaciones climáticas
  - Impacto de mantenimiento
  - Oportunidades de ahorro

#### 5.3 Sistema de Alertas
**Ruta**: `/alertas`

**Funcionalidades:**
- **Centro de Alertas**:
  - Alertas críticas, advertencias, información
  - Estados: activas, reconocidas, resueltas, pendientes
  - Prioridades: alta, media, baja

- **Tipos de Alertas**:
  - Límites diarios excedidos
  - Posibles fugas detectadas
  - Mantenimiento programado
  - Presión baja en sistema
  - Calidad del agua comprometida
  - Eficiencia meta alcanzada
  - Nivel de tanques bajo
  - Fallas de sensores
  - Optimización energética
  - Temperatura elevada

- **Información por Alerta**:
  - Título y descripción
  - Ubicación afectada
  - Sistemas impactados
  - Timestamp
  - Impacto estimado
  - Equipo responsable
  - Acciones recomendadas

- **Filtros y Búsqueda**:
  - Búsqueda por texto
  - Filtro por tipo
  - Filtro por estado
  - Filtro por prioridad

- **Acciones**:
  - Ver detalles
  - Reconocer alerta
  - Resolver alerta
  - Archivar

- **Estadísticas**:
  - Total de alertas
  - Alertas activas
  - Alertas críticas
  - Alertas resueltas

---

### 6. Gestión de Usuarios y Seguridad

#### 6.1 Autenticación
**Ruta**: `/login`

**Funcionalidades:**
- **Inicio de Sesión**:
  - Email y contraseña
  - Autenticación con Google OAuth
  - Validación de credenciales
  - Manejo de errores específicos
  - Redirección automática al dashboard

- **Registro de Usuarios**:
  - Creación de cuenta nueva
  - Campos: email, contraseña, username, nombre completo, empresa, rol
  - Validación de email único
  - Verificación por correo electrónico
  - Trigger automático para crear perfil

- **Gestión de Sesión**:
  - Persistencia de sesión
  - Auto-login si hay sesión activa
  - Listeners de cambios de autenticación

#### 6.2 Sistema de Roles

**Roles Disponibles**:
- **Admin**: Acceso completo a todas las funcionalidades
- **User**: Acceso a visualización y análisis

**Permisos por Rol**:
- Administradores:
  - Gestión de correos (`/correos`)
  - Configuración del sistema
  - Acceso a todas las herramientas de importación
  - Gestión de usuarios

- Usuarios:
  - Visualización de dashboards
  - Análisis de datos
  - Generación de reportes
  - Consulta de alertas

#### 6.3 Perfil de Usuario

**Información Almacenada**:
- ID único
- Email
- Nombre completo
- Username
- Empresa/Organización
- Rol (admin/user)
- Avatar URL
- Fecha de creación
- Última actualización

**Tabla `profiles`**:
```sql
- id (UUID, FK a auth.users)
- username (TEXT)
- full_name (TEXT)
- company (TEXT)
- role (TEXT, default: 'user')
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

### 7. Características Adicionales

#### 7.1 Navegación y UI

**Componentes Principales**:
- **DashboardSidebar**: Navegación lateral con secciones colapsables
  - General
  - Gestión Hídrica
  - Gestión de Gas
  - Administración de Datos
  - Análisis
  - Administración (solo admins)

- **DashboardHeader**: Encabezado con:
  - Mensaje de bienvenida
  - Alertas en tiempo real
  - Información del usuario
  - Botón de cerrar sesión

- **Responsive Design**: Adaptable a diferentes tamaños de pantalla

#### 7.2 Visualización de Datos

**Tipos de Gráficos**:
- Líneas (tendencias temporales)
- Barras (comparativas)
- Área (volúmenes acumulados)
- Combinados (múltiples métricas)
- Radar (análisis multidimensional)
- Pie/Donut (distribuciones)

**Características de Gráficos**:
- Interactividad (hover, zoom, pan)
- Leyendas personalizables
- Tooltips informativos
- Exportación de imágenes
- Responsive

#### 7.3 Exportación de Datos

**Formatos Disponibles**:
- Excel (.xlsx)
- CSV
- PDF (reportes)
- Imágenes (gráficos)

**Datos Exportables**:
- Lecturas semanales
- Lecturas diarias
- Consumos calculados
- Reportes de PTAR
- Análisis comparativos
- Predicciones

#### 7.4 Landing Page
**Ruta**: `/`

**Funcionalidades:**
- Presentación de la plataforma
- Características principales
- Call-to-action para login
- Información institucional

#### 7.5 Página de Contacto
**Ruta**: `/contacto`

**Funcionalidades:**
- Formulario de contacto
- Información de soporte
- Enlaces a recursos

#### 7.6 Administración de Correos
**Ruta**: `/correos` (Solo Admins)

**Funcionalidades:**
- Gestión de notificaciones por email
- Configuración de alertas automáticas
- Lista de distribución
- Plantillas de correo

---

## Gestión de Datos

### Flujo de Datos

1. **Ingreso de Datos**:
   - Manual (formularios)
   - Importación Excel/CSV
   - API de Supabase

2. **Procesamiento**:
   - Validación de datos
   - Cálculo de consumos (lecturas actuales - anteriores)
   - Agregaciones (diarias → semanales → mensuales → anuales)

3. **Almacenamiento**:
   - PostgreSQL en Supabase
   - Tablas normalizadas por año
   - Vistas materializadas para agregaciones

4. **Visualización**:
   - Consultas optimizadas
   - Caché de datos frecuentes
   - Actualización en tiempo real

### Puntos de Medición

**Agua - Total: 31 puntos**:
- 1 Medidor general de pozos
- 8 Pozos individuales (5 servicios + 3 riego)
- 6 Residencias
- 9 Edificios principales
- 4 Torres de enfriamiento
- 5 Circuitos de distribución

**Gas - Total: 17 puntos**:
- 6 Calderas y sistemas de calefacción
- 6 Comedores y restaurantes
- 6 Residencias y acometidas

### Cálculos Automáticos

**Consumo Semanal**:
```
Consumo Semana N = Lectura Semana N - Lectura Semana N-1
```

**Eficiencia PTAR**:
```
Eficiencia = (Agua Tratada / Agua Residual) × 100
```

**Balance Hídrico**:
```
Balance Neto = Total Entrada - Total Salida
Eficiencia = (Total Salida / Total Entrada) × 100
```

---

## Análisis y Reportes

### Tipos de Análisis

1. **Análisis Temporal**:
   - Diario
   - Semanal
   - Mensual
   - Trimestral
   - Anual

2. **Análisis Comparativo**:
   - Multi-año (2023, 2024, 2025)
   - Entre puntos de medición
   - Pozos vs consumo
   - Predicción vs realidad

3. **Análisis de Tendencias**:
   - Tendencias ascendentes/descendentes
   - Patrones estacionales
   - Anomalías
   - Correlaciones

4. **Análisis Predictivo**:
   - Machine Learning
   - Factores de influencia
   - Intervalos de confianza
   - Recomendaciones automáticas

### Reportes Generados

1. **Reportes de Consumo**:
   - Consumo por período
   - Consumo por punto
   - Comparativas históricas

2. **Reportes de Eficiencia**:
   - KPIs del sistema
   - Eficiencia de pozos
   - Eficiencia PTAR
   - Balance hídrico

3. **Reportes de Alertas**:
   - Alertas activas
   - Historial de alertas
   - Tiempo de resolución
   - Impacto de alertas

4. **Reportes Predictivos**:
   - Predicciones futuras
   - Anomalías detectadas
   - Insights de IA
   - Recomendaciones

---

## Seguridad y Autenticación

### Niveles de Seguridad

1. **Autenticación**:
   - Email/Password con Supabase Auth
   - OAuth con Google
   - Verificación de email
   - Tokens JWT

2. **Autorización**:
   - Row Level Security (RLS) en Supabase
   - Roles de usuario (admin/user)
   - Permisos por tabla
   - Rutas protegidas

3. **Protección de Datos**:
   - Encriptación en tránsito (HTTPS)
   - Encriptación en reposo (Supabase)
   - Validación de inputs
   - Sanitización de datos

4. **Sesiones**:
   - Persistencia segura
   - Auto-logout por inactividad
   - Renovación de tokens
   - Listeners de estado

### Políticas de Seguridad

**RLS (Row Level Security)**:
- Los usuarios solo pueden ver sus propios datos
- Los administradores tienen acceso completo
- Políticas específicas por tabla
- Triggers automáticos para perfiles

**Validaciones**:
- Validación de formularios en frontend
- Validación de datos en backend
- Tipos de datos estrictos
- Constraints en base de datos

---

## Tecnologías y Dependencias

### Dependencias de Producción

```json
{
  "@react-three/drei": "^10.7.6",
  "@react-three/fiber": "^9.3.0",
  "@supabase/supabase-js": "^2.58.0",
  "@tailwindcss/vite": "^4.1.12",
  "chart.js": "^4.5.0",
  "clsx": "^2.1.1",
  "framer-motion": "^12.23.24",
  "lightweight-charts": "^5.0.8",
  "lucide-react": "^0.542.0",
  "react": "^19.1.1",
  "react-chartjs-2": "^5.3.0",
  "react-dom": "^19.1.1",
  "react-router": "^7.8.2",
  "recharts": "^3.4.1",
  "tailwind-merge": "^3.3.1",
  "tailwindcss": "^4.1.12",
  "three": "^0.180.0",
  "xlsx": "^0.18.5"
}
```

### Características Técnicas

- **SPA (Single Page Application)**: Navegación sin recargas
- **Real-time Updates**: Actualización en tiempo real con Supabase
- **Responsive Design**: Compatible con móviles, tablets y desktop
- **Progressive Enhancement**: Funcionalidad básica sin JavaScript
- **Code Splitting**: Carga optimizada de componentes
- **Lazy Loading**: Carga diferida de recursos pesados

---

## Roadmap y Mejoras Futuras

### Funcionalidades Planificadas

1. **Notificaciones Push**:
   - Alertas en tiempo real
   - Notificaciones móviles
   - Email automático

2. **Reportes Avanzados**:
   - Generación automática de PDFs
   - Reportes programados
   - Dashboards personalizables

3. **Machine Learning Mejorado**:
   - Modelos más precisos
   - Detección de anomalías avanzada
   - Optimización automática

4. **Integración IoT**:
   - Sensores en tiempo real
   - Automatización de lecturas
   - Control remoto de sistemas

5. **App Móvil**:
   - React Native
   - Funcionalidad offline
   - Sincronización automática

6. **API Pública**:
   - REST API documentada
   - Webhooks
   - Integraciones con terceros

---

## Conclusión

**BlueMetrics** es una plataforma completa y profesional para la gestión de recursos hídricos y energéticos que combina:

✅ **Monitoreo en Tiempo Real**: Datos actualizados de 48+ puntos de medición  
✅ **Análisis Avanzado**: Múltiples tipos de gráficos y visualizaciones  
✅ **Inteligencia Artificial**: Predicciones y detección de anomalías  
✅ **Gestión Integral**: Agua, gas, PTAR, pozos, balance hídrico  
✅ **Seguridad Robusta**: Autenticación, autorización y encriptación  
✅ **Escalabilidad**: Arquitectura moderna y mantenible  
✅ **UX Profesional**: Interfaz intuitiva y responsive  

La plataforma está diseñada para crecer y adaptarse a las necesidades cambiantes de gestión de recursos, proporcionando herramientas poderosas para la toma de decisiones basada en datos.

---

**Versión**: 1.0  
**Última Actualización**: Noviembre 2024  
**Desarrollado con**: React + Vite + Supabase + TailwindCSS
