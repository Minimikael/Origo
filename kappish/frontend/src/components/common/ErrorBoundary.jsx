import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo }) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-200 text-center mb-2">
          Something went wrong
        </h2>
        
        <p className="text-gray-400 text-center mb-6">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-4 text-xs">
            <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
              Error Details (Development)
            </summary>
            <div className="mt-2 p-3 bg-gray-700 rounded text-red-300 font-mono">
              <div className="mb-2">
                <strong>Error:</strong>
                <pre className="whitespace-pre-wrap">{error.toString()}</pre>
              </div>
              {errorInfo && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={handleRetry}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary; 