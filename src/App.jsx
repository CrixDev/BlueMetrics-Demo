import { Routes, Route } from 'react-router'
import DashboardPage from './pages/DashboardPage'
import WellsPage from './pages/WellsPage'
import WellDetailPage from './pages/WellDetailPage'
import AddDataPage from './pages/AddDataPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/pozos" element={<WellsPage />} />
      <Route path="/pozos/:id" element={<WellDetailPage />} />
      <Route path="/agregar-datos" element={<AddDataPage />} />
    </Routes>
  );
}

export default App
