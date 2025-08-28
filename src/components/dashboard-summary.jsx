import { Card, CardContent } from "../components/ui/card"
import { dashboardData } from "../lib/dashboard-data"
import { Droplets, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

export function DashboardSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <Card className="bg-card border-border">
        <CardContent className="p-4 flex justify-center items-center h-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Droplets className="w-5 h-5 text-primary" />
            </div>
            <div className="">
              <div className="text-sm text-muted-foreground">Consumo Total</div>
              <div className="text-xl font-bold text-foreground">
                {dashboardData.stats.totalConsumption.toLocaleString()} m³
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4 flex justify-center items-center h-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Eficiencia</div>
              <div className="text-xl font-bold text-foreground">{dashboardData.consumption.efficiency}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4 flex justify-center items-center h-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Alertas Activas</div>
              <div className="text-xl font-bold text-foreground">{dashboardData.stats.activeAlerts}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4 flex justify-center items-center h-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-chart-1/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-chart-1" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">IA Precisión</div>
              <div className="text-xl font-bold text-foreground">{dashboardData.stats.aiPrecision}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
