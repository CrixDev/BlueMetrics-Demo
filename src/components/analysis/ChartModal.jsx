import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { X, Download, ExternalLink, Info } from 'lucide-react'
import { CATEGORY_CONFIG } from '../../lib/charts-registry'

// Import all chart components
import WeeklyComparisonChart from '../WeeklyComparisonChart'
import { MainConsumptionMetrics } from '../main-consumption-metrics'
import { WellMonitoringCharts } from '../well-monitoring-charts'
import { WaterBalanceFlow } from '../water-balance-flow'
import { PredictiveAnalyticsPanel } from '../predictive-analytics-panel'
import { AlertsRecommendationsSystem } from '../alerts-recommendations-system'
import { DashboardSummary } from '../dashboard-summary'
import ConsumptionTable from '../ConsumptionTable'
import WeeklyComparisonTable from '../WeeklyComparisonTable'
import ChartComponent from '../ChartComponent'
import DashboardChart from '../DashboardChart'

// Map component names to actual components
const COMPONENT_MAP = {
  WeeklyComparisonChart,
  MainConsumptionMetrics,
  WellMonitoringCharts,
  WaterBalanceFlow,
  PredictiveAnalyticsPanel,
  AlertsRecommendationsSystem,
  DashboardSummary,
  ConsumptionTable,
  WeeklyComparisonTable,
  ChartComponent,
  DashboardChart
}

/**
 * ChartModal Component
 * Full-screen modal to display charts
 */
export function ChartModal({ chart, isOpen, onClose }) {
  if (!isOpen || !chart) return null

  const Component = COMPONENT_MAP[chart.component]
  const categoryConfig = CATEGORY_CONFIG[chart.category] || {}

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-7xl max-h-[90vh] overflow-auto pointer-events-auto"
            >
              <Card className="bg-card border-border shadow-2xl">
                {/* Header */}
                <CardHeader className={`${categoryConfig.bgColor || 'bg-primary/10'} border-b border-border`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-foreground">
                          {chart.title}
                        </h2>
                        <Badge 
                          variant="outline" 
                          className={`${categoryConfig.bgColor} ${categoryConfig.textColor} ${categoryConfig.borderColor}`}
                        >
                          {categoryConfig.label || chart.category}
                        </Badge>
                        {chart.featured && (
                          <Badge variant="secondary">
                            Destacado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {chart.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {chart.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-muted/50 rounded-full text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement export
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Chart Content */}
                <CardContent className="p-6">
                  {Component ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Component />
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Info className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Componente no disponible
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        El componente <code className="px-2 py-0.5 bg-muted rounded text-xs">{chart.component}</code> no está disponible actualmente.
                      </p>
                    </div>
                  )}

                  {/* Chart Info Footer */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground mb-1">Tipo</div>
                        <div className="font-medium capitalize">{chart.type}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Fuente de Datos</div>
                        <div className="font-medium">{chart.dataSource}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Categoría</div>
                        <div className="font-medium">{categoryConfig.label || chart.category}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">ID</div>
                        <div className="font-mono text-xs">{chart.id}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
