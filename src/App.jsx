import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Stats from './pages/Stats';
import Chatbot from './components/Chatbot';
import { AuthProvider } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('adminToken');
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>

        <Chatbot />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
