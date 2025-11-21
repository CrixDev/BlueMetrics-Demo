/**
 * Utilidad para obtener el nombre de la tabla de lecturas semanales según el año
 * @param {string|number} year - Año (ej: '2024', '2025', 2024, 2025)
 * @returns {string} - Nombre de la tabla (ej: 'lecturas_semana2024', 'lecturas_semana')
 */
export const getTableNameByYear = (year) => {
  const yearStr = year.toString()
  
  // Por defecto, 2025 usa 'lecturas_semana' (sin sufijo)
  if (yearStr === '2025') {
    return 'lecturas_semana'
  }
  
  // Otros años usan 'lecturas_semana' + año
  return `lecturas_semana${yearStr}`
}

/**
 * Utilidad para obtener el nombre de la tabla de lecturas semanales de GAS según el año
 * @param {string|number} year - Año (ej: '2024', '2025', 2024, 2025)
 * @returns {string} - Nombre de la tabla (ej: 'lecturas_semanales_gas_2024', 'lecturas_semanales_gas_2025')
 */
export const getGasTableNameByYear = (year) => {
  const yearStr = year.toString()
  
  // Para gas, todas las tablas incluyen el año en el nombre
  return `lecturas_semanales_gas_${yearStr}`
}

/**
 * Lista de años disponibles en el sistema
 */
export const AVAILABLE_YEARS = ['2023', '2024', '2025']

/**
 * Año por defecto (el más reciente)
 */
export const DEFAULT_YEAR = '2025'
