import React from 'react';
import ShopCard from './ShopCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ShopList = ({ shops, loading, error }) => {
  if (loading) {
    return <LoadingSpinner text="Loading shops..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Shops</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!shops || shops.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No shops found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map(shop => (
        <ShopCard key={shop._id} shop={shop} />
      ))}
    </div>
  );
};

export default ShopList;