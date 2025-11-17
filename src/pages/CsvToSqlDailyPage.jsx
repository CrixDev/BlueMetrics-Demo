import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { FileSpreadsheet, Database, Download, Upload, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const CsvToSqlDailyPage = () => {
  // Estados
  const [archivo, setArchivo] = useState(null);
  const [nombreTabla, setNombreTabla] = useState('lecturas_diarias');
  const [sqlGenerado, setSqlGenerado] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  
  const fileInputRef = useRef(null);

  // ==================================================
  // Campos de la tabla lecturas_diarias
  // ==================================================
  const camposTabla = [
    'mes_anio',
    'dia_hora',
    'consumo',
    'general_pozos',
    'pozo_3',
    'pozo_8',
    'pozo_15',
    'pozo_4',
    'a_y_d',
    'campus_8',
    'a7_cc',
    'megacentral',
    'planta_fisica',
    'residencias',
    'pozo7',
    'pozo11',
    'pozo_12',
    'pozo_14'
  ];

  // ==================================================
  // Función para limpiar y formatear valores numéricos
  // ==================================================
  const limpiarValorNumerico = (valor) => {
    // Valores null o undefined o string vacío
    if (valor === null || valor === undefined || valor === '') {
      return 'NULL';
    }
    
    // Si es 0 (número), retornar 0
    if (valor === 0) {
      return 0;
    }
    
    // Si es número directo (y no es 0)
    if (typeof valor === 'number') {
      return valor;
    }
    
    // Si es string, limpiar formato
    if (typeof valor === 'string') {
      // Remover comillas
      let valorLimpio = valor.replace(/"/g, '').trim();
      
      // Si después de limpiar está vacío, retornar NULL
      if (valorLimpio === '') {
        return 'NULL';
      }
      
      // Si es "0", retornar 0
      if (valorLimpio === '0') {
        return 0;
      }
      
      // Reemplazar coma por punto (decimal español a SQL)
      valorLimpio = valorLimpio.replace(/,/g, '.');
      
      // Intentar parsear
      const numero = parseFloat(valorLimpio);
      if (!isNaN(numero)) {
        return numero;
      }
    }
    
    return 'NULL';
  };

  // ==================================================
  // Función para formatear valores SQL
  // ==================================================
  const formatearValorSQL = (valor, nombreCampo) => {
    // Campos de texto (mes_anio, dia_hora)
    if (nombreCampo === 'mes_anio' || nombreCampo === 'dia_hora') {
      if (!valor || valor === '') {
        return 'NULL';
      }
      const valorEscapado = String(valor).replace(/'/g, "''");
      return `'${valorEscapado}'`;
    }
    
    // Campos numéricos (todos los demás)
    return limpiarValorNumerico(valor);
  };

  // ==================================================
  // Manejar selección de archivo
  // ==================================================
  const manejarArchivoSeleccionado = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'csv' && extension !== 'xlsx' && extension !== 'xls') {
        setError('Por favor selecciona un archivo CSV o Excel válido');
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
  // Procesar archivo (LECTURA HORIZONTAL - cada fila es un registro)
  // ==================================================
  const procesarArchivo = async () => {
    if (!archivo) {
      setError('Por favor selecciona un archivo');
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
      // Leer el archivo
      const buffer = await archivo.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Obtener la primera hoja
      const nombreHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombreHoja];
      
      // Convertir a JSON (con encabezados automáticos)
      const datos = XLSX.utils.sheet_to_json(hoja, { header: 'A', defval: null });
      
      if (datos.length === 0) {
        throw new Error('El archivo está vacío');
      }

      // ==================================================
      // LECTURA HORIZONTAL: Cada FILA es un registro
      // ==================================================
      const todosLosValores = [];
      let filasProcesadas = 0;
      
      for (let i = 1; i < datos.length; i++) { // Empezar en 1 para saltar header
        const fila = datos[i];
        
        // Obtener valores de las primeras 18 columnas (A hasta R)
        const mes_anio = fila.A;
        const dia_hora = fila.B;
        
        // Validar que tenga datos básicos
        if (!mes_anio || !dia_hora || mes_anio === 'Fecha') {
          continue; // Saltar filas vacías o el header repetido
        }
        
        // Extraer todos los valores en orden
        const valores = [
          formatearValorSQL(fila.A, 'mes_anio'),       // mes_anio
          formatearValorSQL(fila.B, 'dia_hora'),       // dia_hora
          formatearValorSQL(fila.C, 'consumo'),        // consumo
          formatearValorSQL(fila.D, 'general_pozos'),  // general_pozos
          formatearValorSQL(fila.E, 'pozo_3'),         // pozo_3
          formatearValorSQL(fila.F, 'pozo_8'),         // pozo_8
          formatearValorSQL(fila.G, 'pozo_15'),        // pozo_15
          formatearValorSQL(fila.H, 'pozo_4'),         // pozo_4
          formatearValorSQL(fila.I, 'a_y_d'),          // a_y_d
          formatearValorSQL(fila.J, 'campus_8'),       // campus_8
          formatearValorSQL(fila.K, 'a7_cc'),          // a7_cc
          formatearValorSQL(fila.L, 'megacentral'),    // megacentral
          formatearValorSQL(fila.M, 'planta_fisica'),  // planta_fisica
          formatearValorSQL(fila.N, 'residencias'),    // residencias
          formatearValorSQL(fila.O, 'pozo7'),          // pozo7
          formatearValorSQL(fila.P, 'pozo11'),         // pozo11
          formatearValorSQL(fila.Q, 'pozo_12'),        // pozo_12
          formatearValorSQL(fila.R, 'pozo_14')         // pozo_14
        ];
        
        todosLosValores.push(valores);
        filasProcesadas++;
      }
      
      if (todosLosValores.length === 0) {
        throw new Error('No se encontraron datos válidos para procesar');
      }
      
      // ==================================================
      // Construir UN SOLO INSERT con múltiples VALUES
      // ==================================================
      const columnasStr = camposTabla.join(', ');
      
      // Generar cada fila de VALUES
      const valuesFilas = todosLosValores.map(valores => {
        const valoresStr = valores.join(', ');
        return `  (${valoresStr})`;
      });
      
      // Unir todas las filas con comas
      const todosLosValuesStr = valuesFilas.join(',\n');
      
      // Construir la sentencia SQL completa
      const sqlFinal = `-- INSERT para tabla ${nombreTabla.trim()}
-- Total de registros: ${filasProcesadas}
-- Generado automáticamente

BEGIN;

INSERT INTO public.${nombreTabla.trim()} (
  ${columnasStr}
) VALUES
${todosLosValuesStr};

COMMIT;`;
      
      // Actualizar estado con resultados
      setSqlGenerado(sqlFinal);
      setEstadisticas({
        totalRegistros: filasProcesadas,
        totalCampos: camposTabla.length,
        nombreHoja: nombreHoja
      });
      setExito(`✅ Se generó 1 INSERT con ${filasProcesadas} registros`);
      
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
    
    const blob = new Blob([sqlGenerado], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inserts_lecturas_diarias.sql';
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
        setExito(`✅ Se generó 1 INSERT con ${estadisticas?.totalRegistros || 0} registros`);
      }, 3000);
    } catch (err) {
      setError('❌ Error al copiar al portapapeles');
    }
  };

  // ==================================================
  // Renderizado del componente
  // ==================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileSpreadsheet className="w-12 h-12 text-blue-600" />
            <Database className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            CSV a SQL - Lecturas Diarias
          </h1>
          <p className="text-gray-600">
            Convierte datos de lecturas diarias (formato horizontal) a sentencias SQL INSERT
          </p>
        </div>

        {/* Información importante */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">📋 Formato esperado del CSV:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Fila 1</strong>: Encabezados (mes año, dia hora, Consumo, etc.)</li>
                <li><strong>Filas 2+</strong>: Cada fila representa un registro/lectura diaria</li>
                <li><strong>Columnas</strong>: 18 campos ({camposTabla.length} en total)</li>
                <li>Se generará <strong>UN SOLO INSERT</strong> con múltiples VALUES</li>
                <li>Los valores numéricos con coma se convertirán automáticamente a formato SQL (punto decimal)</li>
              </ul>
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
                Archivo CSV / Excel
              </label>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Seleccionar archivo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
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
                placeholder="lecturas_diarias"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Por defecto: public.lecturas_diarias
              </p>
            </div>
            
            {/* Botón procesar */}
            <button
              onClick={procesarArchivo}
              disabled={procesando || !archivo}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">📊 Estadísticas</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Hoja:</strong> {estadisticas.nombreHoja}</p>
                  <p><strong>Registros procesados:</strong> {estadisticas.totalRegistros}</p>
                  <p><strong>Campos por registro:</strong> {estadisticas.totalCampos}</p>
                  <p className="text-xs mt-2 text-blue-700 bg-blue-100 px-2 py-1 rounded">
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
                  <p className="text-xs mt-2">Selecciona un archivo y haz clic en Generar SQL</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default CsvToSqlDailyPage;
