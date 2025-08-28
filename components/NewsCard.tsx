import React from 'react';
import type { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const getCategoryColor = (category: string) => {
  const colors = {
    Event: 'bg-purple-500/20 text-purple-400',
    Update: 'bg-blue-500/20 text-blue-400',
    Community: 'bg-green-500/20 text-green-400',
    News: 'bg-yellow-500/20 text-yellow-400'
  };
  return colors[category as keyof typeof colors] || colors.News;
};

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors cursor-pointer group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <h3 className="font-bold text-white text-xl leading-tight group-hover:text-indigo-400 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {/* Read More */}
        <div className="pt-2">
          <span className="text-indigo-400 font-semibold text-sm group-hover:underline">
            Read More →
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;