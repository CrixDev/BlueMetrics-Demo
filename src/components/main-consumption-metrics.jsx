import { Card, CardContent, CardHeader } from "../components/ui/card"
import DashboardChart from "./DashboardChart"

const efficiencyData = [
  { name: "Efficiency", value: 82, fill: "hsl(var(--chart-2))" },
  { name: "Remaining", value: 18, fill: "hsl(var(--muted))" },
]

const consumptionData = [
  { name: "Ene", value: 45 },
  { name: "Feb", value: 52 },
  { name: "Mar", value: 48 },
  { name: "Abr", value: 61 },
  { name: "May", value: 55 },
  { name: "Jun", value: 67 },
]

export function MainConsumptionMetrics() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Main System Dashboard */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">1270.01</span>
            <span className="font-semibold">BlueMetrics</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Dashboard Principal del Sistema Hídrico</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Consumo Diario</div>
              <div className="text-2xl font-bold text-foreground">195,3 m³</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Consumo Semanal</div>
              <div className="text-2xl font-bold text-foreground">1.280 m³</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Eficiencia</div>
              <div className="relative w-20 h-20 mx-auto">
                {/* Círculo de progreso CSS */}
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-300"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="transparent"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-600"
                      strokeWidth="3"
                      strokeDasharray="82, 100"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">82%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Consumo Mensual</div>
              <div className="text-3xl font-bold text-foreground">5.420</div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-chart-1"></div>
                  <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                </div>
                <span className="text-xs text-muted-foreground">Pozo 11</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Tendencia Mensual</div>
              <div className="h-16">
                <DashboardChart data={consumptionData} type="bar" height="100%" />
              </div>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="text-destructive font-semibold text-sm mb-1">ALERTA</div>
            <div className="text-sm text-foreground">El Pozo 11 superó el límite diario permitido</div>
          </div>
        </CardContent>
      </Card>

      {/* Water Balance */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">Aucan'ti</span>
            <span className="font-semibold">BlueMetrics</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Balance Hídrico Integral</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Origen del Agua</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                    <span className="text-sm">Pozos</span>
                  </div>
                  <span className="text-sm font-medium">45.000 m³</span>
                </div>
                <div className="ml-5 h-2 bg-chart-1/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-chart-1 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                    <span className="text-sm">Agua Filtrada</span>
                  </div>
                  <span className="text-sm font-medium">10.000 m³</span>
                </div>
                <div className="ml-5 h-2 bg-chart-2/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-chart-2 rounded-full"></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                    <span className="text-sm">Agua y Drenaje</span>
                  </div>
                  <span className="text-sm font-medium">5.000 m³</span>
                </div>
                <div className="ml-5 h-2 bg-chart-3/20 rounded-full overflow-hidden">
                  <div className="h-full w-1/6 bg-chart-3 rounded-full"></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Distribución del Uso</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Riego</span>
                  <span className="text-sm font-medium">3.000 m³</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/8 bg-secondary rounded-full"></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Torres de Enfriamiento</span>
                  <span className="text-sm font-medium">16.000 m³</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary rounded-full"></div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Edificios</span>
                  <span className="text-sm font-medium">5.000 m³</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/5 bg-chart-1 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
