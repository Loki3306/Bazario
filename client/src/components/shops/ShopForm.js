import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ShopForm = ({ shop = null, onSubmit, onCancel, loading = false }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    contact: {
      phone: '',
      email: '',
      whatsapp: ''
    },
    hours: {
      open: '09:00',
      close: '18:00',
      closedDays: []
    },
    images: []
  });
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'services', label: 'Services' },
    { value: 'other', label: 'Other' }
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  // Pre-fill form if editing existing shop
  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || '',
        description: shop.description || '',
        category: shop.category || 'other',
        address: {
          street: shop.address?.street || '',
          city: shop.address?.city || '',
          state: shop.address?.state || '',
          pincode: shop.address?.pincode || ''
        },
        contact: {
          phone: shop.contact?.phone || '',
          email: shop.contact?.email || '',
          whatsapp: shop.contact?.whatsapp || ''
        },
        hours: {
          open: shop.hours?.open || '09:00',
          close: shop.hours?.close || '18:00',
          closedDays: shop.hours?.closedDays || []
        },
        images: shop.images || []
      });
    }
  }, [shop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleClosedDaysChange = (day) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        closedDays: prev.hours.closedDays.includes(day)
          ? prev.hours.closedDays.filter(d => d !== day)
          : [...prev.hours.closedDays, day]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a service like Cloudinary
    // For now, we'll just store the file names
    const imageUrls = files.map(file => ({
      url: URL.createObjectURL(file), // Temporary URL for preview
      alt: file.name,
      file: file // Store file for actual upload
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Shop name is required';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (!formData.contact.phone.trim()) {
      newErrors['contact.phone'] = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Name *
            </label>
            <input
              type="text"
              name="name"
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter shop name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              className="input-field"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="input-field"
            placeholder="Describe your shop and services..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              name="address.street"
              className="input-field"
              placeholder="Enter street address"
              value={formData.address.street}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="address.city"
                className={`input-field ${errors['address.city'] ? 'border-red-500' : ''}`}
                placeholder="City"
                value={formData.address.city}
                onChange={handleChange}
              />
              {errors['address.city'] && (
                <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="address.state"
                className="input-field"
                placeholder="State"
                value={formData.address.state}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Code
              </label>
              <input
                type="text"
                name="address.pincode"
                className="input-field"
                placeholder="PIN Code"
                value={formData.address.pincode}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="contact.phone"
              className={`input-field ${errors['contact.phone'] ? 'border-red-500' : ''}`}
              placeholder="Phone number"
              value={formData.contact.phone}
              onChange={handleChange}
            />
            {errors['contact.phone'] && (
              <p className="text-red-500 text-sm mt-1">{errors['contact.phone']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="contact.email"
              className="input-field"
              placeholder="Email address"
              value={formData.contact.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              type="tel"
              name="contact.whatsapp"
              className="input-field"
              placeholder="WhatsApp number"
              value={formData.contact.whatsapp}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opening Time
            </label>
            <input
              type="time"
              name="hours.open"
              className="input-field"
              value={formData.hours.open}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Closing Time
            </label>
            <input
              type="time"
              name="hours.close"
              className="input-field"
              value={formData.hours.close}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Closed Days
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {daysOfWeek.map(day => (
              <label key={day.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hours.closedDays.includes(day.value)}
                  onChange={() => handleClosedDaysChange(day.value)}
                  className="mr-2"
                />
                <span className="text-sm">{day.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Images</h3>
        
        <div className="mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="input-field"
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload images of your shop (max 5 images)
          </p>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className={`btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Saving...' : shop ? 'Update Shop' : 'Create Shop'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ShopForm;