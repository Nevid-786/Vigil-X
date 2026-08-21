import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CardsPage } from './pages/CardsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-indigo-400 font-black text-sm">
        Authenticating NextTrack Command Center...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout = ({ audioEnabled, setAudioEnabled }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative ambient-bg">
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
      />

      {/* Perfectly Centered Widescreen Layout Container */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          unresolvedSOSCount={0}
        />

        <main className="flex-1 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage audioEnabled={audioEnabled} />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="cards" element={<CardsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="system" element={<SystemHealthPage />} />
            <Route
              path="settings"
              element={
                <SettingsPage audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} />
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
