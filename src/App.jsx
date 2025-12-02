import { Routes, Route } from 'react-router'
import { AuthProvider } from './contexts/AuthContextNew'
import ProtectedRoute from './components/ProtectedRouteNew'
import AdminRoute from './components/AdminRouteNew'
import PermissionRoute from './components/PermissionRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPageNew'
import DashboardPage from './pages/DashboardPage'
import ConsumptionPage from './pages/ConsumptionPage'
import WaterBalancePage from './pages/WaterBalancePage'
import WellsPage from './pages/WellsPage'
import WellDetailPage from './pages/WellDetailPage'
import PTARPage from './pages/PTARPage'
import AddDataPage from './pages/AddDataPage'
import AddWeeklyReadingsPage from './pages/AddWeeklyReadingsPage'
import AddDailyReadingsPage from './pages/AddDailyReadingsPage'
import AddPTARReadingsPage from './pages/AddPTARReadingsPage'
import GasConsumptionPage from './pages/GasConsumptionPage'
import AddWeeklyGasReadingsPage from './pages/AddWeeklyGasReadingsPage'
import AlertsPage from './pages/AlertsPage'
import PredictionsPage from './pages/PredictionsPage'
import ContactPage from './pages/ContactPage'
import ConfirmationPage from './pages/ConfirmationPage'
import CorreosPage from './pages/CorreosPage'
import ExcelToSqlPage from './pages/ExcelToSqlPage'
import CsvToSqlDailyPage from './pages/CsvToSqlDailyPage'

// Excel to SQL - Agua (diferentes años)
import ExcelToSqlAgua2023 from './pages/ExcelToSql/ExcelToSqlAgua2023'
import ExcelToSqlAgua2024 from './pages/ExcelToSql/ExcelToSqlAgua2024'
import ExcelToSqlAgua2025 from './pages/ExcelToSql/ExcelToSqlAgua2025'

// Excel to SQL - Gas (diferentes años)
import ExcelToSqlGas2023 from './pages/ExcelToSql/ExcelToSqlGas2023'
import ExcelToSqlGas2024 from './pages/ExcelToSql/ExcelToSqlGas2024'
import ExcelToSqlGas2025 from './pages/ExcelToSql/ExcelToSqlGas2025'

// Excel to SQL - PTAR
import ExcelToSqlPTAR from './pages/ExcelToSql/ExcelToSqlPTAR'

import DailyReadingsPage from './pages/DailyReadingsPage'
import AnalysisSectionPage from './pages/AnalysisSectionPage'
import ErrorPage from './pages/ErrorPage'


function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirmacion" element={<ConfirmationPage />} />

        {/* Dashboard - requiere permiso dashboard */}
        <Route path="/dashboard" element={<PermissionRoute permission="dashboard"><DashboardPage /></PermissionRoute>} />
        
        {/* Rutas de AGUA - requieren permiso 'water' */}
        <Route path="/consumo" element={<PermissionRoute permission="water"><ConsumptionPage /></PermissionRoute>} />
        <Route path="/pozos" element={<PermissionRoute permission="water"><WellsPage /></PermissionRoute>} />
        <Route path="/pozos/:id" element={<PermissionRoute permission="water"><WellDetailPage /></PermissionRoute>} />
        <Route path="/lecturas-diarias" element={<PermissionRoute permission="water"><DailyReadingsPage /></PermissionRoute>} />
        
        {/* Balance hídrico - requiere permiso especial (no para water) */}
        <Route path="/balance" element={<PermissionRoute permission="dashboard"><WaterBalancePage /></PermissionRoute>} />
        
        {/* Rutas de GAS - requieren permiso 'gas' */}
        <Route path="/consumo-gas" element={<PermissionRoute permission="gas"><GasConsumptionPage /></PermissionRoute>} />
        
        {/* Rutas de PTAR - requieren permiso 'ptar' */}
        <Route path="/ptar" element={<PermissionRoute permission="ptar"><PTARPage /></PermissionRoute>} />
        
        {/* Rutas generales - todos los autenticados */}
        <Route path="/alertas" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/predicciones" element={<ProtectedRoute><PredictionsPage /></ProtectedRoute>} />
        <Route path="/analisis" element={<ProtectedRoute><AnalysisSectionPage /></ProtectedRoute>} />
        <Route path="/contacto" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />

        {/* Rutas de admin - requieren rol admin */}
        <Route path="/agregar-datos" element={<AdminRoute><AddDataPage /></AdminRoute>} />
        <Route path="/agregar-lecturas" element={<AdminRoute><AddWeeklyReadingsPage /></AdminRoute>} />
        <Route path="/agregar-lecturas-diarias" element={<AdminRoute><AddDailyReadingsPage /></AdminRoute>} />
        <Route path="/agregar-lecturas-gas" element={<AdminRoute><AddWeeklyGasReadingsPage /></AdminRoute>} />
        <Route path="/agregar-lecturas-ptar" element={<AdminRoute><AddPTARReadingsPage /></AdminRoute>} />
        <Route path="/correos" element={<AdminRoute><CorreosPage /></AdminRoute>} />
        <Route path="/excel-to-sql" element={<AdminRoute><ExcelToSqlPage /></AdminRoute>} />
        <Route path="/excel-to-sql/agua/2023" element={<AdminRoute><ExcelToSqlAgua2023 /></AdminRoute>} />
        <Route path="/excel-to-sql/agua/2024" element={<AdminRoute><ExcelToSqlAgua2024 /></AdminRoute>} />
        <Route path="/excel-to-sql/agua/2025" element={<AdminRoute><ExcelToSqlAgua2025 /></AdminRoute>} />
        <Route path="/excel-to-sql/gas/2023" element={<AdminRoute><ExcelToSqlGas2023 /></AdminRoute>} />
        <Route path="/excel-to-sql/gas/2024" element={<AdminRoute><ExcelToSqlGas2024 /></AdminRoute>} />
        <Route path="/excel-to-sql/gas/2025" element={<AdminRoute><ExcelToSqlGas2025 /></AdminRoute>} />
        <Route path="/excel-to-sql/ptar" element={<AdminRoute><ExcelToSqlPTAR /></AdminRoute>} />
        <Route path="/csv-to-sql-daily" element={<AdminRoute><CsvToSqlDailyPage /></AdminRoute>} />
        
        {/* Ruta 404 - debe estar al final */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App
