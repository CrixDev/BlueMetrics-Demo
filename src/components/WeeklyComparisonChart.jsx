import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { Line, Bar } from 'react-chartjs-2'
import {
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  BarChart3Icon,
  LineChartIcon
} from 'lucide-react'

/**
 * Gráfica de comparación semanal con múltiples años
 * Muestra comparativas: vs semana anterior, vs misma semana año anterior, vs semana anterior año anterior
 */
export default function WeeklyComparisonChart({
  title = "Comparación Semanal",
  currentYearData = [],
  previousYearData = [],
  currentYear = "2025",
  previousYear = "2024",
  unit = "m³"
}) {

  const [chartType, setChartType] = useState('line') // 'line' o 'bar'
  const [comparisonMode, setComparisonMode] = useState('both') // 'current', 'previous', 'both'

  // Procesar datos para obtener consumo semanal
  const processWeeklyData = (weeklyData) => {
    if (!weeklyData || weeklyData.length === 0) return []
    
    return weeklyData.map((week, index) => {
      if (index === 0) {
        return {
          week: week.week,
          consumption: 0,
          reading: week.reading,
          vsLastWeek: 0,
          vsLastWeekPercent: 0
        }
      }
      
      const consumption = week.reading - weeklyData[index - 1].reading
      const lastWeekConsumption = weeklyData[index - 1].reading - (weeklyData[index - 2]?.reading || 0)
      const vsLastWeekPercent = lastWeekConsumption > 0 
        ? ((consumption - lastWeekConsumption) / lastWeekConsumption * 100)
        : 0
      
      return {
        week: week.week,
        consumption: Math.max(0, consumption),
        reading: week.reading,
        vsLastWeek: consumption - lastWeekConsumption,
        vsLastWeekPercent
      }
    }).slice(1)
  }

  const processedCurrent = useMemo(() => processWeeklyData(currentYearData), [currentYearData])
  const processedPrevious = useMemo(() => processWeeklyData(previousYearData), [previousYearData])

  // Calcular estadísticas comparativas
  const comparisonStats = useMemo(() => {
    if (processedCurrent.length === 0) {
      return {
        currentTotal: 0,
        previousTotal: 0,
        yearOverYear: 0,
        avgWeeklyCurrent: 0,
        avgWeeklyPrevious: 0,
        currentWeekVsLast: 0,
        sameWeekLastYear: 0
      }
    }

    const currentTotal = processedCurrent.reduce((sum, w) => sum + w.consumption, 0)
    const previousTotal = processedPrevious.reduce((sum, w) => sum + w.consumption, 0)
    const yearOverYear = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal * 100) : 0
    
    const avgWeeklyCurrent = currentTotal / processedCurrent.length
    const avgWeeklyPrevious = processedPrevious.length > 0 
      ? previousTotal / processedPrevious.length 
      : 0

    // Comparación semana actual vs semana anterior
    const lastWeek = processedCurrent[processedCurrent.length - 1]
    const currentWeekVsLast = lastWeek ? lastWeek.vsLastWeekPercent : 0

    // Comparación semana actual vs misma semana año pasado
    const currentWeekNum = lastWeek?.week || 0
    const sameWeekLastYearData = processedPrevious.find(w => w.week === currentWeekNum)
    const sameWeekLastYear = sameWeekLastYearData && lastWeek
      ? ((lastWeek.consumption - sameWeekLastYearData.consumption) / sameWeekLastYearData.consumption * 100)
      : 0

    return {
      currentTotal,
      previousTotal,
      yearOverYear,
      avgWeeklyCurrent,
      avgWeeklyPrevious,
      currentWeekVsLast,
      sameWeekLastYear,
      lastWeekNumber: currentWeekNum
    }
  }, [processedCurrent, processedPrevious])

  // Configuración de Chart.js
  const chartData = useMemo(() => {
    const labels = processedCurrent.map(d => `Sem ${d.week}`)
    const datasets = []

    if (comparisonMode === 'current' || comparisonMode === 'both') {
      datasets.push({
        label: `${currentYear}`,
        data: processedCurrent.map(d => d.consumption),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: chartType === 'line',
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: processedCurrent.map(d => {
          // Color según cambio vs semana anterior
          if (d.vsLastWeekPercent > 5) return 'rgb(239, 68, 68)' // Rojo - aumentó
          if (d.vsLastWeekPercent < -5) return 'rgb(34, 197, 94)' // Verde - disminuyó
          return 'rgb(59, 130, 246)' // Azul - estable
        })
      })
    }

    if ((comparisonMode === 'previous' || comparisonMode === 'both') && processedPrevious.length > 0) {
      datasets.push({
        label: `${previousYear}`,
        data: processedPrevious.map(d => d.consumption),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: chartType === 'bar' ? 'rgba(156, 163, 175, 0.4)' : 'rgba(156, 163, 175, 0.05)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: chartType === 'line',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5
      })
    }

    return { labels, datasets }
  }, [processedCurrent, processedPrevious, currentYear, previousYear, chartType, comparisonMode])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataIndex = context.dataIndex
            let label = `${context.dataset.label}: ${context.parsed.y.toLocaleString()} ${unit}`
            
            // Agregar información de cambio para año actual
            if (context.datasetIndex === 0 && processedCurrent[dataIndex]) {
              const change = processedCurrent[dataIndex].vsLastWeekPercent
              if (change !== 0) {
                label += ` (${change > 0 ? '+' : ''}${change.toFixed(1)}% vs sem anterior)`
              }
            }
            
            return label
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 9
          },
          callback: function(value, index) {
            return index % 2 === 0 ? this.getLabelForValue(value) : ''
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + ' ' + unit
          }
        }
      }
    }
  }

  const ChartComponent = chartType === 'bar' ? Bar : Line

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Análisis comparativo de consumo semanal
            </p>
          </div>
          
          {/* Controles */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Selector de tipo de gráfico */}
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className="h-8"
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('bar')}
                className="h-8"
              >
                <BarChart3Icon className="h-4 w-4" />
              </Button>
            </div>

            {/* Selector de modo de comparación */}
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value)}
              className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary h-8"
            >
              <option value="both">Ambos años</option>
              <option value="current">Solo {currentYear}</option>
              <option value="previous">Solo {previousYear}</option>
            </select>
          </div>
        </div>

        {/* Estadísticas de comparación */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {/* Total año actual */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <p className="text-xs text-muted-foreground">Total {currentYear}</p>
            <p className="text-lg font-bold text-foreground">
              {comparisonStats.currentTotal.toLocaleString()} {unit}
            </p>
          </div>

          {/* Total año anterior */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200">
            <p className="text-xs text-muted-foreground">Total {previousYear}</p>
            <p className="text-lg font-bold text-muted-foreground">
              {comparisonStats.previousTotal.toLocaleString()} {unit}
            </p>
          </div>

          {/* Cambio año sobre año */}
          <div className={`p-3 rounded-lg border ${
            comparisonStats.yearOverYear > 0 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200' 
              : comparisonStats.yearOverYear < 0
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200'
          }`}>
            <p className="text-xs text-muted-foreground">Cambio Anual</p>
            <div className="flex items-center gap-1">
              {comparisonStats.yearOverYear > 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-red-600" />
              ) : comparisonStats.yearOverYear < 0 ? (
                <TrendingDownIcon className="h-4 w-4 text-green-600" />
              ) : (
                <MinusIcon className="h-4 w-4 text-gray-600" />
              )}
              <p className={`text-lg font-bold ${
                comparisonStats.yearOverYear > 0 ? 'text-red-600' : 
                comparisonStats.yearOverYear < 0 ? 'text-green-600' : 
                'text-gray-600'
              }`}>
                {comparisonStats.yearOverYear > 0 ? '+' : ''}{comparisonStats.yearOverYear.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Semana actual vs anterior */}
          <div className={`p-3 rounded-lg border ${
            comparisonStats.currentWeekVsLast > 0 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200' 
              : comparisonStats.currentWeekVsLast < 0
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200'
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200'
          }`}>
            <p className="text-xs text-muted-foreground">vs Sem Anterior</p>
            <div className="flex items-center gap-1">
              {comparisonStats.currentWeekVsLast > 0 ? (
                <TrendingUpIcon className="h-4 w-4 text-red-600" />
              ) : comparisonStats.currentWeekVsLast < 0 ? (
                <TrendingDownIcon className="h-4 w-4 text-green-600" />
              ) : (
                <MinusIcon className="h-4 w-4 text-gray-600" />
              )}
              <p className={`text-lg font-bold ${
                comparisonStats.currentWeekVsLast > 0 ? 'text-red-600' : 
                comparisonStats.currentWeekVsLast < 0 ? 'text-green-600' : 
                'text-gray-600'
              }`}>
                {comparisonStats.currentWeekVsLast > 0 ? '+' : ''}{comparisonStats.currentWeekVsLast.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Comparación adicional: misma semana año anterior */}
        {comparisonStats.sameWeekLastYear !== 0 && (
          <div className={`mt-3 p-3 rounded-lg border ${
            comparisonStats.sameWeekLastYear > 0 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200' 
              : 'bg-green-50 dark:bg-green-900/20 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Semana {comparisonStats.lastWeekNumber} ({currentYear}) vs Misma Semana {previousYear}
              </p>
              <div className="flex items-center gap-2">
                {comparisonStats.sameWeekLastYear > 0 ? (
                  <TrendingUpIcon className="h-5 w-5 text-red-600" />
                ) : (
                  <TrendingDownIcon className="h-5 w-5 text-green-600" />
                )}
                <span className={`text-lg font-bold ${
                  comparisonStats.sameWeekLastYear > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {comparisonStats.sameWeekLastYear > 0 ? '+' : ''}{comparisonStats.sameWeekLastYear.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="h-[450px] w-full">
          <ChartComponent data={chartData} options={chartOptions} />
        </div>

        {/* Leyenda de colores de puntos */}
        {chartType === 'line' && comparisonMode !== 'previous' && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs font-medium mb-2">Leyenda de puntos (cambio vs semana anterior):</p>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Aumento &gt;5%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Estable (±5%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Disminución &gt;5%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
