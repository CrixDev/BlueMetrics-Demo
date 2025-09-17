import { useState } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { DashboardSummary } from "../components/dashboard-summary"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import ChartComponent from "../components/ChartComponent"
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Radar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
)
import { WellMonitoringCharts } from "../components/well-monitoring-charts"
import { dashboardData } from '../lib/dashboard-data'
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  DropletIcon, 
  ActivityIcon,
  TargetIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CalendarIcon,
  DownloadIcon,
  ZapIcon,
  BarChart3Icon
} from 'lucide-react'

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')

  const { consumption, goals, efficiencyKPIs } = dashboardData

  // Formatear números
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
    return num.toLocaleString()
  }

  // Obtener color según tendencia
  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-red-500'
    if (trend < 0) return 'text-green-500'
    return 'text-gray-500'
  }

  // Obtener color según estado de KPI
  const getKPIColor = (estado) => {
    switch (estado) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'danger': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // Datos para gráfico de consumo comparativo
  const consumptionComparisonData = {
    labels: ['Diario', 'Semanal', 'Mensual', 'Anual'],
    datasets: [
      {
        label: 'Período Actual',
        data: [
          consumption.current.daily,
          consumption.current.weekly / 1000,
          consumption.current.monthly / 1000,
          consumption.current.yearly / 1000
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Período Anterior',
        data: [
          consumption.previous.daily,
          consumption.previous.weekly / 1000,
          consumption.previous.monthly / 1000,
          consumption.previous.yearly / 1000
        ],
        backgroundColor: 'rgba(156, 163, 175, 0.6)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 2
      }
    ]
  }

  // Datos para gráfico de metas vs consumo
  const goalsData = {
    labels: ['Riego', 'Servicios', 'Total'],
    datasets: [
      {
        label: 'Meta (m³)',
        data: [goals.riego.meta_mensual, goals.servicios.meta_mensual, goals.total.meta_mensual],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: 'Consumo Actual (m³)',
        data: [goals.riego.consumo_actual, goals.servicios.consumo_actual, goals.total.consumo_actual],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      }
    ]
  }

  // Datos para gráfico de KPIs de eficiencia
  const efficiencyData = {
    labels: ['Distribución', 'Aprovechamiento', 'Pérdidas', 'Reciclaje', 'General'],
    datasets: [
      {
        label: 'Actual (%)',
        data: [
          efficiencyKPIs.distribucion.actual,
          efficiencyKPIs.aprovechamiento.actual,
          100 - efficiencyKPIs.perdidas.actual, // Invertir pérdidas para visualización
          efficiencyKPIs.reciclaje.actual,
          efficiencyKPIs.general.actual
        ],
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2
      },
      {
        label: 'Meta (%)',
        data: [
          efficiencyKPIs.distribucion.meta,
          efficiencyKPIs.aprovechamiento.meta,
          100 - efficiencyKPIs.perdidas.meta, // Invertir pérdidas para visualización
          efficiencyKPIs.reciclaje.meta,
          efficiencyKPIs.general.meta
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderDash: [5, 5]
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Principal</h1>
                <p className="text-muted-foreground">Resumen ejecutivo del sistema hídrico</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Exportar Resumen
                </Button>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Programar Reporte
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Summary */}
          <DashboardSummary />

          {/* Resumen de Consumo Comparativo */}
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Resumen de Consumo vs Período Anterior</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Consumo Diario</p>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(consumption.current.daily)} m³</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {consumption.trends.daily < 0 ? (
                      <TrendingDownIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUpIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${getTrendColor(consumption.trends.daily)}`}>
                      {Math.abs(consumption.trends.daily)}% vs anterior
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Consumo Semanal</p>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(consumption.current.weekly)} m³</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {consumption.trends.weekly < 0 ? (
                      <TrendingDownIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUpIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${getTrendColor(consumption.trends.weekly)}`}>
                      {Math.abs(consumption.trends.weekly)}% vs anterior
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Consumo Mensual</p>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(consumption.current.monthly)} m³</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {consumption.trends.monthly < 0 ? (
                      <TrendingDownIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUpIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${getTrendColor(consumption.trends.monthly)}`}>
                      {Math.abs(consumption.trends.monthly)}% vs anterior
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Consumo Anual</p>
                  <p className="text-2xl font-bold text-foreground">{formatNumber(consumption.current.yearly)} m³</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {consumption.trends.yearly < 0 ? (
                      <TrendingDownIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUpIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${getTrendColor(consumption.trends.yearly)}`}>
                      {Math.abs(consumption.trends.yearly)}% vs anterior
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-64">
                <div className="h-full">
                  <Bar data={consumptionComparisonData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return formatNumber(value) + ' m³'
                          }
                        }
                      }
                    }
                  }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metas vs Consumo Actual */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Consumo vs Metas Establecidas</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {/* Riego */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DropletIcon className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Pozos - Riego</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        goals.riego.porcentaje_cumplimiento > 100 ? 'bg-red-100 text-red-700' : 
                        goals.riego.porcentaje_cumplimiento > 90 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {goals.riego.porcentaje_cumplimiento}% de meta
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Meta Mensual</p>
                        <p className="font-medium">{formatNumber(goals.riego.meta_mensual)} m³</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Consumo Actual</p>
                        <p className="font-medium">{formatNumber(goals.riego.consumo_actual)} m³</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          goals.riego.porcentaje_cumplimiento > 100 ? 'bg-red-500' : 
                          goals.riego.porcentaje_cumplimiento > 90 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(goals.riego.porcentaje_cumplimiento, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Servicios */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ActivityIcon className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Pozos - Servicios</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        goals.servicios.porcentaje_cumplimiento > 100 ? 'bg-red-100 text-red-700' : 
                        goals.servicios.porcentaje_cumplimiento > 90 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {goals.servicios.porcentaje_cumplimiento}% de meta
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Meta Mensual</p>
                        <p className="font-medium">{formatNumber(goals.servicios.meta_mensual)} m³</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Consumo Actual</p>
                        <p className="font-medium">{formatNumber(goals.servicios.consumo_actual)} m³</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          goals.servicios.porcentaje_cumplimiento > 100 ? 'bg-red-500' : 
                          goals.servicios.porcentaje_cumplimiento > 90 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(goals.servicios.porcentaje_cumplimiento, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="h-48">
                  <Bar data={goalsData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return formatNumber(value) + ' m³'
                          }
                        }
                      }
                    }
                  }} />
                </div>
              </CardContent>
            </Card>

            {/* KPIs de Eficiencia */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">KPIs de Eficiencia</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {Object.entries(efficiencyKPIs).map(([key, kpi], index) => (
                    <div key={index} className={`border rounded-lg p-3 ${getKPIColor(kpi.estado)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          {kpi.estado === 'success' ? (
                            <CheckCircleIcon className="h-4 w-4" />
                          ) : (
                            <AlertTriangleIcon className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {kpi.actual}% {key === 'perdidas' ? '(pérdidas)' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Meta: {kpi.meta}%</span>
                        <span className={getTrendColor(key === 'perdidas' ? -kpi.tendencia : kpi.tendencia)}>
                          {kpi.tendencia > 0 ? '+' : ''}{kpi.tendencia}% vs anterior
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 bg-white/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-current rounded-full opacity-60"
                          style={{ width: `${(kpi.actual / kpi.meta) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-48">
                  <Radar data={efficiencyData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top'
                      }
                    },
                    scales: {
                      r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                          callback: function(value) {
                            return value + '%'
                          }
                        }
                      }
                    }
                  }} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Componente de monitoreo de pozos */}
          <div className="grid gap-6">
            <WellMonitoringCharts />
          </div>
        </main>
      </div>
    </div>
  )
}
