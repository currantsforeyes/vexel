import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ExperienceDetail from './components/ExperienceDetail';
import DiscoverPage from './pages/DiscoverPage';
import PlaceholderPage from './pages/PlaceholderPage';
import HomePage from './pages/HomePage';
import AvatarPage from './pages/AvatarPage';
import type { Experience } from './types';

const App: React.FC = () => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [activePage, setActivePage] = useState('Home');

  const handleExperienceSelect = (experience: Experience) => {
    setSelectedExperience(experience);
  };

  const handleBack = () => {
    setSelectedExperience(null);
  };

  const handleNavClick = (page: string) => {
    // Reset detail view when changing pages for a cleaner UX
    setSelectedExperience(null);
    setActivePage(page);
  };

  const renderContent = () => {
    if (selectedExperience) {
      return <ExperienceDetail experience={selectedExperience} onBack={handleBack} />;
    }

    switch (activePage) {
      case 'Home':
        return <HomePage onExperienceClick={handleExperienceSelect} onNavClick={handleNavClick} />;
      case 'Discover':
        return <DiscoverPage onExperienceClick={handleExperienceSelect} />;
      case 'Avatar':
        return <AvatarPage />;
      case 'Create':
      case 'Store':
      case 'Friends':
      case 'Profile':
      case 'Settings':
      case 'Billing':
        return <PlaceholderPage title={activePage} />;
      default:
        return <HomePage onExperienceClick={handleExperienceSelect} onNavClick={handleNavClick} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar activePage={activePage} onNavClick={handleNavClick} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNavClick={handleNavClick} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;