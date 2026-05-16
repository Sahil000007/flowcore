import { Component } from 'react';

/**
 * Error Boundary Component for catching React errors
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-700 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6">
                <summary className="cursor-pointer font-medium text-gray-700">Error Details</summary>
                <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40 text-red-600">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.resetError}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
