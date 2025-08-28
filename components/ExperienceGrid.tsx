import React, { useState, useMemo, useCallback } from 'react';
import ExperienceCard from './ExperienceCard';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import type { Experience } from '../types';

interface ExperienceGridProps {
  title: string;
  experiences: Experience[];
  onExperienceClick: (experience: Experience) => void;
  showFilters?: boolean;
  loading?: boolean;
  error?: string | null;
}

const genres = ['All', 'Adventure', 'Roleplay', 'Combat', 'Simulation', 'Obby', 'Racing'] as const;
const sortOptions = ['Popular', 'Newest', 'A-Z'] as const;

// Loading skeleton component
const ExperienceCardSkeleton: React.FC = () => (
  <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-700"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      <div className="h-3 bg-gray-700 rounded"></div>
      <div className="flex justify-between pt-2">
        <div className="h-3 bg-gray-700 rounded w-16"></div>
        <div className="h-8 bg-gray-700 rounded w-16"></div>
      </div>
    </div>
  </div>
);

// Error component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="text-center py-12">
    <Icon svg={ICONS.search} className="h-16 w-16 mx-auto mb-4 text-red-500" />
    <p className="text-lg font-semibold text-red-400">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

const ExperienceGrid: React.FC<ExperienceGridProps> = ({ 
  title, 
  experiences, 
  onExperienceClick, 
  showFilters = false,
  loading = false,
  error = null
}) => {
  const [selectedGenre, setSelectedGenre] = useState<typeof genres[number]>('All');
  const [sortBy, setSortBy] = useState<typeof sortOptions[number]>('Popular');

  // Memoize filtered and sorted experiences to prevent unnecessary recalculations
  const filteredExperiences = useMemo(() => {
    if (!experiences || experiences.length === 0) return [];

    return experiences
      .filter(exp => selectedGenre === 'All' || exp.genre === selectedGenre)
      .sort((a, b) => {
        switch (sortBy) {
          case 'Popular':
            return b.playerCount - a.playerCount;
          case 'Newest':
            return parseInt(b.id) - parseInt(a.id);
          case 'A-Z':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [experiences, selectedGenre, sortBy]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleGenreChange = useCallback((genre: typeof genres[number]) => {
    setSelectedGenre(genre);
  }, []);

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as typeof sortOptions[number]);
  }, []);

  // Show error state
  if (error) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <ErrorMessage message={error} />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        
        {showFilters && (
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
                disabled={loading}
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <Icon svg={ICONS.chevronDown} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button 
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Icon svg={ICONS.filter} className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Genre Filter Pills */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              disabled={loading}
              className={`px-4 py-2 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedGenre === genre
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      )}

      {/* Results Count */}
      {showFilters && !loading && (
        <div className="text-sm text-gray-400">
          Showing {filteredExperiences.length} of {experiences.length} experiences
          {selectedGenre !== 'All' && ` in ${selectedGenre}`}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Show loading skeletons
          Array.from({ length: 8 }, (_, i) => (
            <ExperienceCardSkeleton key={`skeleton-${i}`} />
          ))
        ) : (
          // Show actual experiences
          filteredExperiences.map(experience => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onClick={onExperienceClick}
            />
          ))
        )}
      </div>

      {/* Empty State */}
      {!loading && filteredExperiences.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          <Icon svg={ICONS.search} className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-semibold">No experiences found</p>
          <p>
            {selectedGenre !== 'All' 
              ? `No ${selectedGenre.toLowerCase()} experiences match your criteria`
              : 'Try adjusting your filters or search terms'
            }
          </p>
          {selectedGenre !== 'All' && (
            <button
              onClick={() => handleGenreChange('All')}
              className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Show all experiences
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default React.memo(ExperienceGrid);