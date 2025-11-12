# 🌊 Bluemetrics - Documentación Completa de Funcionalidades

## 📋 Descripción General

**Bluemetrics** es una plataforma de gestión y monitoreo inteligente de recursos hídricos y consumo de gas diseñada para instalaciones industriales y campus universitarios. La aplicación permite el control en tiempo real, análisis predictivo y optimización del consumo de agua y gas natural.

---

## 🎯 Módulos y Características Principales

### 1. **Página de Inicio (Landing Page)** - `/`
- Navegación principal con acceso a login y dashboard
- Sección Hero con fondo animado de agua usando Three.js
- **Beneficios destacados:**
  - Control de huella hídrica en tiempo real
  - Decisiones basadas en datos con reportes inteligentes
  - Tecnología con sensores e IA
- **Características:** Monitoreo en tiempo real, Análisis predictivo con IA, Cumplimiento regulatorio, Identificación de fugas
- Formulario de contacto integrado con Brevo para captura de leads
- Diseño responsive con menú móvil

### 2. **Sistema de Autenticación**
#### Login (`/login`)
- Autenticación con Supabase
- Registro de nuevos usuarios
- Recuperación de contraseñas
- Redirección automática al dashboard

#### Confirmación (`/confirmacion`)
- Confirmación de envío de formulario de contacto
- Mensaje de agradecimiento personalizado
- Indicación de tiempo de respuesta

### 3. **Dashboard Principal** - `/dashboard`
Panel de control central con:
- **Métricas principales:** Consumo actual vs anterior (diario, semanal, mensual, anual)
- **Indicadores de tendencia** con porcentajes de variación
- **Metas de consumo** con progreso visual
- **KPIs de eficiencia:** Eficiencia operativa, Índice de sostenibilidad, Pérdidas del sistema, Tasa de recuperación
- **Visualizaciones:** Gráficos comparativos, Gráfico radar de eficiencia, Monitoreo de pozos
- **Selector de período:** Mensual, Trimestral, Anual
- Estado operativo de pozos con nivel de agua, flujo, presión, temperatura y pH

### 4. **Módulo de Consumo de Agua** - `/consumo`
#### Filtros y Selección
- Filtro por año: 2022-2025
- Vista por categoría: Pozos de Servicios, Pozos de Riego, Consumo Total
- Tipo de gráfico: Barras, Líneas, Área
- Período: Mensual, Trimestral, Anual

#### Puntos de Consumo (100+ puntos de medición)
**Pozos de Agua Potable (Servicios):** Medidor General, Pozo 11, 14, 12, 7, 3

**Pozos de Riego:** Pozo 4, 8, 15

**Circuito 8 Campus (80+ puntos):**
- Auditorio Luis Elizondo
- CDB2 y Baños Nuevos
- Arena Borrego
- Edificio de Negocios DAF
- Aulas 5 y 6
- Domo Cultural
- Centro Wellness (múltiples puntos)
- Comedores Centrales (10+ puntos)
- CIAP Centro de Alimentos (10+ puntos)
- Residencias
- Laboratorios y más...

#### Funcionalidades
- Lecturas semanales con comparación entre semanas
- Datos históricos por año
- Cálculo de diferencias y consumo acumulado
- Exportación a Excel/CSV
- Búsqueda y filtrado de puntos
- Gráficos comparativos multi-año
- Análisis de patrones estacionales

### 5. **Módulo de Consumo de Gas** - `/consumo-gas`
#### Puntos de Medición
**Acometidas Campus:**
- Acometida General Gas Natural
- Acometida Cafetería CIAP
- Acometida Calderas CDB2
- Acometida Cafetería Centrales
- Acometida Calderas Choza
- Acometida Calderas RES 10-15
- Acometida Calderas CIAP 3er piso

**Medidores de Calderas:** Múltiples calderas en diferentes edificios

#### Funcionalidades
- Visualización temporal de consumo de gas en m³
- Gráficos específicos para gas natural
- Comparación de acometidas
- Detección de anomalías
- Tablas semanales con lecturas detalladas
- Sistema de alertas para consumos elevados

### 6. **Balance Hídrico** - `/balance`
#### Métricas de Balance
**Entradas totales:**
- Agua de pozos
- Agua de red municipal
- Agua reciclada

**Salidas totales:**
- Consumo doméstico
- Consumo industrial
- Riego
- Pérdidas del sistema

**Cálculos:**
- Balance neto (Entrada - Salida)
- Porcentaje de eficiencia
- Tasa de reciclaje
- Eficiencia de uso
- Recarga de acuíferos
- Huella hídrica

#### Visualizaciones
- Gráfico de flujo (Sankey diagram)
- Comparación temporal de balance
- Distribución por uso
- Identificación de pérdidas
- Oportunidades de ahorro

### 7. **Gestión de Pozos** - `/pozos`
#### Información por Pozo
- Identificación: Número, nombre, tipo (Servicios/Riego)
- Ubicación geográfica
- **Especificaciones técnicas:**
  - Profundidad del pozo
  - Nivel del agua
  - Flujo (L/min)
  - Presión (bar)
  - Temperatura y pH
- Estado operativo: Activo, Mantenimiento, Inactivo
- Calidad del agua: Excelente, Buena, Regular
- Última fecha de mantenimiento

#### Pozos Incluidos
- **Servicios:** 11, 12, 3, 7, 14
- **Riego:** 4, 8, 15

### 8. **Detalle de Pozo Individual** - `/pozos/:id`
- Datos en tiempo real
- Historial de operación
- **Gráficos:** Flujo histórico, Nivel de agua, Presión, Calidad
- **Métricas:** Consumo por período, Eficiencia operativa, Costos
- Alertas y recomendaciones específicas

### 9. **PTAR (Planta de Tratamiento)** - `/ptar`
#### Métricas Principales
- Agua entrada a PTAR (m³)
- Agua salida tratada (m³)
- Consumo de pozos de riego con agua tratada
- Eficiencia de tratamiento (%)

#### Parámetros de Calidad
- DQO (Demanda Química de Oxígeno) mg/L
- pH promedio
- Sistema UV (W/m²)
- Conductividad (μS/cm)
- Volumen de riego utilizado

#### Visualizaciones
- Vista anual (2022-2025)
- Vista trimestral, mensual, semanal, diaria
- Comparación multi-año
- Selección de métricas múltiples

### 10. **Sistema de Alertas** - `/alertas`
#### Tipos de Alertas
**Críticas (rojas):**
- Límite diario excedido
- Presión baja en sistema principal
- Fallas en equipos críticos

**Advertencias (amarillas):**
- Posibles fugas detectadas
- Calidad del agua comprometida
- Mantenimiento próximo

**Informativas (azules):**
- Mantenimiento programado
- Actualizaciones del sistema

#### Información y Gestión
- Título, mensaje, ubicación, sistemas impactados
- Prioridad: Alta, Media, Baja
- Equipo responsable y acción recomendada
- **Filtros:** Tipo, prioridad, estado, categoría
- Búsqueda, marcar como leída/resuelta, archivar
- **Categorías:** Consumo, Fuga, Mantenimiento, Presión, Calidad, Sistema

### 11. **Predicciones con IA** - `/predicciones`
#### Predicciones Temporales
**Diaria:**
- Consumo esperado por día
- Nivel de confianza (%)
- Factores climáticos y operacionales

**Semanal:**
- Consumo proyectado para 8 semanas
- Rangos de variación
- Factores de influencia

**Mensual:**
- Proyecciones a 6 meses
- Análisis estacional
- Tendencias a largo plazo

#### Factores de Influencia
- Temperatura (correlación con consumo)
- Humedad (impacto en riego)
- Precipitación (reducción de consumo)
- Días laborables vs festivos
- Eventos especiales
- Mantenimientos programados
- Temporadas académicas

#### Visualizaciones
- Gráficos con valores reales vs predichos
- Áreas de confianza
- Métricas de performance del modelo
- Recomendaciones basadas en predicciones

### 12. **Agregar Datos de Pozos** - `/agregar-datos`
#### Formulario de Entrada
- Selección de pozo
- **Tipos de datos:** Anuales, Trimestrales, Mensuales
- Período único o rango de períodos
- Generación automática del período
- **Valores en m³:** Por anexo, cedidos por anexo, por título, cedidos por título
- Campo de observaciones
- Validaciones y confirmación de guardado

### 13. **Agregar Lecturas Semanales de Agua** - `/agregar-lecturas`
#### Gestión de Semanas
- Selección de año: 2024, 2025
- Lista de semanas existentes
- Crear nueva semana con fechas
- Editar semanas existentes

#### Captura de Datos
- **Categorías:** Pozos de Servicios (6), Pozos de Riego (4), Circuito 8 Campus (80+)
- Entrada de lecturas por punto
- Navegación por tabs de categorías
- Búsqueda de puntos específicos
- Copiado de semana anterior
- Auto-guardado en Supabase
- Indicador de estado

### 14. **Agregar Lecturas Semanales de Gas** - `/agregar-lecturas-gas`
- Similar a lecturas de agua pero para gas natural
- **Categorías:** Acometidas Campus (7), Medidores de Calderas
- Unidades en m³ de gas
- Integración con Supabase
- Sistema de años (2024, 2025)

### 15. **Correos y Contactos** - `/correos`
#### Gestión de Mensajes
- Bandeja de entrada con todos los mensajes
- **Información:** Nombre, Email, Teléfono, Empresa, Asunto, Mensaje
- Fecha y hora de recepción
- **Funcionalidades:** Filtros (todos/leídos/no leídos), búsqueda, marcar, eliminar
- Integración con Supabase

### 16. **Herramienta Excel a SQL** - `/excel-to-sql`
#### Conversión de Datos
- Carga de archivos Excel (.xlsx, .xls)
- Conversión automática a SQL INSERT
- Mapeo de columnas según estructura
- **Características:**
  - Validación de estructura
  - Preview de datos
  - Estadísticas de procesamiento
  - Descarga de SQL generado
  - Copia al portapapeles
- Soporte para todos los campos de lecturas semanales
- Personalización del nombre de tabla

---

## 🔧 Tecnologías Utilizadas

### Frontend
- **React 19.1.1** - Framework UI
- **React Router 7.8.2** - Navegación
- **Vite 7.1.2** - Build tool
- **TailwindCSS 4.1.12** - Estilos
- **Lucide React** - Iconos

### Visualización
- **Chart.js 4.5.0** + React-Chartjs-2
- **Lightweight Charts 5.0.8**
- **Three.js 0.180.0** + @react-three/fiber + @react-three/drei

### Backend
- **Supabase 2.58.0** (Auth + PostgreSQL + API REST + Realtime)

### Utilidades
- **XLSX 0.18.5** - Archivos Excel
- **clsx + tailwind-merge** - Clases CSS

---

## 📊 Estructura de Base de Datos

### Tablas Principales

**lecturas_semana2024 / lecturas_semana2025**
- numero_semana, fecha_inicio, fecha_fin
- Campos de pozos (servicios y riego)
- Campos del circuito 8 campus (80+ campos)

**lecturas_semanales_gas_2024 / lecturas_semanales_gas_2025**
- numero_semana, fecha_inicio, fecha_fin
- Campos de acometidas
- Campos de medidores de calderas

**correos**
- id, remitente, email, telefono, empresa
- asunto, mensaje, created_at
- leido, destacado

**profiles**
- id, full_name, email, role

---

## 🚀 Funcionalidades Avanzadas

1. **Sistema Multi-Año:** Soporte 2022-2025, tablas separadas, comparación inter-anual
2. **Integración Tiempo Real:** Supabase con autenticación, API automática, consultas optimizadas
3. **Visualizaciones Interactivas:** Gráficos con zoom/pan, tooltips, múltiples tipos, exportación
4. **Búsqueda y Filtrado:** Tiempo real, múltiples criterios, resultados instantáneos
5. **Responsive Design:** Adaptación móvil completa, menú hamburguesa, tablas y gráficos adaptables
6. **Auto-guardado:** Guardado automático, indicadores visuales, manejo de errores

---

## 🔐 Seguridad

- **Autenticación:** Supabase Auth con JWT y sesiones persistentes
- **Autorización:** Rutas protegidas, roles (Admin/Usuario), permisos
- **Protección:** Variables de entorno, HTTPS, sanitización, validación

---

## 📈 Métricas y KPIs

- **Consumo:** Diario/semanal/mensual/anual, comparaciones, variaciones
- **Eficiencia:** Operativa, sostenibilidad, pérdidas, recuperación
- **Calidad:** pH, temperatura, DQO, conductividad, UV
- **Operación:** Estado pozos, nivel agua, flujo, presión, mantenimientos

---

## 🎯 Casos de Uso

1. **Monitoreo Diario:** Revisar consumo, alertas, estado pozos, tendencias
2. **Análisis Mensual:** Reportes, comparaciones, patrones, optimizaciones
3. **Planificación:** Predicciones, balance, KPIs, metas
4. **Mantenimiento:** Alertas, historial, programación, calidad
5. **Entrada de Datos:** Lecturas semanales, importación Excel, actualización
6. **Administración:** Usuarios, alertas, mensajes, exportación

---

## 📱 Mapa de Rutas

### Públicas
`/` `/login` `/confirmacion`

### Dashboard
`/dashboard` `/consumo` `/consumo-gas` `/balance` `/pozos` `/pozos/:id` `/ptar` `/alertas` `/predicciones`

### Gestión Datos
`/agregar-datos` `/agregar-lecturas` `/agregar-lecturas-gas` `/excel-to-sql`

### Admin
`/correos` `/contacto`

---

## 🌟 Características Destacadas

1. **Interfaz Intuitiva:** Diseño moderno, navegación clara, feedback visual
2. **Tiempo Real:** Actualización automática, sincronización Supabase
3. **Análisis Avanzado:** Predicciones IA, patrones, recomendaciones, multi-año
4. **Flexibilidad:** Múltiples vistas, filtros, exportación, configuración
5. **Escalabilidad:** Arquitectura modular, componentes reutilizables, DB optimizada

---

## 🔄 Flujo de Trabajo Típico

1. Login → Autenticación
2. Dashboard → Vista general
3. Análisis → Consumo y tendencias
4. Alertas → Verificación
5. Entrada Datos → Lecturas semanales
6. Predicciones → Proyecciones
7. Reportes → Exportación
8. Optimización → Implementación de mejoras

---

## 🔮 Potencial de Expansión

1. Dashboard móvil nativo (iOS/Android)
2. Integración IoT y sensores físicos
3. Reportes automatizados por email
4. ML avanzado para predicciones
5. Gestión de usuarios robusta
6. API pública
7. Facturación de consumos
8. Geolocalización en mapa
9. Benchmarks industriales
10. Certificaciones de sostenibilidad

---

## 📝 Notas

- Autenticación temporalmente desactivada para desarrollo
- Datos específicos para campus universitario/industrial
- Soporte múltiples años con tablas separadas
- Sistema de predicciones con datos simulados (integrable con modelos reales)

---

## 🏁 Resumen Ejecutivo

**BlueMetrics** es una solución integral para la gestión inteligente de recursos hídricos y gas natural que combina:
- **Monitoreo en tiempo real** de 100+ puntos de consumo
- **Análisis predictivo** con IA para optimización
- **Sistema de alertas** proactivo
- **Visualizaciones avanzadas** para toma de decisiones
- **Gestión completa** de datos históricos y proyecciones
- **Herramientas administrativas** para operación eficiente

La plataforma está diseñada para maximizar la eficiencia, reducir costos y promover la sostenibilidad mediante el uso inteligente de datos y tecnología de punta.
