import React, { useCallback } from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import type { Experience } from '../types';

interface ExperienceCardProps {
  experience: Experience;
  onClick: (experience: Experience) => void;
  className?: string;
  showStats?: boolean;
}

const getGenreClass = (genre: string) => {
  const genreClasses = {
    Adventure: 'genre-adventure',
    Roleplay: 'genre-roleplay', 
    Combat: 'genre-combat',
    Simulation: 'genre-simulation',
    Obby: 'genre-obby',
    Racing: 'genre-racing'
  };
  return genreClasses[genre as keyof typeof genreClasses] || 'genre-adventure';
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({ 
  experience, 
  onClick, 
  className = "",
  showStats = true 
}) => {
  // Memoize click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    onClick(experience);
  }, [onClick, experience]);

  const handlePlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onClick(experience);
  }, [onClick, experience]);

  // Format player count for display
  const formatPlayerCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
  };

  return (
    <div 
      className={`experience-card rounded-xl cursor-pointer card-hover ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Play ${experience.title} by ${experience.creator}`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={experience.thumbnailUrl}
          alt={experience.title}
          className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23374151"/><text x="200" y="150" text-anchor="middle" dy="0.3em" fill="%236B7280" font-family="sans-serif" font-size="16">No Image</text></svg>`;
          }}
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Icon svg={ICONS.play} className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Genre Badge */}
        <div className="absolute top-3 left-3">
          <span className={`genre-badge ${getGenreClass(experience.genre)}`}>
            {experience.genre}
          </span>
        </div>

        {/* Player count overlay */}
        {showStats && (
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm">
            {formatPlayerCount(experience.playerCount)} playing
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Creator */}
        <div>
          <h3 className="font-bold text-white text-lg leading-tight line-clamp-1" title={experience.title}>
            {experience.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <img
              src={experience.creatorAvatarUrl}
              alt={experience.creator}
              className="h-5 w-5 rounded-full"
              loading="lazy"
              onError={(e) => {
                // Fallback avatar
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="%236B7280" rx="10"/><text x="10" y="10" text-anchor="middle" dy="0.3em" fill="%23374151" font-family="sans-serif" font-size="8">${experience.creator[0]}</text></svg>`;
              }}
            />
            <p className="text-sm text-gray-400 truncate" title={`by ${experience.creator}`}>
              by {experience.creator}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed" title={experience.description}>
          {experience.description}
        </p>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          {showStats && (
            <div className="flex items-center space-x-1 text-gray-400">
              <Icon svg={ICONS.users} className="h-4 w-4" />
              <span className="text-sm font-medium">
                {formatPlayerCount(experience.playerCount)}
              </span>
            </div>
          )}
          
          <button 
            onClick={handlePlayClick}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label={`Play ${experience.title}`}
          >
            <Icon svg={ICONS.play} className="h-4 w-4" />
            <span>Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(ExperienceCard, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.experience.id === nextProps.experience.id &&
    prevProps.experience.playerCount === nextProps.experience.playerCount &&
    prevProps.showStats === nextProps.showStats &&
    prevProps.className === nextProps.className
  );
});