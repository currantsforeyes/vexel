import React, { useState } from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';

interface HeaderProps {
  onNavClick: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Navigate to discover page with search
      onNavClick('Discover');
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search experiences, creators, or friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white placeholder-gray-500 rounded-full px-6 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <Icon svg={ICONS.search} className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Currency Display */}
          <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-full">
            <Icon svg={ICONS.currency} className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-white">12,450</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Icon svg={ICONS.notification} className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <img
                src="https://picsum.photos/seed/user/40/40"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">Username</p>
                <p className="text-xs text-gray-400">Level 25</p>
              </div>
              <Icon svg={ICONS.chevronDown} className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;