import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import DashboardChart from "./DashboardChart"
import { AlertTriangle, Droplets, Settings, TrendingUp, Brain, Target, Zap } from "lucide-react"
import { dashboardData } from '../lib/dashboard-data'

const predictionData = dashboardData.predictions.map(p => ({
  day: p.day,
  actual: p.actual,
  predicted: p.predicted,
  confidence: p.confidence
}))

const riskData = [
  { time: "00:00", risk: 20, factors: ["low_demand", "minimal_operations"] },
  { time: "03:00", risk: 15, factors: ["lowest_consumption"] },
  { time: "06:00", risk: 35, factors: ["startup_operations", "pressure_changes"] },
  { time: "09:00", risk: 55, factors: ["peak_morning", "high_demand"] },
  { time: "12:00", risk: 75, factors: ["maximum_load", "cooling_systems"] },
  { time: "15:00", risk: 68, factors: ["sustained_high_demand"] },
  { time: "18:00", risk: 45, factors: ["evening_reduction"] },
  { time: "21:00", risk: 30, factors: ["low_industrial_activity"] },
  { time: "24:00", risk: 25, factors: ["night_operations"] },
]

const mlInsights = dashboardData.mlInsights || {
  patterns: [],
  anomalies: []
}

export function PredictiveAnalyticsPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Predictive Forecasting */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="font-semibold">Análisis Predictivo</span>
            </div>
            <span className="text-sm">IA {dashboardData.stats.aiPrecision}%</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            {/* Mostrar anomalías si existen */}
            {mlInsights.anomalies && mlInsights.anomalies.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <div className="text-destructive font-semibold text-sm mb-1">ANOMALÍA DETECTADA</div>
                    <div className="text-sm text-foreground">
                      {mlInsights.anomalies[0]?.source}: consumo anómalo de {mlInsights.anomalies[0]?.value}% 
                      (esperado: {mlInsights.anomalies[0]?.expected}%)
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-sm text-muted-foreground mb-2">Predicción de Consumo (7 días)</div>
            <div className="h-32">
              <DashboardChart data={predictionData} type="line" height="100%" />
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-chart-2"></div>
                <span className="text-xs text-muted-foreground">Real</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-chart-1 border-dashed border border-chart-1"></div>
                <span className="text-xs text-muted-foreground">Predicción</span>
              </div>
            </div>
          </div>

          {/* Patrones ML */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground mb-2">Patrones Identificados</div>
            {mlInsights.patterns && mlInsights.patterns.slice(0, 2).map((pattern, index) => (
              <div key={index} className="text-xs p-2 bg-muted/30 rounded">
                <span className="font-medium capitalize">{pattern.type}:</span> {pattern.description}
                <span className="text-muted-foreground ml-2">({pattern.confidence}% confianza)</span>
              </div>
            ))}
          </div>

          {/* Confianza promedio */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confianza Promedio:</span>
              <span className="font-semibold">
                {predictionData.reduce((acc, p) => acc + p.confidence, 0) / predictionData.length}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations and Actions */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="font-semibold">Recomendaciones IA</span>
            </div>
            <span className="text-sm">{dashboardData.recommendations.length} activas</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 mb-6">
            {dashboardData.recommendations.slice(0, 3).map((rec, index) => {
              const icons = { eficiencia: Droplets, reciclaje: Settings, automatización: Zap };
              const Icon = icons[rec.category] || TrendingUp;
              const colors = { 
                high: "destructive", 
                medium: "chart-1", 
                low: "secondary" 
              };
              
              return (
                <div key={rec.id} className={`flex items-start gap-3 p-3 bg-${colors[rec.priority]}/10 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${colors[rec.priority]} mt-0.5`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground mb-1">{rec.title}</div>
                    <div className="text-xs text-muted-foreground mb-1">{rec.description}</div>
                    <div className="text-xs text-secondary font-medium">{rec.impact}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Ahorro: {rec.estimatedSavings} m³ | Tiempo: {rec.implementationTime}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    {rec.action}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-2">Nivel de Riesgo (24h)</div>
            <div className="h-20">
              <DashboardChart data={riskData} type="area" height="100%" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <div className="text-center">
                <div className="font-medium text-green-600">Bajo</div>
                <div className="text-muted-foreground">0-3h, 20-24h</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-orange-600">Medio</div>
                <div className="text-muted-foreground">6-9h, 18-21h</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-red-600">Alto</div>
                <div className="text-muted-foreground">9-15h</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-secondary">{dashboardData.stats.aiPrecision}%</div>
              <div className="text-xs text-muted-foreground">Precisión IA</div>
            </div>
            <div>
              <div className="text-lg font-bold text-chart-1">
                {dashboardData.recommendations.filter(r => ['high', 'medium'].includes(r.priority)).length}
              </div>
              <div className="text-xs text-muted-foreground">Pendientes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {dashboardData.stats.implementedRecommendations}
              </div>
              <div className="text-xs text-muted-foreground">Implementadas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
