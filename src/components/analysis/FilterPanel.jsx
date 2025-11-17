import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3,
  Grid3x3,
  List
} from 'lucide-react'
import { 
  CHART_CATEGORIES, 
  CATEGORY_CONFIG,
  getAllTags 
} from '../../lib/charts-registry'

/**
 * FilterPanel Component
 * Provides search, category filtering, and tag filtering
 */
export function FilterPanel({ 
  searchQuery, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  selectedTags,
  onTagsChange,
  viewMode,
  onViewModeChange,
  showFeaturedOnly,
  onShowFeaturedChange,
  resultsCount
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAllTags, setShowAllTags] = useState(false)
  
  const allTags = getAllTags()
  const displayedTags = showAllTags ? allTags : allTags.slice(0, 12)

  const categories = Object.values(CHART_CATEGORIES)

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onSearchChange('')
    onCategoryChange(null)
    onTagsChange([])
    onShowFeaturedChange(false)
  }

  const hasActiveFilters = searchQuery || selectedCategory || selectedTags.length > 0 || showFeaturedOnly

  return (
    <Card className="bg-card border-border sticky top-4">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Filtros de Búsqueda</h2>
            {hasActiveFilters && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Badge variant="secondary">{resultsCount}</Badge>
              </motion.div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-5">
              {/* Search Bar */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Buscar gráficos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, descripción, tags..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Vista
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('grid')}
                    className="flex-1"
                  >
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    Cuadrícula
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onViewModeChange('list')}
                    className="flex-1"
                  >
                    <List className="w-4 h-4 mr-2" />
                    Lista
                  </Button>
                </div>
              </div>

              {/* Featured Only Toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFeaturedOnly}
                    onChange={(e) => onShowFeaturedChange(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Solo gráficos destacados</span>
                </label>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Categorías
                </label>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCategoryChange(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      !selectedCategory
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Todas
                  </motion.button>
                  
                  {categories.map((category) => {
                    const config = CATEGORY_CONFIG[category] || {}
                    const isSelected = selectedCategory === category
                    
                    return (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onCategoryChange(category)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? `${config.color} text-white`
                            : `${config.bgColor} ${config.textColor} hover:opacity-80`
                        }`}
                      >
                        {config.label || category}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Tags ({selectedTags.length} seleccionados)
                </label>
                <div className="flex flex-wrap gap-2">
                  {displayedTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    
                    return (
                      <motion.button
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {tag}
                      </motion.button>
                    )
                  })}
                </div>
                
                {allTags.length > 12 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="mt-2 w-full"
                  >
                    {showAllTags ? 'Ver menos' : `Ver todos (${allTags.length})`}
                  </Button>
                )}
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar filtros
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
