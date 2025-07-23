import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchFilters from '../components/shops/SearchFilters';
import ShopList from '../components/shops/ShopList';
import { searchShops } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isMerchant } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('');

  const fetchShops = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      
      const searchParams = {
        ...filters,
        category: filters.category === 'all' ? '' : filters.category
      };
      
      const response = await searchShops(searchParams);
      setShops(response.data.shops);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  // Load initial shops
  useEffect(() => {
    fetchShops();
  }, []);

  const handleSearch = () => {
    fetchShops({
      search: searchTerm,
      category,
      city
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Local Businesses
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Connect with amazing shops and services in your community. 
            Support local, shop local, grow local.
          </p>
          
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link to="/register" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Join Now
              </Link>
              <Link to="/register" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
                List Your Shop
              </Link>
            </div>
          )}
          
          {isAuthenticated && isMerchant && (
            <Link to="/dashboard" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Manage Your Shops
            </Link>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            category={category}
            setCategory={setCategory}
            city={city}
            setCity={setCity}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Shops Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || category !== 'all' || city ? 'Search Results' : 'Featured Shops'}
            </h2>
            <p className="text-gray-600">
              {shops.length} shop{shops.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <ShopList shops={shops} loading={loading} error={error} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose LocalConnect?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're more than just a directory - we're your gateway to discovering 
              and supporting amazing local businesses in your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Discovery</h3>
              <p className="text-gray-600">
                Find amazing businesses right in your neighborhood. Support local, 
                reduce travel, build community.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Contact</h3>
              <p className="text-gray-600">
                Connect instantly with WhatsApp, phone calls, or email. 
                No complicated booking systems.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">
                Every purchase helps strengthen your local economy and 
                supports your neighbors' dreams.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;