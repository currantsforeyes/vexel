import React from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import { mockReviews } from '../data';
import type { Experience } from '../types';

interface ExperienceDetailProps {
  experience: Experience;
  onBack: () => void;
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

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Icon
      key={i}
      svg={ICONS.star}
      className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
    />
  ));
};

const ExperienceDetail: React.FC<ExperienceDetailProps> = ({ experience, onBack }) => {
  const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length;

  return (
    <div className="animate-slide-in-right">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <Icon svg={ICONS.arrowLeft} className="h-5 w-5" />
        <span>Back to Browse</span>
      </button>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={experience.thumbnailUrl}
            alt={experience.title}
            className="w-full h-96 object-cover"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className={`genre-badge ${getGenreClass(experience.genre)}`}>
                    {experience.genre}
                  </span>
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.round(averageRating))}
                    <span className="text-white ml-2 font-semibold">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {experience.title}
                </h1>
                
                <div className="flex items-center space-x-4 text-gray-200">
                  <div className="flex items-center space-x-2">
                    <img
                      src={experience.creatorAvatarUrl}
                      alt={experience.creator}
                      className="h-8 w-8 rounded-full"
                    />
                    <span>by {experience.creator}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon svg={ICONS.users} className="h-5 w-5" />
                    <span>{experience.playerCount.toLocaleString()} playing</span>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 flex items-center space-x-2">
                <Icon svg={ICONS.play} className="h-6 w-6" />
                <span>Play Now</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">About This Experience</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {experience.description}
              </p>
            </section>

            {/* Reviews Section */}
            <section className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Reviews ({mockReviews.length})
                </h2>
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  Write Review
                </button>
              </div>

              <div className="space-y-6">
                {mockReviews.map(review => (
                  <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.authorAvatarUrl}
                        alt={review.author}
                        className="h-10 w-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-white">{review.author}</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Players</span>
                  <span className="text-white font-semibold">
                    {experience.playerCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Genre</span>
                  <span className="text-white font-semibold">{experience.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-semibold">
                    {averageRating.toFixed(1)}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reviews</span>
                  <span className="text-white font-semibold">{mockReviews.length