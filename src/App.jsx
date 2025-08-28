import { Routes, Route } from 'react-router'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
}

export default App
