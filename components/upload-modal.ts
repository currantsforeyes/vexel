import React, { useState } from 'react';
import { Icon } from './Icon';
import { ICONS } from '../constants';
import type { AvatarCategory } from '../types';

interface UploadModalProps {
  file: File;
  onClose: () => void;
  onUpload: (details: { name: string; category: AvatarCategory }) => void;
}

const categories: AvatarCategory[] = ['Hats', 'Shirts', 'Pants', 'Accessories'];

const UploadModal: React.FC<UploadModalProps> = ({ file, onClose, onUpload }) => {
  const [name, setName] = useState(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension
  const [category, setCategory] = useState<AvatarCategory>('Hats');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onUpload({ name: name.trim(), category });
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Upload Avatar Asset</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            disabled={isUploading}
          >
            <Icon svg={ICONS.arrowLeft} className="h-5 w-5 rotate-45" />
          </button>
        </div>

        {/* File Info */}
        <div className="bg-gray-700 rounded-lg p-4 flex items-center space-x-3">
          <Icon svg={ICONS.cube} className="h-8 w-8 text-indigo-400" />
          <div>
            <p className="text-white font-medium truncate">{file.name}</p>
            <p className="text-gray-400 text-sm">
              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Asset Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Enter a name for your asset"
              required
              disabled={isUploading}
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    category === cat
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  disabled={isUploading}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Guidelines */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Upload Guidelines</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Supported formats: .glb, .gltf</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Assets should be optimized for real-time rendering</li>
              <li>• Ensure proper UV mapping and textures</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              disabled={isUploading || !name.trim()}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Icon svg={ICONS.upload} className="h-5 w-5" />
                  <span>Upload Asset</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;