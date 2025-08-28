import React, { useState } from 'react';
import ExperienceCard from './ExperienceCard';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import type { Experience } from '../types';

interface ExperienceGridProps {
  title: string;
  experiences: Experience[];
  onExperienceClick: (experience: Experience) => void;
  showFilters?: boolean;
}

const genres = ['All', 'Adventure', 'Roleplay', 'Combat', 'Simulation', 'Obby', 'Racing'];

const ExperienceGrid: React.FC<ExperienceGridProps> = ({ 
  title, 
  experiences, 
  onExperienceClick, 
  showFilters = false 
}) => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  const filteredExperiences = experiences
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
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
              >
                <option value="Popular">Popular</option>
                <option value="Newest">Newest</option>
                <option value="A-Z">A-Z</option>
              </select>
              <Icon svg={ICONS.chevronDown} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
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
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExperiences.map(experience => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onClick={onExperienceClick}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredExperiences.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Icon svg={ICONS.search} className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-semibold">No experiences found</p>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}
    </section>
  );
};

export default ExperienceGrid;