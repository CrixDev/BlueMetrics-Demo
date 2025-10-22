import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from "./ui/card"
import { Button } from "./ui/button"
import { 
  SearchIcon, 
  ArrowUpDownIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  AlertTriangleIcon,
  InfoIcon,
  DownloadIcon
} from 'lucide-react'

export default function ConsumptionTable({ 
  title, 
  data = [], 
  weekNumber = 1,
  showComparison = false 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filterType, setFilterType] = useState('all')

  // Obtener tipos únicos de los datos
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(data.map(item => item.type || 'otro'))]
    return types.sort()
  }, [data])

  // Función para ordenar
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Función para calcular consumo entre semanas
  const calculateConsumption = (item, week) => {
    if (!item.weeklyData || item.noRead) return 0
    
    const currentWeekData = item.weeklyData.find(w => w.week === week)
    const previousWeekData = item.weeklyData.find(w => w.week === week - 1)
    
    if (!currentWeekData || !previousWeekData) return 0
    
    const currentReading = typeof currentWeekData.reading === 'number' ? currentWeekData.reading : parseFloat(currentWeekData.reading) || 0
    const previousReading = typeof previousWeekData.reading === 'number' ? previousWeekData.reading : parseFloat(previousWeekData.reading) || 0
    
    const consumption = currentReading - previousReading
    return Math.max(0, consumption) // Asegurar que no sea negativo
  }
  
  // Función para obtener lectura de una semana específica
  const getReading = (item, week) => {
    if (!item.weeklyData || item.noRead) return 0
    const weekData = item.weeklyData.find(w => w.week === week)
    if (!weekData) return 0
    return typeof weekData.reading === 'number' ? weekData.reading : parseFloat(weekData.reading) || 0
  }

  // Filtrar y ordenar datos
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(item => {
      // Filtro de búsqueda
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filtro de tipo
      const matchesType = filterType === 'all' || item.type === filterType
      
      return matchesSearch && matchesType
    })

    // Ordenar
    filtered.sort((a, b) => {
      let aValue, bValue

      if (sortField === 'name') {
        aValue = a.name
        bValue = b.name
      } else if (sortField === 'consumption') {
        aValue = calculateConsumption(a, weekNumber)
        bValue = calculateConsumption(b, weekNumber)
      } else if (sortField === 'type') {
        aValue = a.type || 'otro'
        bValue = b.type || 'otro'
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })

    return filtered
  }, [data, searchTerm, filterType, sortField, sortDirection, weekNumber])

  // Calcular totales
  const totals = useMemo(() => {
    const currentWeek = filteredAndSortedData.reduce((sum, item) => {
      return sum + calculateConsumption(item, weekNumber)
    }, 0)

    const previousWeek = filteredAndSortedData.reduce((sum, item) => {
      return sum + calculateConsumption(item, weekNumber - 1)
    }, 0)

    const change = previousWeek > 0 
      ? ((currentWeek - previousWeek) / previousWeek * 100).toFixed(1)
      : 0

    return { currentWeek, previousWeek, change }
  }, [filteredAndSortedData, weekNumber])

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ['Nombre', 'Tipo', 'Lectura Semana ' + (weekNumber - 1), 'Lectura Semana ' + weekNumber, 'Consumo (m³)', 'Notas']
    const rows = filteredAndSortedData.map(item => {
      const currentReading = getReading(item, weekNumber)
      const previousReading = getReading(item, weekNumber - 1)
      const consumption = calculateConsumption(item, weekNumber)
      
      return [
        item.name,
        item.type || 'N/A',
        previousReading,
        currentReading,
        consumption,
        item.notes || (item.noRead ? 'NO TOMAR LECTURA' : '')
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `consumo_${title.replace(/\s+/g, '_')}_semana_${weekNumber}.csv`
    link.click()
  }

  // Icono de ordenamiento
  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDownIcon className="h-4 w-4 ml-1 opacity-40" />
    return sortDirection === 'asc' 
      ? <ArrowUpIcon className="h-4 w-4 ml-1" />
      : <ArrowDownIcon className="h-4 w-4 ml-1" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredAndSortedData.length} punto{filteredAndSortedData.length !== 1 ? 's' : ''} de medición
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mt-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filtro por tipo */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-muted rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos los tipos</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.replace(/_/g, ' ').slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">Consumo Semana {weekNumber}</p>
            <p className="text-xl font-bold text-foreground">{totals.currentWeek.toLocaleString()} m³</p>
          </div>
          {showComparison && weekNumber > 1 && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Semana Anterior</p>
                <p className="text-xl font-bold text-muted-foreground">{totals.previousWeek.toLocaleString()} m³</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cambio</p>
                <p className={`text-xl font-bold ${parseFloat(totals.change) > 0 ? 'text-destructive' : 'text-green-500'}`}>
                  {parseFloat(totals.change) > 0 ? '+' : ''}{totals.change}%
                </p>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-muted">
                <th 
                  className="text-left p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center font-semibold text-sm">
                    Nombre
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="text-left p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center font-semibold text-sm">
                    Tipo
                    <SortIcon field="type" />
                  </div>
                </th>
                <th className="text-right p-3 font-semibold text-sm">
                  Lectura Semana {weekNumber - 1}
                </th>
                <th className="text-right p-3 font-semibold text-sm">
                  Lectura Semana {weekNumber}
                </th>
                <th 
                  className="text-right p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => handleSort('consumption')}
                >
                  <div className="flex items-center justify-end font-semibold text-sm">
                    Consumo (m³)
                    <SortIcon field="consumption" />
                  </div>
                </th>
                {showComparison && weekNumber > 1 && (
                  <th className="text-right p-3 font-semibold text-sm">
                    Cambio vs Semana Anterior
                  </th>
                )}
                <th className="text-center p-3 font-semibold text-sm">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((item, index) => {
                const currentReading = getReading(item, weekNumber)
                const previousReading = getReading(item, weekNumber - 1)
                const consumption = calculateConsumption(item, weekNumber)
                const previousConsumption = calculateConsumption(item, weekNumber - 1)
                const change = previousConsumption > 0 
                  ? ((consumption - previousConsumption) / previousConsumption * 100).toFixed(1)
                  : 0

                const rowClass = item.noRead 
                  ? 'bg-gray-100 dark:bg-gray-800/50'
                  : item.notes || item.importance === 'importante'
                  ? 'bg-yellow-50 dark:bg-yellow-900/10'
                  : index % 2 === 0 
                  ? 'bg-background'
                  : 'bg-muted/20'

                return (
                  <tr 
                    key={item.id} 
                    className={`border-b border-muted hover:bg-muted/40 transition-colors ${rowClass}`}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.name}</span>
                        {item.noRead && (
                          <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                            Sin lectura
                          </span>
                        )}
                        {item.importance === 'importante' && (
                          <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <InfoIcon className="h-3 w-3" />
                          {item.notes}
                        </p>
                      )}
                      {item.source === 'ciudad' && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded mt-1 inline-block">
                          Agua ciudad
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">
                        {item.type ? item.type.replace(/_/g, ' ').charAt(0).toUpperCase() + item.type.replace(/_/g, ' ').slice(1) : 'N/A'}
                      </span>
                    </td>
                    <td className="p-3 text-right text-sm text-muted-foreground">
                      {previousReading.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-sm font-medium">
                      {currentReading.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`text-sm font-bold ${consumption === 0 ? 'text-muted-foreground' : 'text-primary'}`}>
                        {consumption.toLocaleString()}
                      </span>
                    </td>
                    {showComparison && weekNumber > 1 && (
                      <td className="p-3 text-right">
                        {consumption === 0 && previousConsumption === 0 ? (
                          <span className="text-sm text-muted-foreground">-</span>
                        ) : (
                          <span className={`text-sm font-medium ${
                            parseFloat(change) > 0 ? 'text-destructive' : 
                            parseFloat(change) < 0 ? 'text-green-500' : 
                            'text-muted-foreground'
                          }`}>
                            {parseFloat(change) > 0 ? '+' : ''}{change}%
                          </span>
                        )}
                      </td>
                    )}
                    <td className="p-3 text-center">
                      {item.noRead ? (
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                          No medible
                        </span>
                      ) : consumption === 0 ? (
                        <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">
                          Sin consumo
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron puntos de medición</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

