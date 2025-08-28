import { Card, CardContent, CardHeader } from "../components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts"

const wellConsumptionData = [
  { name: "Ene", actual: 45, target: 50 },
  { name: "Feb", actual: 52, target: 50 },
  { name: "Mar", actual: 48, target: 50 },
  { name: "Abr", actual: 61, target: 50 },
  { name: "May", actual: 55, target: 50 },
  { name: "Jun", actual: 67, target: 50 },
]

const historicalData = [
  { day: 1, consumption: 45 },
  { day: 5, consumption: 52 },
  { day: 10, consumption: 48 },
  { day: 15, consumption: 55 },
  { day: 20, consumption: 61 },
  { day: 25, consumption: 58 },
  { day: 30, consumption: 54 },
]

export function WellMonitoringCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Well Visualization */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">25 mar 24</span>
            <span className="font-semibold">AquaNet</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Visualización por Pozo</h2>

          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-1">23 mar, 2024</div>
            <div className="text-sm text-muted-foreground mb-2">Consumo Diario vs. Meta</div>
            <div className="text-3xl font-bold text-foreground mb-4">54,2 m³</div>
          </div>

          <div className="mb-6">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wellConsumptionData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Bar dataKey="actual" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="target" fill="hsl(var(--muted))" radius={[2, 2, 0, 0]} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-2"></div>
                <span className="text-xs text-muted-foreground">Meta</span>
              </div>
              <div className="text-xs text-muted-foreground">Reducir el uso en un 5% para alcanzar la meta mensual</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-2">Historial de Consumo</div>
            <div className="text-sm text-muted-foreground">(Últimos 30 Días)</div>
          </div>
        </CardContent>
      </Card>

      {/* Well Status and Performance */}
      <Card className="bg-card border-border">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm">Pozo 11</span>
            <span className="font-semibold">AquaNet</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Estado del Pozo</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">11</div>
              <div className="text-sm text-muted-foreground">Pozo Activo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">98%</div>
              <div className="text-sm text-muted-foreground">Eficiencia</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-2">Tendencia de Consumo (30 días)</div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="consumption"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fill="url(#consumptionGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-sm font-medium">Estado Operativo</span>
              </div>
              <span className="text-sm text-secondary font-medium">Normal</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-chart-1/10 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-chart-1"></div>
                <span className="text-sm font-medium">Nivel de Agua</span>
              </div>
              <span className="text-sm text-chart-1 font-medium">Alto</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <span className="text-sm font-medium">Límite Diario</span>
              </div>
              <span className="text-sm text-destructive font-medium">Excedido</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
