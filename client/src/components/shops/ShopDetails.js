import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import { useParams, useNavigate } from 'react-router-dom';
import { getShopById } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 2. Wrap fetchShop in useCallback
  const fetchShop = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getShopById(id);
      setShop(response.data.shop);
    } catch (err) {
      setError(err.response?.data?.message || 'Shop not found');
    } finally {
      setLoading(false);
    }
  }, [id]); // fetchShop depends on the 'id' from the URL

  useEffect(() => {
    fetchShop();
  }, [fetchShop]); // 3. Add fetchShop to the dependency array

  // ... rest of your component code is correct ...
  
  const handleWhatsApp = () => {
    const phone = shop.contact.whatsapp || shop.contact.phone;
    const message = `Hi! I found your shop "${shop.name}" on LocalConnect. I'd like to know more about your services.`;
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${shop.contact.phone}`, '_self');
  };

  const handleEmail = () => {
    const subject = `Inquiry about ${shop.name}`;
    const body = `Hi,\n\nI found your shop "${shop.name}" on LocalConnect and I'm interested in your services.\n\nBest regards`;
    window.open(`mailto:${shop.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_self');
  };

  const categoryColors = {
    restaurant: 'bg-red-100 text-red-800',
    grocery: 'bg-green-100 text-green-800',
    electronics: 'bg-blue-100 text-blue-800',
    clothing: 'bg-purple-100 text-purple-800',
    pharmacy: 'bg-pink-100 text-pink-800',
    services: 'bg-yellow-100 text-yellow-800',
    other: 'bg-gray-100 text-gray-800'
  };

  if (loading) {
    return <LoadingSpinner text="Loading shop details..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Shop Not Found</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div>
          {shop.images && shop.images.length > 0 ? (
            <div>
              <div className="aspect-w-16 aspect-h-12 mb-4">
                <img
                  src={shop.images[currentImageIndex].url}
                  alt={shop.images[currentImageIndex].alt || shop.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              {shop.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {shop.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-w-16 aspect-h-12 rounded-lg overflow-hidden ${
                        currentImageIndex === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || shop.name}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Shop Information */}
        <div>
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${categoryColors[shop.category] || categoryColors.other}`}>
              {shop.category.charAt(0).toUpperCase() + shop.category.slice(1)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{shop.name}</h1>

          {shop.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{shop.description}</p>
          )}

          {/* Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div className="text-gray-600">
                {shop.address.street && <div>{shop.address.street}</div>}
                <div>
                  {shop.address.city}
                  {shop.address.state && `, ${shop.address.state}`}
                  {shop.address.pincode && ` - ${shop.address.pincode}`}
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          {shop.hours && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{shop.hours.open} - {shop.hours.close}</span>
              </div>
              {shop.hours.closedDays && shop.hours.closedDays.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Closed on: {shop.hours.closedDays.map(day => 
                    day.charAt(0).toUpperCase() + day.slice(1)
                  ).join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="space-y-3 mb-6">
              {shop.contact.phone && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{shop.contact.phone}</span>
                </div>
              )}

              {shop.contact.email && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{shop.contact.email}</span>
                </div>
              )}

              {shop.contact.whatsapp && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                  </svg>
                  <span>{shop.contact.whatsapp}</span>
                </div>
              )}
            </div>

            {/* Contact Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(shop.contact.whatsapp || shop.contact.phone) && (
                <button
                  onClick={handleWhatsApp}
                  className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                  </svg>
                  WhatsApp
                </button>
              )}
              
              {shop.contact.phone && (
                <button
                  onClick={handleCall}
                  className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Call Now
                </button>
              )}

              {shop.contact.email && (
                <button
                  onClick={handleEmail}
                  className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;