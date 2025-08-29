import { Routes, Route } from 'react-router'
import DashboardPage from './pages/DashboardPage'
import WellsPage from './pages/WellsPage'
import WellDetailPage from './pages/WellDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/pozos" element={<WellsPage />} />
      <Route path="/pozos/:id" element={<WellDetailPage />} />
    </Routes>
  );
}

export default App
