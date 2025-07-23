import React from 'react';

const SearchFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  category, 
  setCategory, 
  city, 
  setCity, 
  onSearch 
}) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'services', label: 'Services' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Shop name or keyword..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              placeholder="Enter city..."
              className="input-field"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;