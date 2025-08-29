import { Card, CardContent, CardHeader } from "../components/ui/card"

export function WaterBalanceFlow() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm">Balance Hídrico</span>
          <span className="font-semibold">BlueMetrics</span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Flujo de Distribución del Agua</h2>

        <div className="relative">
          {/* Water Sources (Left Side) */}
          <div className="absolute left-0 top-0 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-chart-1 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Pozos</div>
                <div className="text-xs text-muted-foreground">45.000 m³</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-chart-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Agua Filtrada</div>
                <div className="text-xs text-muted-foreground">10.000 m³</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-chart-3 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Agua y Drenaje</div>
                <div className="text-xs text-muted-foreground">5.000 m³</div>
              </div>
            </div>
          </div>

          {/* Flow Visualization (Center) */}
          <div className="mx-auto w-64 h-48 relative">
            <svg className="w-full h-full" viewBox="0 0 256 192">
              {/* Flow lines from sources to destinations */}
              <defs>
                <linearGradient id="flow1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="flow2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="flow3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Curved flow paths */}
              <path d="M 20 30 Q 128 60 236 40" stroke="url(#flow1)" strokeWidth="8" fill="none" opacity="0.7" />
              <path d="M 20 96 Q 128 110 236 100" stroke="url(#flow2)" strokeWidth="12" fill="none" opacity="0.7" />
              <path d="M 20 162 Q 128 140 236 160" stroke="url(#flow3)" strokeWidth="6" fill="none" opacity="0.7" />

              {/* Flow direction indicators */}
              <circle cx="80" cy="45" r="3" fill="hsl(var(--chart-1))" opacity="0.8">
                <animate attributeName="cx" values="80;180;80" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="90" cy="105" r="4" fill="hsl(var(--chart-2))" opacity="0.8">
                <animate attributeName="cx" values="90;190;90" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="70" cy="155" r="2" fill="hsl(var(--chart-3))" opacity="0.8">
                <animate attributeName="cx" values="70;170;70" dur="3.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          {/* Water Destinations (Right Side) */}
          <div className="absolute right-0 top-0 space-y-8">
            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Riego</div>
                <div className="text-xs text-muted-foreground">3.000 m³</div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Torres de Enfriamiento</div>
                <div className="text-xs text-muted-foreground">16.000 m³</div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-row-reverse">
              <div className="w-4 h-4 rounded-full bg-chart-1 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">Edificios</div>
                <div className="text-xs text-muted-foreground">5.000 m³</div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-chart-1">60.000</div>
              <div className="text-xs text-muted-foreground">Total Entrada m³</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24.000</div>
              <div className="text-xs text-muted-foreground">Total Consumo m³</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">36.000</div>
              <div className="text-xs text-muted-foreground">Reserva m³</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
