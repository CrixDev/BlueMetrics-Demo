import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts"
import { AlertTriangle, Droplets, Settings, TrendingUp } from "lucide-react"

const predictionData = [
  { day: "Lun", actual: 54, predicted: 52 },
  { day: "Mar", actual: 58, predicted: 55 },
  { day: "Mié", actual: null, predicted: 61 },
  { day: "Jue", actual: null, predicted: 58 },
  { day: "Vie", actual: null, predicted: 63 },
  { day: "Sáb", actual: null, predicted: 59 },
  { day: "Dom", actual: null, predicted: 56 },
]

const riskData = [
  { time: "00:00", risk: 20 },
  { time: "06:00", risk: 35 },
  { time: "12:00", risk: 75 },
  { time: "18:00", risk: 45 },
  { time: "24:00", risk: 25 },
]

export function PredictiveAnalyticsPanel() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Predictive Forecasting */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">AquaNet</span>
            <span className="font-semibold">AquaNet</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Proyección Predictiva y Recomendaciones</h2>

          <div className="mb-6">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <div className="text-destructive font-semibold text-sm mb-1">ALERTA</div>
                  <div className="text-sm text-foreground">Pozo 7 posible fuga detectada sobrecurso en este día.</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-2">Predicción de Consumo (7 días)</div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 0, r: 4 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 0, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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

          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground mb-2">Recomendación</div>
            <div className="text-sm text-muted-foreground">Reducir el uso en un 5% para alcanzar la meta mensual</div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations and Actions */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">Acciones</span>
            <span className="font-semibold">AquaNet</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recomendaciones Inteligentes</h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-3 bg-chart-1/10 rounded-lg">
              <Droplets className="w-5 h-5 text-chart-1 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-1">Precisión</div>
                <div className="text-xs text-muted-foreground">Activar el riego a 1hr</div>
              </div>
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Activar
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
              <Settings className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-1">Optimización</div>
                <div className="text-xs text-muted-foreground">Conectar la torre 5 a la PTAA para reciclar agua</div>
              </div>
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Conectar
              </Button>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-secondary mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-1">Eficiencia</div>
                <div className="text-xs text-muted-foreground">Las torres de enfriamiento usan ≤ 30%</div>
              </div>
              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                Revisar
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-2">Nivel de Riesgo (24h)</div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    fill="url(#riskGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-secondary">94%</div>
              <div className="text-xs text-muted-foreground">Precisión IA</div>
            </div>
            <div>
              <div className="text-lg font-bold text-chart-1">3</div>
              <div className="text-xs text-muted-foreground">Acciones Pendientes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
