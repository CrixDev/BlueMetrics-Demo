import { DashboardHeader } from "../components/dashboard-header"
import { DashboardSidebar } from "../components/dashboard-sidebar"
import { DashboardSummary } from "../components/dashboard-summary"
import { MainConsumptionMetrics } from "../components/main-consumption-metrics"
import { WaterBalanceFlow } from "../components/water-balance-flow"
import { WellMonitoringCharts } from "../components/well-monitoring-charts"
import { PredictiveAnalyticsPanel } from "../components/predictive-analytics-panel"
import { AlertsRecommendationsSystem } from "../components/alerts-recommendations-system"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar fijo */}
      <DashboardSidebar />
      
      {/* Contenido principal con margen para el sidebar */}
      <div className="ml-64">
        <DashboardHeader />
        <main className="p-6">
          <div className="grid gap-6">
            <DashboardSummary />
            <MainConsumptionMetrics />
            <WaterBalanceFlow />
            <WellMonitoringCharts />
            <PredictiveAnalyticsPanel />
            <AlertsRecommendationsSystem />
          </div>
        </main>
      </div>
    </div>
  )
}
