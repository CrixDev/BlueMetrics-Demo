import { useState } from 'react'
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import ChartComponent from "../components/ChartComponent"
import DashboardChart from "../components/DashboardChart"
import datosPozo12 from '../lib/datos_pozo_12.json'
import { dashboardData } from '../lib/dashboard-data'
import { 
  FilterIcon, 
  TrendingUpIcon, 
  AlertTriangleIcon, 
  DropletIcon, 
  ActivityIcon,
  BarChart3Icon,
  CalendarIcon,
  DownloadIcon,
  Truck,
  Building2,
  Waves,
  Factory
} from 'lucide-react'

export default function ConsumptionPage() {
  const [timeFrame, setTimeFrame] = useState('monthly')
  const [selectedYear, setSelectedYear] = useState('2025')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [comparisonMode, setComparisonMode] = useState(false)
  const [chartType, setChartType] = useState('bar')

  // Procesar datos de consumo según filtros
  const getConsumptionData = () => {
    switch (timeFrame) {
      case 'daily':
        // Simular datos diarios de la última semana
        return [
          { name: 'Lun', value: 2800, category: 'general' },
          { name: 'Mar', value: 3200, category: 'general' },
          { name: 'Mié', value: 2950, category: 'general' },
          { name: 'Jue', value: 3100, category: 'general' },
          { name: 'Vie', value: 2750, category: 'general' },
          { name: 'Sáb', value: 2400, category: 'general' },
          { name: 'Dom', value: 2200, category: 'general' },
        ]
      case 'weekly':
        return datosPozo12.datos_semanales.consumo_semanal_detallado.slice(-8).map((week, index) => ({
          name: `S${index + 1}`,
          value: Math.round(week.total_pozos / 1000),
          servicios: Math.round(week.consumo_servicios / 1000),
          riego: Math.round(week.consumo_riego / 1000)
        }))
      case 'quarterly':
        const quarterlyData = datosPozo12.datos_trimestrales.consumo_trimestral
        const yearData = quarterlyData.find(q => q.año.includes(selectedYear)) || quarterlyData[quarterlyData.length - 1]
        const quarters = ['primer_trimestre', 'segundo_trimestre', 'tercer_trimestre', 'cuarto_trimestre']
        const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4']
        
        return quarters.map((quarter, index) => {
          const value = yearData[quarter]
          if (value !== null && value !== undefined) {
            return {
              name: quarterLabels[index],
              value: Math.round(value / 1000)
            }
          }
          return null
        }).filter(Boolean)
        
      case 'yearly':
        return datosPozo12.especificaciones_anuales.map(year => ({
          name: year.año.toString().replace('2025 (hasta mayo)', '2025'),
          value: Math.round(year.consumo_real_m3 / 1000),
          disponible: Math.round(year.m3_disponibles_para_consumir / 1000),
          efficiency: ((year.consumo_real_m3 / year.m3_disponibles_para_consumir) * 100).toFixed(1)
        }))
        
      case 'monthly':
      default:
        const monthlyData = datosPozo12.datos_mensuales.consumo_mensual
        const lastYearWithData = monthlyData.find(year => year.año.includes(selectedYear)) || monthlyData[monthlyData.length - 1]
        
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
        const monthAbbrev = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        
        return monthNames.map((month, index) => {
          const value = lastYearWithData[month]
          if (value !== null && value !== undefined) {
            return {
              name: monthAbbrev[index],
              value: Math.round(value / 1000)
            }
          }
          return null
        }).filter(Boolean)
    }
  }

  // Datos de consumo por categoría
  const getCategoryData = () => {
    const total = dashboardData.waterUsage.reduce((sum, item) => sum + item.volume, 0)
    return dashboardData.waterUsage.map(item => ({
      name: item.name,
      value: item.volume,
      percentage: ((item.volume / total) * 100).toFixed(1)
    }))
  }

  // Datos de eficiencia por pozo
  const getWellEfficiencyData = () => {
    return dashboardData.wells.map(well => ({
      name: well.name,
      consumption: well.dailyConsumption,
      efficiency: well.efficiency,
      status: well.status
    }))
  }

  // Datos de origen del agua
  const getWaterOriginData = () => {
    return dashboardData.waterSources.map(source => ({
      name: source.name,
      volume: source.volume,
      percentage: source.percentage,
      description: source.description,
      icon: getSourceIcon(source.name)
    }))
  }

  // Función para obtener iconos por tipo de fuente
  const getSourceIcon = (sourceName) => {
    switch (sourceName.toLowerCase()) {
      case 'pozos':
        return <Waves className="h-5 w-5" />
      case 'agua municipal':
        return <Building2 className="h-5 w-5" />
      case 'ptar':
        return <Factory className="h-5 w-5" />
      case 'pipas':
        return <Truck className="h-5 w-5" />
      default:
        return <DropletIcon className="h-5 w-5" />
    }
  }

  // Datos históricos de origen según período
  const getOriginHistoryData = () => {
    switch (timeFrame) {
      case 'quarterly':
        return dashboardData.waterOriginHistory.quarterly
      case 'yearly':
        return dashboardData.waterOriginHistory.yearly
      case 'monthly':
      default:
        return dashboardData.waterOriginHistory.monthly
    }
  }

  // Cálculos de métricas principales
  const consumptionData = getConsumptionData()
  const categoryData = getCategoryData()
  const wellData = getWellEfficiencyData()
  const waterOriginData = getWaterOriginData()
  const originHistoryData = getOriginHistoryData()
  
  const currentConsumption = consumptionData.length > 0 ? consumptionData[consumptionData.length - 1].value * 1000 : 0
  const previousConsumption = consumptionData.length > 1 ? consumptionData[consumptionData.length - 2].value * 1000 : 0
  const consumptionTrend = previousConsumption > 0 ? ((currentConsumption - previousConsumption) / previousConsumption * 100).toFixed(1) : 0

  // Datos para gráfico de comparación histórica
  const comparisonData = {
    labels: consumptionData.map(item => item.name),
    datasets: [
      {
        label: `Consumo ${selectedYear}`,
        data: consumptionData.map(item => item.value),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      }
    ]
  }

  // Configuración de gráficos Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} m³`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + ' m³'
          }
        }
      }
    }
  }

  // Datos para gráfico de origen del agua
  const waterOriginChartData = {
    labels: waterOriginData.map(item => item.name),
    datasets: [{
      label: 'Volumen por Fuente',
      data: waterOriginData.map(item => item.volume),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',   // Pozos - azul
        'rgba(16, 185, 129, 0.8)',   // Agua Municipal - verde
        'rgba(245, 158, 11, 0.8)',   // PTAR - amarillo
        'rgba(239, 68, 68, 0.8)',    // Pipas - rojo
      ],
      borderWidth: 0
    }]
  }

  // Datos para gráfico histórico de origen
  const originHistoryChartData = {
    labels: originHistoryData.map(item => item.name),
    datasets: [
      {
        label: 'Pozos',
        data: originHistoryData.map(item => item.pozos),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Agua Municipal',
        data: originHistoryData.map(item => item.municipal),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      },
      {
        label: 'PTAR',
        data: originHistoryData.map(item => item.ptar),
        backgroundColor: 'rgba(245, 158, 11, 0.6)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 2
      },
      {
        label: 'Pipas',
        data: originHistoryData.map(item => item.pipas),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Análisis de Consumo</h1>
                <p className="text-muted-foreground">Monitoreo detallado del consumo hídrico del sistema</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Exportar Reporte
                </Button>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Programar Análisis
                </Button>
              </div>
            </div>
          </div>

          {/* Filtros principales */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filtros de Análisis</h3>
                <div className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Personalizar vista</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Período</label>
                  <select 
                    value={timeFrame} 
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="w-full border border-muted rounded px-3 py-2 text-sm"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
                {(timeFrame === 'monthly' || timeFrame === 'quarterly') && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">Año</label>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full border border-muted rounded px-3 py-2 text-sm"
                    >
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Categoría</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-muted rounded px-3 py-2 text-sm"
                  >
                    <option value="all">Todas</option>
                    <option value="riego">Riego</option>
                    <option value="torres">Torres de Enfriamiento</option>
                    <option value="edificios">Edificios</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Tipo de Gráfico</label>
                  <select 
                    value={chartType} 
                    onChange={(e) => setChartType(e.target.value)}
                    className="w-full border border-muted rounded px-3 py-2 text-sm"
                  >
                    <option value="bar">Barras</option>
                    <option value="line">Líneas</option>
                    <option value="area">Área</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant={comparisonMode ? "default" : "outline"} 
                    onClick={() => setComparisonMode(!comparisonMode)}
                    className="w-full"
                  >
                    <BarChart3Icon className="h-4 w-4 mr-2" />
                    Comparar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Consumo Actual</p>
                    <p className="text-2xl font-bold text-foreground">
                      {currentConsumption.toLocaleString()} m³
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUpIcon className={`h-4 w-4 ${parseFloat(consumptionTrend) > 0 ? 'text-destructive' : 'text-green-500'}`} />
                      <span className={`text-sm ${parseFloat(consumptionTrend) > 0 ? 'text-destructive' : 'text-green-500'}`}>
                        {Math.abs(consumptionTrend)}% vs anterior
                      </span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DropletIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Eficiencia Promedio</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(wellData.reduce((sum, well) => sum + well.efficiency, 0) / wellData.length)}%
                    </p>
                    <p className="text-sm text-green-500 mt-1">Óptimo</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <ActivityIcon className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pozos Activos</p>
                    <p className="text-2xl font-bold text-foreground">{wellData.length}</p>
                    <p className="text-sm text-blue-500 mt-1">
                      {wellData.filter(w => w.status === 'alert').length} en alerta
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <BarChart3Icon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Fuentes de Agua</p>
                    <p className="text-2xl font-bold text-foreground">
                      {dashboardData.stats.sourceDiversification}
                    </p>
                    <p className="text-sm text-green-500 mt-1">
                      Diversificado ({dashboardData.stats.waterSecurity}% seguridad)
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Waves className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos principales */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Tendencia de Consumo - {timeFrame === 'monthly' ? 'Mensual' : timeFrame === 'quarterly' ? 'Trimestral' : timeFrame === 'yearly' ? 'Anual' : timeFrame === 'weekly' ? 'Semanal' : 'Diario'}
                  {(timeFrame === 'monthly' || timeFrame === 'quarterly') && ` (${selectedYear})`}
                </h3>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartComponent 
                    data={comparisonData} 
                    type={chartType} 
                    options={chartOptions}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Origen del Agua</h3>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartComponent 
                    data={waterOriginChartData} 
                    type="doughnut"
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const item = waterOriginData[context.dataIndex]
                              return `${item.name}: ${item.volume.toLocaleString()} m³ (${item.percentage}%)`
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sección de Origen del Agua */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Análisis de Origen del Agua</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Gráfico histórico de origen */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Tendencia Histórica por Fuente - {timeFrame === 'monthly' ? 'Mensual' : timeFrame === 'quarterly' ? 'Trimestral' : 'Anual'}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartComponent 
                      data={originHistoryChartData} 
                      type="bar"
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top'
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y}% del total`
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            stacked: true
                          },
                          y: {
                            stacked: true,
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              callback: function(value) {
                                return value + '%'
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Métricas de confiabilidad */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Confiabilidad por Fuente</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.sourceReliability).map(([source, metrics], index) => {
                      const sourceData = waterOriginData.find(s => s.name.toLowerCase().includes(source)) || 
                                        waterOriginData.find(s => source === 'pozos' && s.name === 'Pozos') ||
                                        waterOriginData.find(s => source === 'municipal' && s.name === 'Agua Municipal') ||
                                        waterOriginData.find(s => source === 'ptar' && s.name === 'PTAR') ||
                                        waterOriginData.find(s => source === 'pipas' && s.name === 'Pipas')
                      
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="text-primary">
                              {sourceData?.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{sourceData?.name || source}</h4>
                              <p className="text-sm text-muted-foreground">{sourceData?.description}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Confiabilidad</p>
                              <div className="flex items-center gap-2">
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      metrics.reliability >= 90 ? 'bg-green-500' : 
                                      metrics.reliability >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${metrics.reliability}%` }}
                                  ></div>
                                </div>
                                <span className="font-medium">{metrics.reliability}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Costo</p>
                              <span className={`font-medium ${
                                metrics.cost === 'Bajo' ? 'text-green-600' :
                                metrics.cost === 'Medio' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {metrics.cost}
                              </span>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Disponibilidad</p>
                              <span className="font-medium text-foreground">{metrics.availability}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detalle por fuente de agua */}
            <Card className="mb-6">
              <CardHeader>
                <h3 className="text-lg font-semibold">Detalle por Fuente de Agua</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {waterOriginData.map((source, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {source.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{source.name}</h4>
                          <p className="text-sm text-muted-foreground">{source.percentage}% del total</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Volumen Mensual</p>
                          <p className="text-xl font-bold text-foreground">{source.volume.toLocaleString()} m³</p>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2">{source.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análisis detallado */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Consumo por pozos */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Rendimiento por Pozo</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wellData.map((well, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{well.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          well.status === 'alert' ? 'bg-destructive/10 text-destructive' :
                          well.status === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-green-500/10 text-green-600'
                        }`}>
                          {well.status === 'alert' ? 'Alerta' : well.status === 'warning' ? 'Advertencia' : 'Normal'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Consumo Diario</p>
                          <p className="font-medium">{well.consumption} m³</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Eficiencia</p>
                          <p className="font-medium">{well.efficiency}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribución por Categorías de Uso */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Distribución por Uso</h3>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ChartComponent 
                    data={{
                      labels: categoryData.map(item => item.name),
                      datasets: [{
                        data: categoryData.map(item => item.value),
                        backgroundColor: [
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(16, 185, 129, 0.8)',
                          'rgba(245, 158, 11, 0.8)',
                        ],
                        borderWidth: 0
                      }]
                    }} 
                    type="doughnut"
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const item = categoryData[context.dataIndex]
                              return `${item.name}: ${item.value.toLocaleString()} m³ (${item.percentage}%)`
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-muted-foreground">{category.value.toLocaleString()} m³ ({category.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertas recientes */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Alertas de Consumo</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm">{alert.title}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          alert.type === 'critical' ? 'bg-destructive/10 text-destructive' :
                          alert.type === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-blue-500/10 text-blue-600'
                        }`}>
                          {alert.type === 'critical' ? 'Crítico' : alert.type === 'warning' ? 'Advertencia' : 'Info'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        <Button size="sm" variant="outline">
                          {alert.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
