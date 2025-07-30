import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';
import { AIProvider } from './context/AIContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Auth from './components/Auth';
import ErrorBoundary from './components/common/ErrorBoundary';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Main Layout Component
const MainLayout = ({ children }) => (
  <div className="flex flex-col h-screen bg-gray-900">
    <Header />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </div>
);

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <DocumentProvider>
          <AIProvider>
            <Router>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/editor/:documentId?" 
                  element={
                    <ProtectedRoute>
                      <Editor />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </AIProvider>
        </DocumentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; 