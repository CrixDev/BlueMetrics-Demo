import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardHeader } from '../components/dashboard-header'
import { DashboardSidebar } from '../components/dashboard-sidebar'
import { 
  CHARTS_REGISTRY, 
  searchCharts, 
  getChartsByCategory,
  getChartsByTag,
  getFeaturedCharts 
} from '../lib/charts-registry'
import { ChartCard } from '../components/analysis/ChartCard'
import { FilterPanel } from '../components/analysis/FilterPanel'
import { ChartModal } from '../components/analysis/ChartModal'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { 
  LayoutDashboard, 
  Sparkles, 
  TrendingUp,
  Search,
  BarChart3
} from 'lucide-react'

/**
 * AnalysisSectionPage
 * Central hub for all charts in the application
 */
export default function AnalysisSectionPage() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  // Modal state
  const [selectedChart, setSelectedChart] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter charts based on all criteria
  const filteredCharts = useMemo(() => {
    let charts = CHARTS_REGISTRY

    // Apply featured filter
    if (showFeaturedOnly) {
      charts = getFeaturedCharts()
    }

    // Apply search query
    if (searchQuery) {
      charts = searchCharts(searchQuery)
    }

    // Apply category filter
    if (selectedCategory) {
      charts = charts.filter(chart => chart.category === selectedCategory)
    }

    // Apply tag filters (AND logic - chart must have all selected tags)
    if (selectedTags.length > 0) {
      charts = charts.filter(chart => 
        selectedTags.every(tag => chart.tags.includes(tag))
      )
    }

    return charts
  }, [searchQuery, selectedCategory, selectedTags, showFeaturedOnly])

  const handleViewChart = (chart) => {
    setSelectedChart(chart)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedChart(null), 300)
  }

  // Stats
  const totalCharts = CHARTS_REGISTRY.length
  const featuredCount = getFeaturedCharts().length

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Sección de Análisis</h1>
                <p className="text-muted-foreground">Centro de visualización de datos y gráficos analíticos</p>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <LayoutDashboard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{totalCharts}</div>
                      <div className="text-sm text-muted-foreground">Gráficos totales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{featuredCount}</div>
                      <div className="text-sm text-muted-foreground">Destacados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{filteredCharts.length}</div>
                      <div className="text-sm text-muted-foreground">Resultados actuales</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              showFeaturedOnly={showFeaturedOnly}
              onShowFeaturedChange={setShowFeaturedOnly}
              resultsCount={filteredCharts.length}
            />
          </div>

          {/* Charts Grid */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {filteredCharts.length > 0 ? (
                <motion.div
                  key="charts-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'flex flex-col gap-4'
                  }
                >
                  {filteredCharts.map((chart, index) => (
                    <ChartCard
                      key={chart.id}
                      chart={chart}
                      onView={handleViewChart}
                      index={index}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <Search className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No se encontraron gráficos
                  </h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    No hay gráficos que coincidan con tus filtros actuales. Intenta ajustar los criterios de búsqueda.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory(null)
                      setSelectedTags([])
                      setShowFeaturedOnly(false)
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chart Modal */}
          <ChartModal
            chart={selectedChart}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        </main>
      </div>
    </div>
  )
}
