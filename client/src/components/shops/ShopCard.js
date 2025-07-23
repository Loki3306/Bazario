import React from 'react';
import { Link } from 'react-router-dom';

const ShopCard = ({ shop }) => {
  const categoryColors = {
    restaurant: 'bg-red-100 text-red-800',
    grocery: 'bg-green-100 text-green-800',
    electronics: 'bg-blue-100 text-blue-800',
    clothing: 'bg-purple-100 text-purple-800',
    pharmacy: 'bg-pink-100 text-pink-800',
    services: 'bg-yellow-100 text-yellow-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const handleWhatsApp = (e) => {
    e.preventDefault();
    const phone = shop.contact.whatsapp || shop.contact.phone;
    const message = `Hi! I found your shop "${shop.name}" on LocalConnect. I'd like to know more about your services.`;
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCall = (e) => {
    e.preventDefault();
    window.open(`tel:${shop.contact.phone}`, '_self');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Shop Image */}
      <div className="h-48 bg-gray-200 relative">
        {shop.images && shop.images.length > 0 ? (
          <img
            src={shop.images[0].url}
            alt={shop.images[0].alt || shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[shop.category] || categoryColors.other}`}>
            {shop.category.charAt(0).toUpperCase() + shop.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Shop Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {shop.name}
        </h3>
        
        {shop.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {shop.description}
          </p>
        )}

        {/* Address */}
        <div className="flex items-start mb-3">
          <svg className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-600">
            {shop.address.street && `${shop.address.street}, `}
            {shop.address.city}
            {shop.address.state && `, ${shop.address.state}`}
          </span>
        </div>

        {/* Contact Buttons */}
        <div className="flex space-x-2 mb-4">
          {(shop.contact.whatsapp || shop.contact.phone) && (
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
              </svg>
              WhatsApp
            </button>
          )}
          
          {shop.contact.phone && (
            <button
              onClick={handleCall}
              className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call
            </button>
          )}
        </div>

        {/* Hours */}
        {shop.hours && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {shop.hours.open} - {shop.hours.close}
            </div>
          </div>
        )}

        {/* View Details Button */}
        <Link
          to={`/shop/${shop._id}`}
          className="w-full block text-center btn-secondary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;