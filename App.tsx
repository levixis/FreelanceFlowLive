import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TimeLog from './pages/TimeLog';
import ClientsProjects from './pages/ClientsProjects';
import Invoicing from './pages/Invoicing';
import Login from './pages/Login';
import Register from './pages/Register';
import { StoreProvider } from './context/Store';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="time" element={<TimeLog />} />
                <Route path="projects" element={<ClientsProjects />} />
                <Route path="clients" element={<ClientsProjects />} />
                <Route path="invoices" element={<Invoicing />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </StoreProvider>
    </AuthProvider>
  );
}