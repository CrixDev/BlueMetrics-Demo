import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const ChartComponent = ({ chartType, chartData, selectedMetrics, availableMetrics }) => {
  // Validar props
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div className="h-96 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500">No hay datos para mostrar</p>
        </div>
      </div>
    )
  }

  if (!selectedMetrics || selectedMetrics.length === 0) {
    return (
      <div className="h-96 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500">Selecciona al menos una métrica</p>
        </div>
      </div>
    )
  }

  // Preparar datos para Chart.js - detectar automáticamente la clave de etiqueta
  const getLabelKey = () => {
    if (chartData.length > 0) {
      const firstItem = chartData[0]
      if (firstItem.quarter) return 'quarter'
      if (firstItem.period) return 'period'
      if (firstItem.year) return 'year'
    }
    return 'year' // fallback
  }
  
  const labelKey = getLabelKey()
  const labels = chartData.map(item => item[labelKey])
  
  const datasets = selectedMetrics
    .map(metricKey => {
      const metric = availableMetrics.find(m => m.key === metricKey)
      if (!metric) return null

      return {
        label: metric.label,
        data: chartData.map(item => item[metricKey]),
        borderColor: metric.color,
        backgroundColor: chartType === 'area' ? `${metric.color}40` : metric.color,
        fill: chartType === 'area',
        tension: 0.4,
      }
    })
    .filter(Boolean)

  const data = {
    labels,
    datasets,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} m³`
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: labelKey === 'quarter' ? 'Trimestre' : labelKey === 'period' ? 'Período' : 'Año'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Volumen (m³)'
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString()
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  }

  try {
    return (
      <div className="h-96 w-full">
        {chartType === 'line' || chartType === 'area' ? (
          <Line data={data} options={options} />
        ) : chartType === 'bar' ? (
          <Bar data={data} options={options} />
        ) : chartType === 'composed' ? (
          <Line data={data} options={options} />
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    )
  } catch (error) {
    console.error('Error en ChartComponent:', error)
    return (
      <div className="h-96 w-full flex items-center justify-center border-2 border-red-300 rounded-lg bg-red-50">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error al renderizar el gráfico</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    )
  }
}

export default ChartComponent
