'use client';

import { useState } from 'react';

interface FiltersProps {
  onApplyFilters: (filters: {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    location: string;
  }) => void;
}

export default function Filters({ onApplyFilters }: FiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [location, setLocation] = useState('');

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategories([...categories, category]);
    } else {
      setCategories(categories.filter(c => c !== category));
    }
  };

  const handleApply = () => {
    onApplyFilters({ categories, minPrice, maxPrice, location });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Kategoriler</h3>
        <div className="space-y-2">
          {['Yat', 'Parça', 'Marina'].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={categories.includes(category)}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Fiyat Aralığı</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-700">Minimum Fiyat</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Maksimum Fiyat</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Konum</h3>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="">Tümü</option>
          <option value="İstanbul">İstanbul</option>
          <option value="İzmir">İzmir</option>
          <option value="Antalya">Antalya</option>
          <option value="Muğla">Muğla</option>
        </select>
      </div>

      <button
        onClick={handleApply}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Filtreleri Uygula
      </button>
    </div>
  );
}