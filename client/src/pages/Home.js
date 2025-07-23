import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchFilters from '../components/shops/SearchFilters';
import ShopList from '../components/shops/ShopList';
import { searchShops } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { MapPin, Phone, Heart } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isMerchant } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('');

  useEffect(() => {
    const fetchShops = async (filters = {}) => {
      try {
        setLoading(true);
        setError('');
        const searchParams = { ...filters, category: filters.category === 'all' ? '' : filters.category };
        const response = await searchShops(searchParams);
        setShops(response.data.shops);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shops');
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  const handleSearch = () => {
    const fetchShops = async (filters = {}) => {
      try {
        setLoading(true);
        setError('');
        const searchParams = { ...filters, category: filters.category === 'all' ? '' : filters.category };
        const response = await searchShops(searchParams);
        setShops(response.data.shops);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load shops');
      } finally {
        setLoading(false);
      }
    };
    fetchShops({ search: searchTerm, category, city });
  };

  const Feature = ({ icon, title, children }) => (
    <div className="text-center">
      <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{children}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter"
          >
            Discover Local Businesses
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Connect with amazing shops and services in your community. Support local, shop local, grow local.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {!isAuthenticated && (
              <div className="space-x-4">
                <Button asChild size="lg"><Link to="/register">Join Now</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/register">List Your Shop</Link></Button>
              </div>
            )}
            {isAuthenticated && isMerchant && (
              <Button asChild size="lg"><Link to="/dashboard">Manage Your Shops</Link></Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Search & Shops Section */}
      <section className="py-12 -mt-16 relative z-30">
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
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {searchTerm || category !== 'all' || city ? 'Search Results' : 'Featured Shops'}
              </h2>
              {!loading && !error && <p className="text-muted-foreground">{shops.length} shop{shops.length !== 1 ? 's' : ''} found</p>}
            </div>
            <ShopList shops={shops} loading={loading} error={error} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Why Choose LocalConnect?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're more than just a directory - we're your gateway to discovering and supporting amazing local businesses in your community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon={<MapPin className="w-8 h-8" />} title="Local Discovery">
              Find amazing businesses right in your neighborhood. Support local, reduce travel, build community.
            </Feature>
            <Feature icon={<Phone className="w-8 h-8" />} title="Easy Contact">
              Connect instantly with WhatsApp, phone calls, or email. No complicated booking systems.
            </Feature>
            <Feature icon={<Heart className="w-8 h-8" />} title="Community Support">
              Every purchase helps strengthen your local economy and supports your neighbors' dreams.
            </Feature>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;