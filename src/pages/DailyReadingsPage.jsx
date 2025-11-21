import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { DashboardHeader } from "../components/dashboard-header";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import { RedirectIfNotAuth } from '../components/RedirectIfNotAuth';
import MetricCard from '../components/MetricCard';
import AdvancedConsumptionChart from '../components/AdvancedConsumptionChart';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Droplet, TrendingUp, Calendar, Filter, Download, 
  RefreshCw, AlertCircle, Loader2, ChevronLeft, ChevronRight,
  Activity, BarChart3, ArrowUpDown, Percent
} from 'lucide-react';

const DailyReadingsPage = () => {
  // Estados
  const [lecturas, setLecturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroMes, setFiltroMes] = useState('todos');
  const [filtroPunto, setFiltroPunto] = useState('consumo');
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 20;

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  // Configuración de puntos de medición
  const puntosDisponibles = [
    { value: 'consumo', label: 'Consumo Total', field: 'consumo' },
    { value: 'general_pozos', label: 'General Pozos', field: 'general_pozos' },
    { value: 'pozo_3', label: 'Pozo 3', field: 'pozo_3' },
    { value: 'pozo_8', label: 'Pozo 8', field: 'pozo_8' },
    { value: 'pozo_15', label: 'Pozo 15', field: 'pozo_15' },
    { value: 'pozo_4', label: 'Pozo 4', field: 'pozo_4' },
    { value: 'pozo7', label: 'Pozo 7', field: 'pozo7' },
    { value: 'pozo11', label: 'Pozo 11', field: 'pozo11' },
    { value: 'pozo_12', label: 'Pozo 12', field: 'pozo_12' },
    { value: 'pozo_14', label: 'Pozo 14', field: 'pozo_14' },
    { value: 'campus_8', label: 'Campus 8', field: 'campus_8' },
    { value: 'a7_cc', label: 'A7-CC', field: 'a7_cc' },
    { value: 'megacentral', label: 'Megacentral', field: 'megacentral' },
    { value: 'planta_fisica', label: 'Planta Física', field: 'planta_fisica' },
    { value: 'residencias', label: 'Residencias', field: 'residencias' },
    { value: 'a_y_d', label: 'A y D', field: 'a_y_d' }
  ];

  // Obtener datos de Supabase
  useEffect(() => {
    fetchLecturas();
  }, []);

  const fetchLecturas = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('lecturas_diarias')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setLecturas(data || []);
    } catch (err) {
      console.error('Error fetching lecturas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener meses únicos para filtro
  const mesesUnicos = useMemo(() => {
    const meses = [...new Set(lecturas.map(l => l.mes_anio))];
    return meses.filter(Boolean);
  }, [lecturas]);

  // Filtrar lecturas por mes
  const lecturasFiltradas = useMemo(() => {
    if (filtroMes === 'todos') return lecturas;
    return lecturas.filter(l => l.mes_anio === filtroMes);
  }, [lecturas, filtroMes]);

  // Paginación
  const totalPaginas = Math.ceil(lecturasFiltradas.length / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const lecturasPaginadas = lecturasFiltradas.slice(indiceInicio, indiceFin);

  // Estadísticas generales
  const estadisticas = useMemo(() => {
    if (lecturasFiltradas.length === 0) return null;

    const consumoTotal = lecturasFiltradas.reduce((sum, l) => sum + (parseFloat(l.consumo) || 0), 0);
    const consumoPromedio = consumoTotal / lecturasFiltradas.length;
    const consumoMax = Math.max(...lecturasFiltradas.map(l => parseFloat(l.consumo) || 0));
    const consumoMin = Math.min(...lecturasFiltradas.filter(l => l.consumo > 0).map(l => parseFloat(l.consumo) || 0));

    return {
      totalRegistros: lecturasFiltradas.length,
      consumoTotal: consumoTotal.toFixed(2),
      consumoPromedio: consumoPromedio.toFixed(2),
      consumoMax: consumoMax.toFixed(2),
      consumoMin: consumoMin.toFixed(2)
    };
  }, [lecturasFiltradas]);

  // Métricas del punto seleccionado
  const metricasPunto = useMemo(() => {
    if (lecturasFiltradas.length === 0) return null;

    const puntoConfig = puntosDisponibles.find(p => p.value === filtroPunto);
    if (!puntoConfig) return null;

    const field = puntoConfig.field;
    
    // Lectura actual (más reciente)
    const lecturaActual = parseFloat(lecturasFiltradas[0]?.[field]) || 0;
    
    // Consumo actual (promedio de últimos 7 días)
    const ultimos7Dias = lecturasFiltradas.slice(0, 7);
    const consumoActual = ultimos7Dias.reduce((sum, l) => sum + (parseFloat(l[field]) || 0), 0) / ultimos7Dias.length;
    
    // Consumo semana anterior (días 8-14)
    const semanaAnterior = lecturasFiltradas.slice(7, 14);
    const consumoSemanaAnterior = semanaAnterior.length > 0 
      ? semanaAnterior.reduce((sum, l) => sum + (parseFloat(l[field]) || 0), 0) / semanaAnterior.length 
      : consumoActual;
    
    // Comparación vs semana anterior
    const vsSemanaPorcentaje = consumoSemanaAnterior > 0 
      ? ((consumoActual - consumoSemanaAnterior) / consumoSemanaAnterior * 100)
      : 0;
    
    // Ahorro/Incremento respecto al promedio total
    const promedioTotal = lecturasFiltradas.reduce((sum, l) => sum + (parseFloat(l[field]) || 0), 0) / lecturasFiltradas.length;
    const ahorroPorcentaje = promedioTotal > 0 
      ? ((consumoActual - promedioTotal) / promedioTotal * 100)
      : 0;

    return {
      lecturaActual: lecturaActual.toFixed(1),
      consumoActual: consumoActual.toFixed(1),
      vsSemanaPorcentaje: vsSemanaPorcentaje.toFixed(0),
      ahorroPorcentaje: ahorroPorcentaje.toFixed(0),
      puntoLabel: puntoConfig.label
    };
  }, [lecturasFiltradas, filtroPunto, puntosDisponibles]);

  // Datos para gráfico de consumo diario (últimos 30 registros)
  const datosConsumo = useMemo(() => {
    return lecturasFiltradas.slice(0, 30).reverse().map(lectura => ({
      fecha: lectura.dia_hora,
      consumo: parseFloat(lectura.consumo) || 0,
      general_pozos: parseFloat(lectura.general_pozos) || 0
    }));
  }, [lecturasFiltradas]);

  // Datos para gráfico de pozos (promedio)
  const datosPozos = useMemo(() => {
    if (lecturasFiltradas.length === 0) return [];

    const sumaPozos = lecturasFiltradas.reduce((acc, l) => ({
      pozo3: acc.pozo3 + (parseFloat(l.pozo_3) || 0),
      pozo8: acc.pozo8 + (parseFloat(l.pozo_8) || 0),
      pozo15: acc.pozo15 + (parseFloat(l.pozo_15) || 0),
      pozo4: acc.pozo4 + (parseFloat(l.pozo_4) || 0),
      pozo7: acc.pozo7 + (parseFloat(l.pozo7) || 0),
      pozo11: acc.pozo11 + (parseFloat(l.pozo11) || 0),
      pozo12: acc.pozo12 + (parseFloat(l.pozo_12) || 0),
      pozo14: acc.pozo14 + (parseFloat(l.pozo_14) || 0)
    }), { pozo3: 0, pozo8: 0, pozo15: 0, pozo4: 0, pozo7: 0, pozo11: 0, pozo12: 0, pozo14: 0 });

    const n = lecturasFiltradas.length;

    return [
      { nombre: 'Pozo 3', valor: (sumaPozos.pozo3 / n).toFixed(2) },
      { nombre: 'Pozo 8', valor: (sumaPozos.pozo8 / n).toFixed(2) },
      { nombre: 'Pozo 15', valor: (sumaPozos.pozo15 / n).toFixed(2) },
      { nombre: 'Pozo 4', valor: (sumaPozos.pozo4 / n).toFixed(2) },
      { nombre: 'Pozo 7', valor: (sumaPozos.pozo7 / n).toFixed(2) },
      { nombre: 'Pozo 11', valor: (sumaPozos.pozo11 / n).toFixed(2) },
      { nombre: 'Pozo 12', valor: (sumaPozos.pozo12 / n).toFixed(2) },
      { nombre: 'Pozo 14', valor: (sumaPozos.pozo14 / n).toFixed(2) }
    ].filter(p => parseFloat(p.valor) > 0);
  }, [lecturasFiltradas]);

  // Datos para gráfico de zonas (promedio)
  const datosZonas = useMemo(() => {
    if (lecturasFiltradas.length === 0) return [];

    const sumaZonas = lecturasFiltradas.reduce((acc, l) => ({
      campus8: acc.campus8 + (parseFloat(l.campus_8) || 0),
      a7cc: acc.a7cc + (parseFloat(l.a7_cc) || 0),
      megacentral: acc.megacentral + (parseFloat(l.megacentral) || 0),
      plantaFisica: acc.plantaFisica + (parseFloat(l.planta_fisica) || 0),
      residencias: acc.residencias + (parseFloat(l.residencias) || 0),
      ayd: acc.ayd + (parseFloat(l.a_y_d) || 0)
    }), { campus8: 0, a7cc: 0, megacentral: 0, plantaFisica: 0, residencias: 0, ayd: 0 });

    const n = lecturasFiltradas.length;

    return [
      { nombre: 'Campus 8', valor: (sumaZonas.campus8 / n).toFixed(2) },
      { nombre: 'A7-CC', valor: (sumaZonas.a7cc / n).toFixed(2) },
      { nombre: 'Megacentral', valor: (sumaZonas.megacentral / n).toFixed(2) },
      { nombre: 'Planta Física', valor: (sumaZonas.plantaFisica / n).toFixed(2) },
      { nombre: 'Residencias', valor: (sumaZonas.residencias / n).toFixed(2) },
      { nombre: 'A y D', valor: (sumaZonas.ayd / n).toFixed(2) }
    ].filter(z => parseFloat(z.valor) > 0);
  }, [lecturasFiltradas]);

  // Exportar a CSV
  const exportarCSV = () => {
    const headers = ['Mes/Año', 'Día/Hora', 'Consumo', 'General Pozos', 'Pozo 3', 'Pozo 8', 'Pozo 15', 'Pozo 4', 'A y D', 'Campus 8', 'A7-CC', 'Megacentral', 'Planta Física', 'Residencias', 'Pozo 7', 'Pozo 11', 'Pozo 12', 'Pozo 14'];
    const rows = lecturasFiltradas.map(l => [
      l.mes_anio, l.dia_hora, l.consumo, l.general_pozos, l.pozo_3, l.pozo_8, 
      l.pozo_15, l.pozo_4, l.a_y_d, l.campus_8, l.a7_cc, l.megacentral, 
      l.planta_fisica, l.residencias, l.pozo7, l.pozo11, l.pozo_12, l.pozo_14
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lecturas_diarias_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <RedirectIfNotAuth>
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        
        <div className="ml-64">
          <DashboardHeader />
          <main className="p-6">
            
            {/* Estado de carga */}
            {loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Cargando lecturas diarias...</p>
                </div>
              </div>
            )}

            {/* Estado de error */}
            {error && !loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-red-800 font-semibold mb-2">Error al cargar datos</h3>
                      <p className="text-red-700 text-sm">{error}</p>
                      <button
                        onClick={fetchLecturas}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reintentar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contenido principal - solo mostrar si no hay loading ni error */}
            {!loading && !error && (
              <>
                {/* Encabezado */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">Lecturas Diarias</h1>
                      <p className="text-muted-foreground">Visualización y análisis de consumo diario de agua</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={fetchLecturas}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Actualizar
                      </button>
                      <button
                        onClick={exportarCSV}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Exportar CSV
                      </button>
                    </div>
                  </div>
                </div>

        {/* Filtros */}
        <div className="bg-card rounded-lg border border-border p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">Punto de medición:</label>
              <select
                value={filtroPunto}
                onChange={(e) => setFiltroPunto(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {puntosDisponibles.map(punto => (
                  <option key={punto.value} value={punto.value}>{punto.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">Filtrar por mes:</label>
              <select
                value={filtroMes}
                onChange={(e) => {
                  setFiltroMes(e.target.value);
                  setPaginaActual(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos los meses</option>
                {mesesUnicos.map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
            </div>
            <span className="text-sm text-muted-foreground ml-auto">
              {lecturasFiltradas.length} registros encontrados
            </span>
          </div>
        </div>

        {/* Métricas del punto seleccionado */}
        {metricasPunto && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Lectura Actual"
                value={metricasPunto.lecturaActual}
                unit="m³"
                icon={Droplet}
                iconColor="text-blue-600"
              />
              <MetricCard
                title="Consumo Actual"
                value={metricasPunto.consumoActual}
                unit="m³"
                icon={Activity}
                iconColor="text-indigo-600"
              />
              <MetricCard
                title="Vs Semana Anterior"
                value={metricasPunto.vsSemanaPorcentaje > 0 ? `+${metricasPunto.vsSemanaPorcentaje}` : metricasPunto.vsSemanaPorcentaje}
                unit="%"
                comparison={parseFloat(metricasPunto.vsSemanaPorcentaje)}
                comparisonLabel="vs semana anterior"
                trend={parseFloat(metricasPunto.vsSemanaPorcentaje) > 0 ? 'up' : 'down'}
                icon={ArrowUpDown}
                iconColor="text-green-600"
              />
              <MetricCard
                title="% de Ahorro"
                value={metricasPunto.ahorroPorcentaje > 0 ? `+${metricasPunto.ahorroPorcentaje}` : metricasPunto.ahorroPorcentaje}
                unit="%"
                comparison={parseFloat(metricasPunto.ahorroPorcentaje)}
                comparisonLabel="vs promedio total"
                trend={parseFloat(metricasPunto.ahorroPorcentaje) < 0 ? 'up' : 'down'}
                icon={Percent}
                iconColor="text-purple-600"
              />
            </div>
          </div>
        )}

        {/* Gráfico Avanzado de Consumo Diario */}
        <div className="mb-6">
          <AdvancedConsumptionChart 
            data={lecturasFiltradas}
            puntoField={puntosDisponibles.find(p => p.value === filtroPunto)?.field || 'consumo'}
            puntoLabel={puntosDisponibles.find(p => p.value === filtroPunto)?.label || 'Consumo'}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          {/* Gráfico de Consumo Diario */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Consumo Diario (Últimos 30 registros)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosConsumo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consumo" stroke="#0088FE" name="Consumo" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de General Pozos */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              General Pozos (Últimos 30 registros)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosConsumo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="fecha" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="general_pozos" stroke="#00C49F" name="General Pozos" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

    
      
        </div>


      <div className=" gap-6 mb-6 mx-20">
           {/* Gráfico de Pozos Promedio */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Promedio por Pozo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosPozos}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#8884d8" name="Lectura Promedio">
                  {datosPozos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabla de datos */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-semibold text-foreground">
              Registros de Lecturas Diarias
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Mes/Año</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Día/Hora</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Consumo</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">General Pozos</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Campus 8</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">A7-CC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Megacentral</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Planta Física</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Residencias</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lecturasPaginadas.map((lectura, index) => (
                  <tr key={lectura.id || index} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm text-foreground">{lectura.mes_anio}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{lectura.dia_hora}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right font-medium">{lectura.consumo}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{lectura.general_pozos}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{lectura.campus_8}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{lectura.a7_cc}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{lectura.megacentral}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{lectura.planta_fisica}</td>
                    <td className="px-4 py-3 text-sm text-foreground text-right">{lectura.residencias}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {indiceInicio + 1} - {Math.min(indiceFin, lecturasFiltradas.length)} de {lecturasFiltradas.length} registros
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                  disabled={paginaActual === 1}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Página {paginaActual} de {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

              </>
            )}
          </main>
        </div>
      </div>
    </RedirectIfNotAuth>
  );
};

export default DailyReadingsPage;
