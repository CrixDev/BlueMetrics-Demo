// ============================================================
// Configuraciones para Excel to SQL Converter
// ============================================================

// Campos para lecturas semanales de AGUA
const camposAgua = [
  'numero_semana',
  'fecha_inicio',
  'fecha_fin',
  // Pozos de Agua Potable (Servicios)
  'medidor_general_pozos',
  'pozo_11',
  'pozo_14',
  'pozo_12',
  'pozo_7',
  'pozo_3',
  // Pozos de Riego
  'pozo_4_riego',
  'pozo_8_riego',
  'pozo_15_riego',
  'total_pozos_riego',
  // Circuito 8 Campus
  'circuito_8_campus',
  'auditorio_luis_elizondo',
  'cdb2',
  'cdb2_banos_nuevos_2024',
  'arena_borrego',
  'edificio_negocios_daf',
  'aulas_6',
  'domo_cultural',
  'wellness_parque_central_tunel',
  'wellness_registro',
  'parque_central_registro',
  'wellness_edificio',
  'wellness_super_salads',
  'wellness_torre_enfriamiento',
  'wellness_alberca',
  'centrales_comedor_1_principal',
  'centrales_dona_tota',
  'centrales_subway',
  'centrales_carls_jr',
  'centrales_little_cesars',
  'centrales_grill_team',
  'centrales_chilaquiles',
  'centrales_tec_food',
  'centrales_oxxo',
  'comedor_central_tunel',
  'administrativo',
  'biotecnologia',
  'escuela_arte_caldera_1',
  'ciap_oriente',
  'ciap_centro',
  'ciap_poniente',
  'ciap_green_shake',
  'ciap_andatti',
  'ciap_dc_jochos',
  'aulas_5',
  'ciap_starbucks',
  'ciap_super_salads',
  'ciap_sotano',
  'reflexion',
  'comedor_2_residencias_10_15',
  'residencias_10_15',
  'residencias_10_15_llenado',
  'comedor_2_caldera_2',
  'la_choza',
  'cedes_cisterna',
  'cedes_site',
  'nucleo',
  'expedition',
  'expedition_bread',
  'expedition_matthew',
  'cedes_e2',
  'aulas_1',
  'rectoria_norte',
  'pabellon_la_carreta',
  'rectoria_sur',
  'aulas_2',
  'cetec',
  'biblioteca',
  'biblioteca_nikkori',
  'biblioteca_nectar_works',
  'biblioteca_tim_horton',
  'biblioteca_starbucks',
  'aulas_3',
  'basanti',
  'aulas_3_sr_latino',
  'aulas_3_starbucks',
  'centrales_sur',
  'aulas_4_norte',
  // Circuito 6 Residencias
  'circuito_6_residencias',
  'residencias_1_antiguo',
  'residencias_2_ote',
  'residencias_2_pte',
  'residencias_3',
  'residencias_4',
  'residencias_5',
  'residencias_7',
  'residencias_8',
  'correos',
  'alberca',
  'residencias_abc',
  // Circuito 4 A7 CE
  'circuito_4_a7_ce',
  'aulas_7',
  'cah3_torre_enfriamiento',
  'caldera_3',
  'la_dia',
  'aulas_4_sur',
  'aulas_4_maestros',
  'centro_congresos',
  'jubileo',
  'aulas_4_oxxo',
  // Circuito Planta Física
  'circuito_planta_fisica',
  'arquitectura_e1',
  'arquitectura_anexo',
  'megacentral_te_2',
  'escamilla_banos_trabajadores',
  'estadio_banorte',
  'estadio_banorte_te',
  'campus_norte_edificios_ciudad',
  'estadio_azul',
  // Circuito Megacentral
  'circuito_megacentral',
  'megacentral_te_4',
  // Riego PTAR
  'ptar_riego',
  'pozo_4_riego_alt',
  'pozo_8_riego_alt',
  'pozo_15_riego_alt',
  'campus_norte_ciudad_riego',
  'comedor_d_ciudad',
  // Purgas y Evaporación
  'estadio_banorte_purgas',
  'wellness_cisterna_pluvial_purgas',
  'wellness_suavizador_purga',
  'wellness_te_rebosadero',
  'wellness_te_purga',
  'cedes_tinaco_riego_pluvial',
  'megacentral_te_purgas',
  'megacentral_suavizador_purga',
  'cah3_te_purgas',
  'residencias_10_15_te_purga',
  'estadio_borrego_pluvial',
  'ciap_cisterna_pluvial',
  // Agua de Ciudad
  'campo_soft_bol',
  'cedes_ciudad',
  'estacionamiento_e3',
  'guarderia',
  'naranjos',
  'casa_solar',
  'escamilla_banos_alumnos',
  'residencias_11_ciudad',
  'residencias_12_ciudad',
  'residencias_13_1_ciudad',
  'residencias_13_2_ciudad',
  'residencias_13_3_ciudad',
  'residencias_15_sotano',
  'residencias_10_15_purga_no',
  'cdb1_jardineros',
  'edificio_d',
  'estadio_yarda'
];

// Campos para lecturas semanales de GAS
const camposGas = [
  'numero_semana',
  'fecha_inicio',
  'fecha_fin',
  // Acometidas Principales Campus
  'campus_acometida_principal_digital',
  'campus_acometida_principal_analogica',
  // Edificios Culturales
  'domo_cultural',
  // Comedores y Restaurantes
  'comedor_centrales_tec_food',
  'dona_tota',
  'chilaquiles_tec',
  'carls_junior',
  'centrales_local',
  'davilas_grill_team',
  'pizza_little_caesars',
  // Edificios Académicos
  'biotecnologia',
  // Calderas y Sistemas de Calefacción
  'caldera_1_leon',
  'mega_calefaccion_1',
  'mega_calefaccion_2',
  'mega_calefaccion_3',
  'mega_calefaccion_4',
  'mega_calefaccion_5',
  // CIAP y Restaurantes
  'ciap_super_salads',
  // Aulas y Edificios Académicos
  'aulas_1',
  'biblioteca',
  'nikkori',
  'nectar_works',
  'sr_latino',
  // Instalaciones Deportivas
  'arena_borrego',
  // Sistemas de Calefacción Adicionales
  'calefaccion_1_bryan',
  'calefaccion_2_aerco',
  // Calderas
  'caldera_3',
  'aulas_7',
  'la_dia',
  'aulas_4',
  'centro_congresos_vestidores',
  'jubileo',
  // Expedition
  'expedition',
  'bread_expedition',
  'matthew_expedition',
  // Residencias Estudiantiles
  'estudiantes_acometida_principal_digital',
  'estudiantes_acometida_principal_analogico',
  // CEDES
  'cedes',
  'cedes_trabajadores_vestidores',
  'caldera_2',
  'comedor_estudiantes',
  // Residencias
  'residencias_4',
  'residencias_1',
  'residencias_2',
  'residencias_5',
  'residencias_8',
  'residencias_7',
  'residencias_3',
  'residencias_abc_calefaccion',
  'residencias_abc_regaderas',
  'residencias_abc_locales_comida',
  // Campus Norte
  'campus_norte_acometida_externa',
  'campus_norte_acometida_interna',
  'campus_norte_comedor_d',
  'campus_norte_edificio_d_calefaccion',
  // Estadio Borrego
  'estadio_borrego_acometida_digital',
  'estadio_borrego_acometida_analogica',
  'estadio_yarda',
  // Wellness
  'wellness_acometida_digital',
  'wellness_acometida_analogica',
  'wellness_supersalads',
  'wellness_general_calefaccion',
  'wellness_calentador_sotano_regaderas',
  'wellness_alberca',
  // Otros Edificios
  'auditorio_luis_elizondo',
  'pabellon_tec_semillero',
  'pabellon_tec_cocina_estudiantes_2do_piso',
  'guarderia',
  'escamilla',
  'casa_solar',
  'estudiantes_11',
  'estudiantes_12',
  'estudiantes_13',
  'estudiantes_15_y_10',
  'cdb1'
];

// Campos para lecturas diarias de PTAR
const camposPTAR = [
  'fecha',
  'hora',
  'medidor_entrada',
  'medidor_salida',
  'ar', // Agua Residual
  'at', // Agua Tratada
  'recirculacion',
  'total_dia'
];

// ============================================================
// Configuraciones por año y tipo
// ============================================================

export const excelToSqlConfigs = {
  // Agua 2023
  agua_2023: {
    tipo: 'agua',
    año: 2023,
    nombreTabla: 'lecturas_semana2023',
    campos: camposAgua,
    titulo: 'Excel a SQL - Lecturas Semanales de Agua 2023',
    descripcion: 'Convierte datos de lecturas semanales de agua (formato vertical) a sentencias SQL INSERT',
    nombreArchivoSql: 'inserts_lecturas_agua_2023.sql',
    icono: '💧',
    color: 'blue'
  },
  
  // Agua 2024
  agua_2024: {
    tipo: 'agua',
    año: 2024,
    nombreTabla: 'lecturas_semana2024',
    campos: camposAgua,
    titulo: 'Excel a SQL - Lecturas Semanales de Agua 2024',
    descripcion: 'Convierte datos de lecturas semanales de agua (formato vertical) a sentencias SQL INSERT',
    nombreArchivoSql: 'inserts_lecturas_agua_2024.sql',
    icono: '💧',
    color: 'blue'
  },
  
  // Agua 2025
  agua_2025: {
    tipo: 'agua',
    año: 2025,
    nombreTabla: 'lecturas_semana2025',
    campos: camposAgua,
    titulo: 'Excel a SQL - Lecturas Semanales de Agua 2025',
    descripcion: 'Convierte datos de lecturas semanales de agua (formato vertical) a sentencias SQL INSERT',
    nombreArchivoSql: 'inserts_lecturas_agua_2025.sql',
    icono: '💧',
    color: 'blue'
  },
  
  // Gas 2023
  gas_2023: {
    tipo: 'gas',
    año: 2023,
    nombreTabla: 'lecturas_semanales_gas_2023',
    campos: camposGas,
    titulo: 'Excel a SQL - Lecturas Semanales de Gas 2023',
    descripcion: 'Convierte datos de lecturas semanales de gas (formato vertical) a sentencias SQL INSERT',
    nombreArchivoSql: 'inserts_lecturas_gas_2023.sql',
    icono: '🔥',
    color: 'orange'
  },
  
  // Gas 2024
  gas_2024: {
    tipo: 'gas',
    año: 2024,
    nombreTabla: 'lecturas_semanales_gas_2024',
    campos: camposGas,
    titulo: 'Excel a SQL - Lecturas Semanales de Gas 2024',
    descripcion: 'Convierte datos de lecturas semanales de gas (formato vertical) a sentencias SQL INSERT',
    nombreArchivoSql: 'inserts_lecturas_gas_2024.sql',
    icono: '🔥',
    color: 'orange'
  },
  
  // Gas 2025
  gas_2025: {
    tipo: 'gas',
    año: 2025,
    nombreTabla: 'lecturas_semanales_gas_2025',
    campos: camposGas,
    titulo: 'Excel a SQL - Lecturas Semanales de Gas 2025',
    descripcion: 'Convierte datos de lecturas semanales de gas (formato vertical) a sentencias SQL INSERT',
    nombreArchivoSql: 'inserts_lecturas_gas_2025.sql',
    icono: '🔥',
    color: 'orange'
  },

  // PTAR (Planta de Tratamiento de Aguas Residuales)
  ptar: {
    tipo: 'ptar',
    año: 'todos', // Una sola tabla para todos los años
    nombreTabla: 'lecturas_ptar',
    campos: camposPTAR,
    titulo: 'Excel a SQL - Lecturas Diarias PTAR',
    descripcion: 'Convierte datos de lecturas diarias de PTAR (formato horizontal) a sentencias SQL INSERT',
    nombreArchivoSql: 'inserts_ptar_lecturas.sql',
    icono: '♻️',
    color: 'green',
    formato: 'horizontal' // PTAR usa formato horizontal (cada fila es un registro)
  }
};

// Función helper para obtener configuración
export const getConfig = (tipo, año) => {
  // Para PTAR, solo usar el tipo (no tiene año específico)
  if (tipo === 'ptar') {
    return excelToSqlConfigs['ptar'];
  }
  const key = `${tipo}_${año}`;
  return excelToSqlConfigs[key];
};

// Obtener todas las configuraciones de un tipo
export const getConfigsByTipo = (tipo) => {
  return Object.values(excelToSqlConfigs).filter(config => config.tipo === tipo);
};

// Obtener todas las configuraciones de un año
export const getConfigsByAño = (año) => {
  return Object.values(excelToSqlConfigs).filter(config => config.año === año);
};

// Obtener configuración de PTAR
export const getPTARConfig = () => {
  return excelToSqlConfigs['ptar'];
};
