import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AlertsProvider } from './context/AlertsContext.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import DeviceList from './pages/devices/DeviceList.jsx'
import AlertInbox from './pages/alerts/AlertInbox.jsx'
import Login from './pages/auth/Login.jsx'
import DeviceDetail from './pages/devices/DeviceDetail.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AlertsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/devices/:id" element={<DeviceDetail />} />
            <Route path="/alerts" element={<AlertInbox />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AlertsProvider>
    </BrowserRouter>
  )
}
