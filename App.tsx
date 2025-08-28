import React, { useState, useCallback, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import type { Experience } from './types';

// Lazy load components for better performance
const ExperienceDetail = lazy(() => import('./components/ExperienceDetail'));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const AvatarPage = lazy(() => import('./pages/AvatarPage'));

// Loading spinner component
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-indigo-500 mx-auto mb-4"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  </div>
);

// Page loading fallback
const PageLoadingFallback: React.FC = () => (
  <LoadingSpinner message="Loading page..." />
);

const App: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [activePage, setActivePage] = useState<string>('Home');

  // Memoize handlers to prevent unnecessary re-renders
  const handleExperienceSelect = useCallback((experience: Experience) => {
    setSelectedExperience(experience);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedExperience(null);
  }, []);

  const handleNavClick = useCallback((page: string) => {
    // Reset detail view when changing pages for a cleaner UX
    setSelectedExperience(null);
    setActivePage(page);
  }, []);

  const renderContent = () => {
    if (selectedExperience) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <ExperienceDetail experience={selectedExperience} onBack={handleBack} />
        </Suspense>
      );
    }

    switch (activePage) {
      case 'Home':
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <HomePage onExperienceClick={handleExperienceSelect} onNavClick={handleNavClick} />
          </Suspense>
        );
      case 'Discover':
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <DiscoverPage onExperienceClick={handleExperienceSelect} />
          </Suspense>
        );
      case 'Avatar':
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <AvatarPage />
          </Suspense>
        );
      case 'Create':
      case 'Store':
      case 'Friends':
      case 'Profile':
      case 'Settings':
      case 'Billing':
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <PlaceholderPage title={activePage} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<PageLoadingFallback />}>
            <HomePage onExperienceClick={handleExperienceSelect} onNavClick={handleNavClick} />
          </Suspense>
        );
    }
  };

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to analytics/monitoring service
        console.error('App Error:', error, errorInfo);
        // In production, you might send this to Sentry or another service
      }}
    >
      <div className="flex h-screen bg-gray-900 text-gray-100">
        {/* Sidebar with error boundary */}
        <ErrorBoundary
          fallback={
            <div className="w-64 bg-gray-800 flex items-center justify-center">
              <p className="text-gray-400 text-sm">Navigation unavailable</p>
            </div>
          }
        >
          <Sidebar activePage={activePage} onNavClick={handleNavClick} />
        </ErrorBoundary>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with error boundary */}
          <ErrorBoundary
            fallback={
              <div className="h-16 bg-gray-800 flex items-center px-6">
                <p className="text-gray-400">Header unavailable</p>
              </div>
            }
          >
            <Header onNavClick={handleNavClick} />
          </ErrorBoundary>

          {/* Main content with error boundary */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <ErrorBoundary
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-red-400 mb-2">
                      Page failed to load
                    </p>
                    <p className="text-gray-400 mb-4">
                      Try refreshing the page or navigate to a different section.
                    </p>
                    <button
                      onClick={() => handleNavClick('Home')}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Go to Home
                    </button>
                  </div>
                </div>
              }
            >
              {renderContent()}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;