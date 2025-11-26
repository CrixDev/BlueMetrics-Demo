// Definición de roles y sus permisos
export const ROLES = {
  ADMIN: 'admin',
  WATER: 'water',
  GAS: 'gas',
  PTAR: 'ptar',
  USER: 'user',
};

// Permisos por rol
export const PERMISSIONS = {
  // Admin tiene acceso a todo
  admin: {
    water: true,
    gas: true,
    ptar: true,
    alerts: true,
    predictions: true,
    analysis: true,
    contact: true,
    addData: true,
    correos: true,
    excelToSql: true,
    dashboard: true,
  },
  
  // Water solo gestión hídrica específica
  water: {
    water: true,        // Consumo de agua, pozos, lecturas diarias
    gas: false,
    ptar: true,         // Puede ver PTAR
    alerts: false,      // NO puede ver alertas
    predictions: false, // NO puede ver predicciones
    analysis: false,    // NO puede ver análisis
    contact: false,     // NO puede ver contacto
    addData: false,     // No puede agregar datos
    correos: false,
    excelToSql: false,
    dashboard: false,   // NO puede ver dashboard
  },
  
  // Gas solo gestión de gas
  gas: {
    water: false,
    gas: true,          // Solo consumo de gas
    ptar: false,
    alerts: true,       // Puede ver alertas de gas
    predictions: true,  // Puede ver predicciones de gas
    analysis: true,     // Puede ver análisis de gas
    contact: true,
    addData: false,
    correos: false,
    excelToSql: false,
    dashboard: true,
  },
  
  // PTAR solo planta de tratamiento
  ptar: {
    water: false,
    gas: false,
    ptar: true,         // Solo PTAR
    alerts: true,
    predictions: false,
    analysis: true,
    contact: true,
    addData: false,
    correos: false,
    excelToSql: false,
    dashboard: true,
  },
  
  // User básico - solo lectura
  user: {
    water: true,
    gas: true,
    ptar: true,
    alerts: true,
    predictions: true,
    analysis: true,
    contact: true,
    addData: false,
    correos: false,
    excelToSql: false,
    dashboard: true,
  },
};

// Función para verificar si un rol tiene permiso
export const hasPermission = (role, permission) => {
  if (!role || !PERMISSIONS[role]) {
    return false;
  }
  return PERMISSIONS[role][permission] === true;
};

// Función para obtener todos los permisos de un rol
export const getRolePermissions = (role) => {
  return PERMISSIONS[role] || PERMISSIONS.user;
};
