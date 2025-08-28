import React from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import { sidebarFriendsData } from '../data';

interface SidebarProps {
  activePage: string;
  onNavClick: (page: string) => void;
}

const navigationItems = [
  { name: 'Home', icon: ICONS.home },
  { name: 'Discover', icon: ICONS.discover },
  { name: 'Create', icon: ICONS.create },
  { name: 'Avatar', icon: ICONS.avatar },
  { name: 'Store', icon: ICONS.store }
];

const bottomItems = [
  { name: 'Friends', icon: ICONS.users },
  { name: 'Profile', icon: ICONS.profile },
  { name: 'Settings', icon: ICONS.settings },
  { name: 'Billing', icon: ICONS.billing }
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavClick }) => {
  return (
    <div className="w-80 bg-gray-800 flex flex-col h-full border-r border-gray-700">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
            <Icon svg={ICONS.logo} className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Nexus</h1>
            <p className="text-xs text-gray-400">Experiences</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map(item => (
          <button
            key={item.name}
            onClick={() => onNavClick(item.name)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 nav-item ${
              activePage === item.name ? 'active' : ''
            }`}
          >
            <Icon svg={item.icon} className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}

        {/* Friends Section */}
        <div className="pt-6 border-t border-gray-700 mt-6">
          <div className="flex items-center justify-between px-2 mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Friends</h3>
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              {sidebarFriendsData.filter(f => f.status === 'online').length}
            </span>
          </div>
          
          <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {sidebarFriendsData.map(friend => (
              <div
                key={friend.name}
                className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src={friend.avatar} 
                    alt={friend.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{friend.name}</p>
                  {friend.currentGame && (
                    <p className="text-xs text-gray-400 truncate">{friend.currentGame.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-700 p-4 space-y-1">
        {bottomItems.map(item => (
          <button
            key={item.name}
            onClick={() => onNavClick(item.name)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 nav-item ${
              activePage === item.name ? 'active' : ''
            }`}
          >
            <Icon svg={item.icon} className="h-5 w-5" />
            <span className="font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;