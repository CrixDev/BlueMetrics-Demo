# 🚀 Quick Start Guide - Analysis Section

## Get Started in 2 Minutes

### 1. View the Analysis Section

```bash
# Start your dev server if not running
npm run dev

# Navigate to:
http://localhost:5173/analisis
```

Or click **"Análisis" → "Centro de Análisis"** in the sidebar.

---

## 2. Add Your First Custom Chart (5 Minutes)

### Step 1: Create Your Chart Component

Create `src/components/MyCustomChart.jsx`:

```jsx
export default function MyCustomChart() {
  return (
    <div className="p-6 bg-card rounded-lg border">
      <h3 className="text-xl font-bold mb-4">My Custom Chart</h3>
      <p>Your chart content goes here!</p>
      {/* Add your chart.js, recharts, or any visualization */}
    </div>
  )
}
```

### Step 2: Register in the Chart Registry

Edit `src/lib/charts-registry.js`:

```javascript
// Add to imports (if needed)
// import MyCustomChart from '../components/MyCustomChart'

// Add to CHARTS_REGISTRY array
export const CHARTS_REGISTRY = [
  // ... existing charts ...
  {
    id: 'my-custom-chart',
    title: 'My Custom Chart',
    description: 'This is my awesome custom chart that shows amazing data',
    component: 'MyCustomChart',
    category: CHART_CATEGORIES.CONSUMPTION, // Choose any category
    tags: ['custom', 'test', 'demo'],
    type: CHART_TYPES.LINE,
    dataSource: 'My Data Source',
    featured: true, // Set to true to highlight
    icon: 'LineChart'
  }
]
```

### Step 3: Import in ChartModal

Edit `src/components/analysis/ChartModal.jsx`:

```javascript
// Add import
import MyCustomChart from '../MyCustomChart'

// Add to COMPONENT_MAP
const COMPONENT_MAP = {
  // ... existing components ...
  MyCustomChart,
}
```

### Step 4: See It Live! 🎉

Refresh `/analisis` and your chart will appear!

- Search for it by name or tags
- Filter by category
- Click "Ver Completo" to see it in modal

---

## 3. Common Use Cases

### Use Case 1: Add a New Category

Edit `charts-registry.js`:

```javascript
export const CHART_CATEGORIES = {
  // ... existing ...
  SECURITY: 'security', // New category
}

export const CATEGORY_CONFIG = {
  // ... existing ...
  [CHART_CATEGORIES.SECURITY]: {
    label: 'Seguridad',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200'
  }
}
```

### Use Case 2: Make a Chart Featured

In `CHARTS_REGISTRY`:

```javascript
{
  // ... other properties ...
  featured: true, // Just set this to true!
}
```

### Use Case 3: Add Multiple Tags

```javascript
{
  // ... other properties ...
  tags: ['consumo', 'tiempo-real', 'crítico', 'automatizado', 'alertas'],
  // Users can search by any of these tags
}
```

### Use Case 4: Change Icon

Available icons from `lucide-react`:

```javascript
{
  // ... other properties ...
  icon: 'TrendingUp',    // Trending
  // icon: 'BarChart3',   // Bar chart
  // icon: 'LineChart',   // Line chart
  // icon: 'PieChart',    // Pie chart
  // icon: 'Activity',    // Activity
  // icon: 'Brain',       // AI/ML
  // icon: 'Zap',         // Fast/Power
  // icon: 'Target',      // Goals
  // See: https://lucide.dev/icons
}
```

---

## 4. Customization Examples

### Change Grid Columns

Edit `AnalysisSectionPage.jsx`:

```jsx
// Find this line:
className="grid grid-cols-1 md:grid-cols-2 gap-6"

// Change to 3 columns:
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### Change Card Animation Speed

Edit `ChartCard.jsx`:

```jsx
// Find this:
transition={{ duration: 0.3, delay: index * 0.05 }}

// Make faster:
transition={{ duration: 0.2, delay: index * 0.03 }}
```

### Add a New Filter Type

Edit `FilterPanel.jsx` to add date range, data source, or any custom filter.

---

## 5. Troubleshooting

### Chart Not Showing?

**Check:**
1. ✅ Component imported in `ChartModal.jsx`
2. ✅ Added to `COMPONENT_MAP`
3. ✅ Registry entry is valid (no syntax errors)
4. ✅ Component name matches exactly

### Search Not Finding Chart?

**Check:**
1. ✅ Tags include searchable keywords
2. ✅ Title/description has the search term
3. ✅ No typos in registry entry

### Modal Not Opening?

**Check:**
1. ✅ Component renders without errors
2. ✅ Check browser console for errors
3. ✅ Component exports default

---

## 6. Best Practices

### ✅ DO:
- Use descriptive chart titles
- Add 3-5 relevant tags
- Set `featured: true` for important charts
- Use appropriate categories
- Write clear descriptions
- Choose matching icons

### ❌ DON'T:
- Use duplicate IDs
- Leave empty tags arrays
- Forget to import components
- Use non-existent icon names
- Create too many featured charts (keep under 10)

---

## 7. Advanced: Dynamic Data Loading

Example with props:

```jsx
// In your chart component
export default function MyChart({ startDate, endDate }) {
  const [data, setData] = useState([])
  
  useEffect(() => {
    // Fetch data based on dates
    fetchData(startDate, endDate).then(setData)
  }, [startDate, endDate])
  
  return <YourChartComponent data={data} />
}

// In ChartModal, pass props:
<Component startDate="2025-01-01" endDate="2025-12-31" />
```

---

## 8. Performance Tips

### For Many Charts (20+):

1. **Lazy Loading**:
```jsx
const MyChart = lazy(() => import('./MyChart'))
```

2. **Pagination**:
Add pagination to show 10-20 charts per page

3. **Virtualization**:
Use `react-window` for large lists

---

## 9. Integration with Existing Pages

Add a link from anywhere:

```jsx
import { Link } from 'react-router'

<Link to="/analisis" className="...">
  View All Charts
</Link>

// Or programmatically:
import { useNavigate } from 'react-router'

const navigate = useNavigate()
navigate('/analisis')
```

---

## 10. Export Feature (Coming Soon)

Placeholder is ready in `ChartCard.jsx` and `ChartModal.jsx`.

To implement:

```javascript
// In ChartCard or ChartModal
const handleExport = async (chart) => {
  // Use html2canvas or similar
  const canvas = await html2canvas(chartRef.current)
  const link = document.createElement('a')
  link.download = `${chart.id}.png`
  link.href = canvas.toDataURL()
  link.click()
}
```

---

## 📚 Additional Resources

- **Full Documentation**: `ANALYSIS_SECTION_README.md`
- **Feature Details**: `FEATURE_SUMMARY.md`
- **Component Code**: `src/components/analysis/`
- **Registry**: `src/lib/charts-registry.js`

---

## 🎯 Next Steps

1. ✅ Explore the Analysis Section at `/analisis`
2. ✅ Try filtering by categories and tags
3. ✅ Open charts in modal view
4. ✅ Add your first custom chart (follow Step 2)
5. ✅ Customize colors and animations
6. ✅ Share feedback!

---

**Happy Charting! 📊✨**

Need help? Check the full docs or review the code examples above.
