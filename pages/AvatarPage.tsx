import React, { useState, useRef, useEffect } from 'react';
import type { AvatarItem, AvatarCategory } from '../types';
import { avatarItems } from '../data';
import AvatarPreview from '../components/AvatarPreview';
import { Icon } from '../components/Icon';
import { ICONS } from '../constants';
import UploadModal from '../components/UploadModal';

const categories: AvatarCategory[] = ['Hats', 'Shirts', 'Pants', 'Accessories'];

const AvatarPage: React.FC = () => {
  const [allItems, setAllItems] = useState<AvatarItem[]>(avatarItems);
  const [equippedItems, setEquippedItems] = useState<AvatarItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AvatarCategory>('Hats');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleItemClick = (item: AvatarItem) => {
    setEquippedItems(prevItems => {
      const isEquipped = prevItems.some(i => i.id === item.id);
      if (isEquipped) {
        // Unequip
        return prevItems.filter(i => i.id !== item.id);
      } else {
        // Equip - remove other items from the same category unless it's an accessory
        const otherItems = item.category === 'Accessories' 
            ? prevItems
            : prevItems.filter(i => i.category !== item.category);
        return [...otherItems, item];
      }
    });
  };

  const handleReset = () => {
    setEquippedItems([]);
  };

  const handleSave = () => {
    console.log('Avatar saved:', equippedItems);
    alert('Avatar saved!');
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setFileToUpload(file);
          setIsModalOpen(true);
      }
      if (event.target) {
          event.target.value = '';
      }
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setFileToUpload(null);
  };

  const handleAssetUpload = (details: { name: string; category: AvatarCategory }) => {
      if (!fileToUpload) return;

      const newItem: AvatarItem = {
          id: `user-item-${Date.now()}`,
          name: details.name,
          modelUrl: URL.createObjectURL(fileToUpload),
          category: details.category,
      };

      setAllItems(prevItems => [...prevItems, newItem]);
      setSelectedCategory(newItem.category);
      handleCloseModal();
  };

  useEffect(() => {
    // Clean up object URLs to prevent memory leaks
    return () => {
      allItems.forEach(item => {
        if (item.modelUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.modelUrl);
        }
      });
    };
  }, [allItems]);

  const itemsForCategory = allItems.filter(item => item.category === selectedCategory);

  return (
    <>
      <input type="file" accept=".glb,.gltf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <div className="flex flex-col lg:flex-row h-full gap-8 animate-fade-in">
        {/* Left Column: Avatar Preview */}
        <div className="lg:w-1/2 bg-gray-800 rounded-2xl p-4 flex flex-col">
          <h2 className="text-2xl font-bold mb-4 text-center">Your Avatar</h2>
          <div className="flex-1 min-h-[400px]">
            <AvatarPreview equippedItems={equippedItems} />
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <button 
              onClick={handleSave}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Save Avatar
            </button>
            <button 
              onClick={handleReset}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold p-3 rounded-full transition-colors"
              aria-label="Reset Avatar"
            >
              <Icon svg={ICONS.reset} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Right Column: Item Selection */}
        <div className="lg:w-1/2 bg-gray-800 rounded-2xl p-6 flex flex-col">
          {/* Category Tabs */}
           <div className="flex justify-between items-center border-b border-gray-700 mb-4">
              <div className="flex">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`py-2 px-4 font-semibold transition-colors ${
                      selectedCategory === category
                        ? 'text-indigo-400 border-b-2 border-indigo-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                  onClick={handleUploadClick}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm"
              >
                  <Icon svg={ICONS.upload} className="h-4 w-4" />
                  <span>Upload Asset</span>
              </button>
          </div>

          {/* Item Grid */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {itemsForCategory.map(item => {
                const isEquipped = equippedItems.some(i => i.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex flex-col items-center justify-center bg-gray-700/50 ${
                      isEquipped ? 'border-indigo-500 scale-105' : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <Icon svg={ICONS.cube} className="w-1/2 h-1/2 text-gray-400" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center truncate">
                      {item.name}
                    </div>
                    {isEquipped && (
                      <div className="absolute top-1 right-1 bg-indigo-500 text-white rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* My Items Panel */}
          <div className="mt-6 border-t border-gray-700 pt-4">
              <h3 className="font-bold text-lg mb-2">My Items</h3>
              {equippedItems.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                      {equippedItems.map(item => (
                          <div key={item.id} className="flex items-center space-x-2 bg-gray-700 p-1 pr-2 rounded-full">
                              <Icon svg={ICONS.cube} className="h-6 w-6 text-gray-400" />
                              <span className="text-sm text-gray-200">{item.name}</span>
                          </div>
                      ))}
                  </div>
              ) : (
                  <p className="text-gray-500 text-sm">No items equipped. Select items from the grid above.</p>
              )}
          </div>
        </div>
      </div>
      {isModalOpen && fileToUpload && (
          <UploadModal 
              file={fileToUpload}
              onClose={handleCloseModal}
              onUpload={handleAssetUpload}
          />
      )}
    </>
  );
};

export default AvatarPage;