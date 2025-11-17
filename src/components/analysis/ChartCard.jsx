import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Maximize2,
  Info,
  Download,
  BarChart3,
  LineChart,
  Table,
  TrendingUp,
  Droplets,
  Activity,
  Wind,
  Brain,
  Bell,
  LayoutDashboard,
  FileText
} from 'lucide-react'
import { CATEGORY_CONFIG } from '../../lib/charts-registry'

// Icon mapping
const ICON_MAP = {
  TrendingUp,
  Droplets,
  Activity,
  Wind,
  Brain,
  Bell,
  LayoutDashboard,
  BarChart3,
  LineChart,
  Table,
  FileText
}

/**
 * ChartCard Component
 * Displays a chart preview with animations and actions
 */
export function ChartCard({ chart, onView, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const categoryConfig = CATEGORY_CONFIG[chart.category] || {}
  const IconComponent = ICON_MAP[chart.icon] || BarChart3

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full bg-card border-border hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        {/* Header with Icon and Badge */}
        <CardHeader className="pb-3 space-y-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Animated Icon */}
              <motion.div 
                className={`p-2.5 rounded-lg ${categoryConfig.bgColor || 'bg-primary/10'} flex-shrink-0`}
                animate={isHovered ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <IconComponent className={`w-5 h-5 ${categoryConfig.textColor || 'text-primary'}`} />
              </motion.div>
              
              {/* Title */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-foreground leading-tight truncate">
                  {chart.title}
                </h3>
                {chart.featured && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Destacado
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Category Badge */}
            <Badge 
              variant="outline" 
              className={`${categoryConfig.bgColor} ${categoryConfig.textColor} ${categoryConfig.borderColor} text-xs flex-shrink-0`}
            >
              {categoryConfig.label || chart.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {chart.description}
          </p>

          {/* Chart Type and Data Source */}
          <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              <span className="capitalize">{chart.type}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>{chart.dataSource}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {chart.tags.slice(0, 4).map((tag, idx) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="px-2 py-0.5 bg-muted/50 rounded-full text-xs text-muted-foreground"
              >
                {tag}
              </motion.span>
            ))}
            {chart.tags.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{chart.tags.length - 4}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              size="sm" 
              onClick={() => onView(chart)}
              className="flex-1 group/btn"
            >
              <motion.div
                animate={isHovered ? { x: [0, 3, 0] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex items-center gap-2"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ver Completo</span>
              </motion.div>
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              className="flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Implement export functionality
              }}
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        </CardContent>

        {/* Hover Effect Overlay */}
        <motion.div
          className={`absolute inset-0 ${categoryConfig.color || 'bg-primary'} pointer-events-none`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.03 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </Card>
    </motion.div>
  )
}
