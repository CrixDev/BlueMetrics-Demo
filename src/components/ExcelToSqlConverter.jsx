import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Database, Download, Upload, AlertCircle, CheckCircle2, Info, CloudUpload } from 'lucide-react';
import { supabase } from '../supabaseClient';

/**
 * Componente reutilizable para convertir archivos Excel a SQL INSERT statements
 * @param {Object} config - Configuración del conversor
 * @param {string} config.tipo - Tipo de lectura (agua/gas/ptar)
 * @param {number|string} config.año - Año de las lecturas
 * @param {string} config.nombreTabla - Nombre de la tabla destino
 * @param {Array<string>} config.campos - Lista de campos en el orden exacto
 * @param {string} config.titulo - Título de la página
 * @param {string} config.descripcion - Descripción de la funcionalidad
 * @param {string} config.nombreArchivoSql - Nombre del archivo SQL a descargar
 * @param {string} config.icono - Emoji o icono del tipo
 * @param {string} config.color - Color del tema (blue/orange/green)
 * @param {string} config.formato - Formato del Excel: 'vertical' o 'horizontal' (default: 'vertical')
 */
const ExcelToSqlConverter = ({ config }) => {
  // Estados
  const [archivo, setArchivo] = useState(null);
  const [nombreTabla, setNombreTabla] = useState(config.nombreTabla);
  const [sqlGenerado, setSqlGenerado] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [insertando, setInsertando] = useState(false);
  const [datosParaInsertar, setDatosParaInsertar] = useState(null);
  
  const fileInputRef = useRef(null);

  // Obtener colores según el tipo
  const getColors = () => {
    const colorSchemes = {
      blue: {
        gradient: 'from-blue-50 via-white to-indigo-50',
        primary: 'blue-600',
        primaryHover: 'blue-700',
        secondary: 'indigo-600',
        secondaryHover: 'indigo-700',
        border: 'blue-600',
        bg: 'blue-50',
        text: 'blue-900'
      },
      orange: {
        gradient: 'from-orange-50 via-white to-red-50',
        primary: 'orange-600',
        primaryHover: 'orange-700',
        secondary: 'red-600',
        secondaryHover: 'red-700',
        border: 'orange-600',
        bg: 'orange-50',
        text: 'orange-900'
      },
      green: {
        gradient: 'from-green-50 via-white to-emerald-50',
        primary: 'green-600',
        primaryHover: 'green-700',
        secondary: 'emerald-600',
        secondaryHover: 'emerald-700',
        border: 'green-600',
        bg: 'green-50',
        text: 'green-900'
      }
    };
    return colorSchemes[config.color] || colorSchemes.blue;
  };

  const colors = getColors();

  // ==================================================
  // Función para formatear valores SQL
  // ==================================================
  const formatearValorSQL = (valor, nombreCampo) => {
    // Null o vacío
    if (valor === null || valor === undefined || valor === '') {
      return 'NULL';
    }
    
    // Fechas (campos que contienen 'fecha')
    if (nombreCampo.includes('fecha')) {
      if (typeof valor === 'string') {
        return `'${valor}'`;
      }
      // Si es un número de Excel, convertirlo a fecha
      if (typeof valor === 'number') {
        const fecha = XLSX.SSF.parse_date_code(valor);
        const fechaStr = `${fecha.y}-${String(fecha.m).padStart(2, '0')}-${String(fecha.d).padStart(2, '0')}`;
        return `'${fechaStr}'`;
      }
    }
    
    // Números
    if (typeof valor === 'number') {
      return valor;
    }
    
    // Cadenas de texto
    if (typeof valor === 'string') {
      const valorEscapado = valor.replace(/'/g, "''");
      return `'${valorEscapado}'`;
    }
    
    // Otros tipos
    const valorString = String(valor).replace(/'/g, "''");
    return `'${valorString}'`;
  };

  // ==================================================
  // Manejar selección de archivo
  // ==================================================
  const manejarArchivoSeleccionado = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'xlsx' && extension !== 'xls') {
        setError('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
        setArchivo(null);
        return;
      }
      
      setArchivo(file);
      setError('');
      setExito('');
      setSqlGenerado('');
      setEstadisticas(null);
    }
  };

  // ==================================================
  // Procesar archivo Excel (LECTURA VERTICAL)
  // ==================================================
  const procesarExcel = async () => {
    if (!archivo) {
      setError('Por favor selecciona un archivo Excel');
      return;
    }
    
    if (!nombreTabla.trim()) {
      setError('Por favor ingresa el nombre de la tabla');
      return;
    }
    
    setError('');
    setExito('');
    setProcesando(true);
    
    try {
      // Leer el archivo Excel
      const buffer = await archivo.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Obtener la primera hoja
      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];
      
      // Convertir a JSON (con encabezados en la primera columna)
      const datos = XLSX.utils.sheet_to_json(hoja, { header: 1, defval: null });
      
      if (datos.length === 0) {
        throw new Error('El archivo Excel está vacío');
      }

      // Determinar formato (vertical u horizontal)
      const formato = config.formato || 'vertical';
      
      if (formato === 'horizontal') {
        // ==================================================
        // LECTURA HORIZONTAL: Cada FILA es un registro
        // ==================================================
        const totalFilas = datos.length;
        
        if (totalFilas < 2) {
          throw new Error('El archivo debe tener al menos 2 filas (encabezados + datos)');
        }
        
        // La primera fila contiene los encabezados (nombres de columnas)
        const encabezados = datos[0];
        
        // Procesar cada fila de datos (desde la fila 1 en adelante, saltando encabezado)
        const todosLosValores = [];
        
        for (let row = 1; row < totalFilas; row++) {
          const fila = datos[row];
          
          // Saltar filas vacías
          if (!fila || fila.every(cell => cell === null || cell === undefined || cell === '')) {
            continue;
          }
          
          const valores = [];
          
          // Iterar por cada campo en la configuración
          for (let i = 0; i < config.campos.length; i++) {
            const nombreCampo = config.campos[i];
            const valor = fila[i];
            const valorFormateado = formatearValorSQL(valor, nombreCampo);
            valores.push(valorFormateado);
          }
          
          todosLosValores.push(valores);
        }
        
        if (todosLosValores.length === 0) {
          throw new Error('No se encontraron datos válidos en el archivo');
        }
        
        // Construir sentencias INSERT individuales con ON CONFLICT
        const insertStatements = todosLosValores.map((valores, index) => {
          const columnasStr = config.campos.join(', ');
          const valoresStr = valores.join(', ');
          
          // Para PTAR, usar ON CONFLICT en fecha
          if (config.tipo === 'ptar') {
            return `INSERT INTO public.${nombreTabla.trim()} (${columnasStr})
VALUES (${valoresStr})
ON CONFLICT (fecha) DO UPDATE SET
    ${config.campos.filter(c => c !== 'fecha').map(c => `${c} = EXCLUDED.${c}`).join(',\n    ')};`;
          } else {
            return `INSERT INTO public.${nombreTabla.trim()} (${columnasStr})
VALUES (${valoresStr});`;
          }
        });
        
        // Unir todos los INSERTs con saltos de línea
        const sqlFinal = `-- Generado automáticamente\nBEGIN;\n\n${insertStatements.join('\n\n')}\n\nCOMMIT;`;
        
        // Preparar datos para inserción en DB
        const datosDB = todosLosValores.map(valores => {
          const registro = {};
          config.campos.forEach((campo, index) => {
            registro[campo] = convertirValorParaDB(valores[index], campo);
          });
          return registro;
        });
        
        // Actualizar estado con resultados
        setSqlGenerado(sqlFinal);
        setDatosParaInsertar(datosDB);
        setEstadisticas({
          totalRegistros: todosLosValores.length,
          totalCampos: config.campos.length,
          nombreHoja: nombreHoja
        });
        setExito(`✅ Se generaron ${todosLosValores.length} sentencias INSERT`);
        
      } else {
        // ==================================================
        // LECTURA VERTICAL: Cada COLUMNA es un registro
        // ==================================================
        const totalColumnas = datos[0]?.length || 0;
        
        if (totalColumnas < 2) {
          throw new Error('El archivo debe tener al menos 2 columnas (nombres + datos)');
        }
        
        // Procesar cada columna de datos (desde la columna 1 en adelante)
        const todosLosValores = []; // Array para almacenar todos los VALUES
        const columnasConDatos = totalColumnas - 1; // Excluir la primera columna de nombres
        
        for (let col = 1; col < totalColumnas; col++) {
          // Extraer los valores de esta columna
          const valores = [];
          
          // Solo iterar hasta la cantidad de campos definidos en la configuración
          const maxFilas = Math.min(datos.length, config.campos.length);
          
          for (let row = 0; row < maxFilas; row++) {
            const valor = datos[row][col];
            const nombreCampo = config.campos[row];
            const valorFormateado = formatearValorSQL(valor, nombreCampo);
            valores.push(valorFormateado);
          }
          
          // Agregar este conjunto de valores al array principal
          todosLosValores.push(valores);
        }
        
        // ==================================================
        // Construir UN SOLO INSERT con múltiples VALUES
        // ==================================================
        const maxFilas = Math.min(datos.length, config.campos.length);
        const columnasStr = config.campos.slice(0, maxFilas).join(',\n    ');
        
        // Generar cada fila de VALUES
        const valuesFilas = todosLosValores.map(valores => {
          const valoresStr = valores.join(',\n    ');
          return `(\n    ${valoresStr}\n)`;
        });
        
        // Unir todas las filas con comas
        const todosLosValuesStr = valuesFilas.join(',\n');
        
        // Construir la sentencia SQL completa
        const sqlFinal = `INSERT INTO public.${nombreTabla.trim()} (\n    ${columnasStr}\n) VALUES \n${todosLosValuesStr};`;
        
        // Preparar datos para inserción en DB (formato vertical)
        const datosDB = todosLosValores.map(valores => {
          const registro = {};
          config.campos.slice(0, maxFilas).forEach((campo, index) => {
            registro[campo] = convertirValorParaDB(valores[index], campo);
          });
          return registro;
        });
        
        // Actualizar estado con resultados
        setSqlGenerado(sqlFinal);
        setDatosParaInsertar(datosDB);
        setEstadisticas({
          totalRegistros: columnasConDatos,
          totalCampos: datos.length,
          nombreHoja: nombreHoja
        });
        setExito(`✅ Se generó 1 INSERT con ${columnasConDatos} registros (semanas)`);
      }
      
    } catch (err) {
      setError(`❌ Error al procesar el archivo: ${err.message}`);
      setSqlGenerado('');
      setEstadisticas(null);
    } finally {
      setProcesando(false);
    }
  };

  // ==================================================
  // Descargar archivo SQL
  // ==================================================
  const descargarSQL = () => {
    if (!sqlGenerado) return;
    
    const blob = new Blob([sqlGenerado], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = config.nombreArchivoSql;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ==================================================
  // Copiar al portapapeles
  // ==================================================
  const copiarAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(sqlGenerado);
      setExito('✅ SQL copiado al portapapeles');
      setTimeout(() => {
        if (!sqlGenerado) return;
        setExito(`✅ Se generó 1 INSERT con ${estadisticas?.totalRegistros || 0} registros (semanas)`);
      }, 3000);
    } catch (err) {
      setError('❌ Error al copiar al portapapeles');
    }
  };

  // ==================================================
  // Función para convertir valores SQL a valores JS
  // ==================================================
  const convertirValorParaDB = (valorSQL, nombreCampo) => {
    // Si es NULL, retornar null
    if (valorSQL === 'NULL') {
      return null;
    }
    
    // Si es un string con comillas, quitarlas
    if (typeof valorSQL === 'string' && valorSQL.startsWith("'") && valorSQL.endsWith("'")) {
      const valor = valorSQL.slice(1, -1).replace(/''/g, "'");
      
      // Si es una fecha, convertir a formato ISO
      if (nombreCampo.includes('fecha')) {
        return valor;
      }
      
      return valor;
    }
    
    // Si es un número, retornarlo como está
    return valorSQL;
  };

  // ==================================================
  // Insertar datos en la base de datos usando función RPC
  // ==================================================
  const insertarEnDB = async () => {
    if (!datosParaInsertar || datosParaInsertar.length === 0) {
      setError('No hay datos para insertar. Primero genera el SQL.');
      return;
    }
    
    setError('');
    setExito('');
    setInsertando(true);
    
    try {
      const tableName = nombreTabla.trim();
      const BATCH_SIZE = 50; // Lotes más pequeños para evitar timeouts
      let totalInsertados = 0;
      
      console.log('🔍 Insertando en tabla:', tableName);
      console.log('📊 Total de registros:', datosParaInsertar.length);
      
      for (let i = 0; i < datosParaInsertar.length; i += BATCH_SIZE) {
        const lote = datosParaInsertar.slice(i, i + BATCH_SIZE);
        
        // Usar función RPC para insertar datos
        // Esta función debe estar creada en Supabase
        const { data, error: rpcError } = await supabase.rpc('insert_bulk_data', {
          p_table_name: tableName,
          p_data: lote
        });
        
        if (rpcError) {
          console.error('❌ Error RPC:', rpcError);
          
          // Si la función RPC no existe, intentar método alternativo
          if (rpcError.code === 'PGRST202' || rpcError.message.includes('function')) {
            console.log('⚠️ Función RPC no encontrada, intentando método directo...');
            
            // Intentar inserción directa
            const { data: directData, error: directError } = await supabase
              .from(tableName)
              .insert(lote);
            
            if (directError) {
              throw new Error(`Error al insertar: ${directError.message}`);
            }
          } else {
            throw new Error(`Error RPC: ${rpcError.message}`);
          }
        }
        
        totalInsertados += lote.length;
        
        // Actualizar progreso
        setExito(`⏳ Insertando... ${totalInsertados} de ${datosParaInsertar.length} registros`);
        
        // Pequeña pausa entre lotes para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setExito(`✅ Se insertaron ${totalInsertados} registros exitosamente en la tabla "${tableName}"`);
      
    } catch (err) {
      console.error('❌ Error al insertar en DB:', err);
      
      let errorMsg = `❌ Error al insertar en la base de datos:\n\n${err.message}\n\n`;
      
      if (err.message.includes('schema cache') || err.message.includes('function')) {
        errorMsg += `🔧 CONFIGURACIÓN NECESARIA:\n\n`;
        errorMsg += `Para que los clientes puedan subir archivos Excel automáticamente,\n`;
        errorMsg += `necesitas ejecutar este SQL en Supabase (solo una vez):\n\n`;
        errorMsg += `──────────────────────────────────────────────────\n\n`;
        errorMsg += `-- 1. Crear función para inserción masiva\n`;
        errorMsg += `CREATE OR REPLACE FUNCTION insert_bulk_data(\n`;
        errorMsg += `  p_table_name TEXT,\n`;
        errorMsg += `  p_data JSONB\n`;
        errorMsg += `) RETURNS void AS $$\n`;
        errorMsg += `DECLARE\n`;
        errorMsg += `  rec JSONB;\n`;
        errorMsg += `BEGIN\n`;
        errorMsg += `  FOR rec IN SELECT * FROM jsonb_array_elements(p_data)\n`;
        errorMsg += `  LOOP\n`;
        errorMsg += `    EXECUTE format(\n`;
        errorMsg += `      'INSERT INTO %I SELECT * FROM jsonb_populate_record(NULL::%I, $1)',\n`;
        errorMsg += `      p_table_name, p_table_name\n`;
        errorMsg += `    ) USING rec;\n`;
        errorMsg += `  END LOOP;\n`;
        errorMsg += `END;\n`;
        errorMsg += `$$ LANGUAGE plpgsql SECURITY DEFINER;\n\n`;
        errorMsg += `-- 2. Dar permisos a usuarios autenticados\n`;
        errorMsg += `GRANT EXECUTE ON FUNCTION insert_bulk_data(TEXT, JSONB) TO authenticated;\n\n`;
        errorMsg += `──────────────────────────────────────────────────\n\n`;
        errorMsg += `📋 Copia este código y ejecútalo en el SQL Editor de Supabase.\n`;
        errorMsg += `Después, los clientes podrán subir archivos sin problemas.`;
      }
      
      setError(errorMsg);
    } finally {
      setInsertando(false);
    }
  };

  // ==================================================
  // Renderizado del componente
  // ==================================================
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient}`}>
      <div className="container mx-auto px-4 py-8">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileSpreadsheet className={`w-12 h-12 text-${colors.primary}`} />
            <Database className={`w-12 h-12 text-${colors.secondary}`} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {config.icono} {config.titulo}
          </h1>
          <p className="text-gray-600">
            {config.descripcion}
          </p>
        </div>

        {/* Información importante */}
        <div className={`mb-6 bg-${colors.bg} border-l-4 border-${colors.border} p-4 rounded-r-lg`}>
          <div className="flex items-start gap-3">
            <Info className={`w-5 h-5 text-${colors.border} flex-shrink-0 mt-0.5`} />
            <div className={`text-sm text-${colors.text}`}>
              <p className="font-semibold mb-1">📋 Formato esperado del Excel:</p>
              {(config.formato === 'horizontal') ? (
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Fila 1</strong>: Encabezados de las columnas ({config.campos.join(', ')})</li>
                  <li><strong>Filas 2, 3, 4...</strong>: Cada fila representa un registro diferente</li>
                  <li>Se generarán <strong>múltiples INSERTs</strong> (uno por fila)</li>
                  <li>Cada INSERT tendrá {config.campos.length} campos</li>
                  {config.tipo === 'ptar' && <li><strong>ON CONFLICT</strong>: Si la fecha ya existe, se actualizarán los valores</li>}
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Columna A</strong>: Nombres de los campos (numero_semana, fecha_inicio, etc.)</li>
                  <li><strong>Columnas B, C, D...</strong>: Cada columna representa una semana diferente</li>
                  <li>Se generará <strong>UN SOLO INSERT</strong> con múltiples VALUES (uno por columna)</li>
                  <li>Cada conjunto de VALUES tendrá {config.campos.length} campos</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Panel izquierdo: Entrada de datos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              📋 Configuración
            </h2>
            
            {/* Seleccionar archivo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Archivo Excel
              </label>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center justify-center gap-2 px-4 py-3 bg-${colors.primary} text-white rounded-lg hover:bg-${colors.primaryHover} transition-colors`}
                >
                  <Upload className="w-5 h-5" />
                  Seleccionar archivo Excel
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={manejarArchivoSeleccionado}
                  className="hidden"
                />
                {archivo && (
                  <div className="px-3 py-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                    ✓ {archivo.name}
                  </div>
                )}
              </div>
            </div>
            
            {/* Nombre de la tabla */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la tabla
              </label>
              <input
                type="text"
                value={nombreTabla}
                onChange={(e) => setNombreTabla(e.target.value)}
                placeholder={config.nombreTabla}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${colors.primary} focus:border-transparent`}
              />
              <p className="mt-1 text-xs text-gray-500">
                Por defecto: public.{config.nombreTabla}
              </p>
            </div>
            
            {/* Botón procesar */}
            <button
              onClick={procesarExcel}
              disabled={procesando || !archivo}
              className={`w-full py-3 bg-${colors.secondary} text-white rounded-lg font-semibold hover:bg-${colors.secondaryHover} transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {procesando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>⚡ Generar SQL</>
              )}
            </button>
            
            {/* Botón insertar en DB */}
            {sqlGenerado && (
              <button
                onClick={insertarEnDB}
                disabled={insertando || !datosParaInsertar}
                className="w-full mt-3 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {insertando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Insertando...
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-5 h-5" />
                    Insertar en Base de Datos
                  </>
                )}
              </button>
            )}
            
            {/* Mensajes */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
            
            {exito && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-green-800 text-sm">{exito}</p>
              </div>
            )}
            
            {/* Estadísticas */}
            {estadisticas && (
              <div className={`mt-6 p-4 bg-${colors.bg} border border-${colors.border} rounded-lg`}>
                <h3 className={`font-semibold text-${colors.text} mb-3`}>📊 Estadísticas</h3>
                <div className={`space-y-2 text-sm text-${colors.text}`}>
                  <p><strong>Hoja:</strong> {estadisticas.nombreHoja}</p>
                  <p><strong>Registros (semanas):</strong> {estadisticas.totalRegistros}</p>
                  <p><strong>Campos por registro:</strong> {estadisticas.totalCampos}</p>
                  <p className={`text-xs mt-2 bg-${colors.bg} px-2 py-1 rounded border border-${colors.border}`}>
                    ✓ 1 INSERT con {estadisticas.totalRegistros} VALUES
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Panel derecho: Resultado */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                🎯 Resultado SQL
              </h2>
              {sqlGenerado && (
                <div className="flex gap-2">
                  <button
                    onClick={copiarAlPortapapeles}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    title="Copiar al portapapeles"
                  >
                    📋 Copiar
                  </button>
                  <button
                    onClick={descargarSQL}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    title="Descargar archivo SQL"
                  >
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                </div>
              )}
            </div>
            
            {sqlGenerado ? (
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[600px]">
                <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap break-words">
                  {sqlGenerado}
                </pre>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center text-gray-400">
                  <Database className="w-16 h-16 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">El código SQL aparecerá aquí</p>
                  <p className="text-xs mt-2">Selecciona un archivo Excel y haz clic en Generar SQL</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default ExcelToSqlConverter;
