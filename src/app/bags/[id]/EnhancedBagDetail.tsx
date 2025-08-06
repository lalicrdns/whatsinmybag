'use client'

import React, { useState, useRef } from 'react';
import { Upload, Plus, X, Save, ArrowLeft, Share2, Download } from 'lucide-react';

// Define types that match what we expect from the serialized data
interface Bag {
  id: string;
  title: string;
  description: string | null;
  isPrivate: boolean;
  createdAt: string;
  userId: string;
}

interface Item {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  category: string | null;
  bagId: string;
  createdAt: string;
  imageUrl?: string;
  x?: number;
  y?: number;
  rotation?: number;
}

interface Props {
  bag: Bag;
  items: Item[];
}

function EnhancedBagDetail({ bag, items: initialItems = [] }: Props) {
  const [items, setItems] = useState(
    initialItems.map(item => ({
      ...item,
      x: item.x ?? Math.random() * 200 + 100,
      y: item.y ?? Math.random() * 150 + 100,
      rotation: item.rotation ?? Math.random() * 20 - 10,
      image: item.imageUrl || '📦'
    }))
  );
  
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('gradient-1');
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [bagImage, setBagImage] = useState<string | null>(null);
  const [bagPosition, setBagPosition] = useState({ x: 50, y: 60 });
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    category: '',
    imageUrl: ''
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const backgrounds = [
    { id: 'gradient-1', name: 'Soft Pink', style: 'bg-gradient-to-br from-pink-100 to-pink-200' },
    { id: 'gradient-2', name: 'Ocean Blue', style: 'bg-gradient-to-br from-blue-100 to-blue-200' },
    { id: 'gradient-3', name: 'Mint Green', style: 'bg-gradient-to-br from-green-100 to-green-200' },
    { id: 'gradient-4', name: 'Lavender', style: 'bg-gradient-to-br from-purple-100 to-purple-200' },
    { id: 'gradient-5', name: 'Peach', style: 'bg-gradient-to-br from-orange-100 to-orange-200' },
    { id: 'solid-white', name: 'Clean White', style: 'bg-white' },
    { id: 'solid-cream', name: 'Warm Cream', style: 'bg-yellow-50' }
  ];

  const categories = [
    'electronics', 'clothing', 'toiletries', 'documents', 
    'accessories', 'food', 'beauty', 'tech', 'other'
  ];

  const handleMouseDown = (e: React.MouseEvent, item: Item) => {
    setDraggedItem(item.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const offsetX = e.clientX - rect.left - (item.x || 0);
    const offsetY = e.clientY - rect.top - (item.y || 0);
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const newX = Math.max(0, Math.min(e.clientX - rect.left - offsetX, rect.width - 80));
      const newY = Math.max(0, Math.min(e.clientY - rect.top - offsetY, rect.height - 80));
      
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, x: newX, y: newY } : i
      ));
    };
    
    const handleMouseUp = () => {
      setDraggedItem(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const addNewItem = async () => {
    if (!newItem.name.trim()) return;
    
    try {
      const res = await fetch('/api/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          bagId: bag.id
        })
      });

      if (res.ok) {
        const savedItem = await res.json();
        const itemWithPosition = {
          ...savedItem,
          x: Math.random() * 200 + 100,
          y: Math.random() * 150 + 100,
          rotation: Math.random() * 20 - 10,
          image: newItem.imageUrl || '📦'
        };
        
        setItems(prev => [...prev, itemWithPosition]);
        setNewItem({ name: '', description: '', quantity: 1, category: '', imageUrl: '' });
        setShowAddItem(false);
        alert('Item added successfully!');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  const removeItem = async (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'bag' | 'item') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'bag') {
          setBagImage(e.target?.result as string);
        } else {
          setNewItem(prev => ({ ...prev, imageUrl: e.target?.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveLayout = async () => {
    console.log('Saving layout:', { items, bagPosition, selectedBackground });
    alert('Layout saved!');
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={goBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{bag.title}</h1>
              {bag.description && <p className="text-sm text-gray-600">{bag.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Download size={20} />
            </button>
            <button 
              onClick={saveLayout}
              className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save Layout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 max-h-screen overflow-y-auto">
          {!showAddItem ? (
            <>
              {/* Background Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Choose Background</h3>
                <div className="grid grid-cols-3 gap-2">
                  {backgrounds.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg.id)}
                      className={`h-16 rounded-lg border-2 transition-all ${bg.style} ${
                        selectedBackground === bg.id ? 'border-blue-500 scale-105' : 'border-gray-200'
                      }`}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>

              {/* Bag Upload */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Add Your Bag</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50">
                  {bagImage ? (
                    <div className="relative">
                      <img src={bagImage} alt="Your bag" className="w-full h-32 object-contain rounded-lg" />
                      <button
                        onClick={() => setBagImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload your bag photo</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'bag')}
                        className="hidden"
                        id="bag-upload"
                      />
                      <label
                        htmlFor="bag-upload"
                        className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors text-sm"
                      >
                        Choose File
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Add Item Button */}
              <button
                onClick={() => setShowAddItem(true)}
                className="w-full mb-6 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add New Item
              </button>

              {/* Items List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Items ({items.length})</h3>
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-sm border">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-contain" />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        {item.category && (
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 mt-1 inline-block">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Add Item Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add New Item</h3>
                <button
                  onClick={() => setShowAddItem(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    placeholder="What's this item?"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Tell us about this item..."
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Photo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50">
                    {newItem.imageUrl ? (
                      <div className="relative">
                        <img src={newItem.imageUrl} alt="Item" className="w-full h-24 object-contain rounded-lg" />
                        <button
                          onClick={() => setNewItem(prev => ({ ...prev, imageUrl: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={20} className="mx-auto mb-1 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'item')}
                          className="hidden"
                          id="item-upload"
                        />
                        <label
                          htmlFor="item-upload"
                          className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors text-sm"
                        >
                          Upload Photo
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={addNewItem}
                  disabled={!newItem.name.trim()}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Item to Bag
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Arrange Your Items</h2>
              <p className="text-gray-600">Drag items around to create your perfect bag layout</p>
            </div>

            <div 
              ref={canvasRef}
              className={`relative w-full h-96 border border-gray-200 rounded-3xl shadow-sm overflow-hidden ${
                backgrounds.find(bg => bg.id === selectedBackground)?.style
              }`}
              style={{ aspectRatio: '16/10' }}
            >
              {/* Grid Pattern */}
              {showGrid && (
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}></div>
              )}

              {/* Items */}
              {items.map(item => (
                <div
                  key={item.id}
                  className={`absolute cursor-move select-none transition-all duration-200 hover:scale-105 ${
                    draggedItem === item.id ? 'z-20 scale-110 drop-shadow-xl' : 'z-10 drop-shadow-lg'
                  }`}
                  style={{
                    left: item.x,
                    top: item.y,
                    transform: `rotate(${item.rotation}deg)`,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, item)}
                >
                  <div className="relative group">
                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/50 shadow-lg">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    {showLabels && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {items.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/50 rounded-full flex items-center justify-center">
                      <Plus size={32} />
                    </div>
                    <p className="text-lg font-medium">Start building your bag</p>
                    <p className="text-sm">Add items to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="space-y-6">
            {/* Layout Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Layout Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Show grid</span>
                  <input 
                    type="checkbox" 
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Show labels</span>
                  <input 
                    type="checkbox" 
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="rounded" 
                  />
                </div>
              </div>
            </div>

            {/* Bag Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Bag Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Privacy:</span>
                  <span>{bag.isPrivate ? 'Private' : 'Public'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span>{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{new Date(bag.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Share & Export</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-sm">Export as Image</div>
                  <div className="text-xs text-gray-500">Save your layout as PNG</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-sm">Share Link</div>
                  <div className="text-xs text-gray-500">Let others see your bag</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Explicit default export at the bottom
export default EnhancedBagDetail;