import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShopForm from '../components/shops/ShopForm';
import { getShopById, updateShop } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditShop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      try {
        const response = await getShopById(id);
        setShop(response.data.shop); // Assuming API returns { shop: ... }
      } catch (err) {
        setError('Failed to fetch shop details.');
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id]);

  const handleUpdateShop = async (formData) => {
    setSubmitLoading(true);
    setError(null);
    try {
      await updateShop(id, formData);
      alert('Shop updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shop.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <LoadingSpinner text="Loading shop data..." />;
  }

  if (error && !shop) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Shop</h1>
        <ShopForm 
          shop={shop} // Pass the fetched shop data to the form
          onSubmit={handleUpdateShop} 
          onCancel={handleCancel}
          loading={submitLoading} 
        />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default EditShop;