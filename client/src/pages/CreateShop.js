import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopForm from '../components/shops/ShopForm';
import { createShop } from '../utils/api'; // Assuming you have this in your api utils

const CreateShop = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateShop = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, you would handle image uploads here first
      // For now, we pass the formData directly
      await createShop(formData);
      alert('Shop created successfully! It will be reviewed by an admin.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shop.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create a New Shop</h1>
        <ShopForm 
          onSubmit={handleCreateShop} 
          onCancel={handleCancel}
          loading={loading}
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default CreateShop;