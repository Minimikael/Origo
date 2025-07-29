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
import SupabaseTest from './components/common/SupabaseTest';
import { UI_CONSTANTS } from './config/constants';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <DocumentProvider>
            <AIProvider>
              <div className="h-screen w-screen overflow-hidden bg-gray-900">
                <Header onMenuClick={toggleSidebar} />

                <div className="flex h-full">
                  {/* Floating Sidebar */}
                  <div className={`fixed top-16 left-0 h-full z-40 transition-all duration-${UI_CONSTANTS.ANIMATION_DURATION} ease-in-out ${
                    sidebarOpen && showNavbar ? `w-${UI_CONSTANTS.SIDEBAR_WIDTH / 4}` : `w-${UI_CONSTANTS.COLLAPSED_SIDEBAR_WIDTH / 4}`
                  }`}>
                    <Sidebar isOpen={sidebarOpen && showNavbar} onToggle={toggleSidebar} />
                  </div>

                  {/* Main Content */}
                  <div className={`flex-1 transition-all duration-${UI_CONSTANTS.ANIMATION_DURATION} ease-in-out ${
                    sidebarOpen && showNavbar ? `ml-${UI_CONSTANTS.SIDEBAR_WIDTH / 4}` : `ml-${UI_CONSTANTS.COLLAPSED_SIDEBAR_WIDTH / 4}`
                  }`}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/editor/:documentId" element={<Editor showNavbar={showNavbar} setShowNavbar={setShowNavbar} />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/design-system" element={<DesignSystemShowcase />} />
                      <Route path="/supabase-test" element={<SupabaseTest />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </AIProvider>
          </DocumentProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 