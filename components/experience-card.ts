import React from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import type { Experience } from '../types';

interface ExperienceCardProps {
  experience: Experience;
  onClick: (experience: Experience) => void;
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

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onClick }) => {
  return (
    <div 
      className="experience-card rounded-xl cursor-pointer card-hover"
      onClick={() => onClick(experience)}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={experience.thumbnailUrl}
          alt={experience.title}
          className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
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
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Creator */}
        <div>
          <h3 className="font-bold text-white text-lg leading-tight line-clamp-1">
            {experience.title}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <img
              src={experience.creatorAvatarUrl}
              alt={experience.creator}
              className="h-5 w-5 rounded-full"
            />
            <p className="text-sm text-gray-400">by {experience.creator}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
          {experience.description}
        </p>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <div className="flex items-center space-x-1 text-gray-400">
            <Icon svg={ICONS.users} className="h-4 w-4" />
            <span className="text-sm font-medium">
              {experience.playerCount.toLocaleString()}
            </span>
          </div>
          
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-1">
            <Icon svg={ICONS.play} className="h-4 w-4" />
            <span>Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;