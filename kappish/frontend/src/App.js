import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';
import { AIProvider } from './context/AIContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Auth from './pages/Auth';
import DesignSystemShowcase from './components/common/DesignSystemShowcase';

import { UI_CONSTANTS } from './config/constants';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNavbar] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <DocumentProvider>
            <AIProvider>
              <Routes>
                <Route path="/" element={
                  <div className="h-screen w-screen overflow-hidden bg-gray-900 flex flex-col">
                    <Header onMenuClick={toggleSidebar} />
                    <div className="flex flex-1">
                      {/* Sidebar */}
                      <div className={`transition-all duration-${UI_CONSTANTS.ANIMATION_DURATION} ease-in-out ${
                        sidebarOpen && showNavbar ? 'w-64' : 'w-16'
                      }`}>
                        <Sidebar isOpen={sidebarOpen && showNavbar} onToggle={toggleSidebar} />
                      </div>
                      {/* Main Content */}
                      <div className="flex-1 overflow-hidden">
                        <Dashboard />
                      </div>
                    </div>
                  </div>
                } />
                <Route path="/editor/:documentId" element={<Editor />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/design-system" element={<DesignSystemShowcase />} />
              </Routes>
            </AIProvider>
          </DocumentProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 