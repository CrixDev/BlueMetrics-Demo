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
import { Bar, Line } from 'react-chartjs-2'

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

const DashboardChart = ({ data, type = 'bar', height = '100%' }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Sin datos</div>
  }

  // Detectar las claves de datos automáticamente
  const keys = Object.keys(data[0]).filter(key => key !== 'name' && key !== 'day')
  const labels = data.map(item => item.name || item.day || `Item ${data.indexOf(item) + 1}`)

  const datasets = keys.map((key, index) => {
    const colors = [
      'hsl(220, 70%, 50%)', // Azul
      'hsl(200, 70%, 50%)', // Azul claro  
      'hsl(240, 70%, 50%)', // Azul púrpura
      'hsl(260, 70%, 50%)', // Púrpura
    ]
    
    return {
      label: key,
      data: data.map(item => item[key]),
      backgroundColor: type === 'area' ? `${colors[index % colors.length]}30` : colors[index % colors.length],
      borderColor: colors[index % colors.length],
      fill: type === 'area',
      tension: 0.4,
    }
  })

  const chartData = {
    labels,
    datasets,
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ocultar leyenda para dashboard compacto
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        display: false, // Ocultar eje Y para dashboard compacto
        grid: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 2,
      },
    },
  }

  try {
    return (
      <div style={{ height }}>
        {type === 'line' || type === 'area' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    )
  } catch (error) {
    console.error('Error en DashboardChart:', error)
    return <div className="flex items-center justify-center h-full text-red-500">Error al cargar gráfico</div>
  }
}

export default DashboardChart
