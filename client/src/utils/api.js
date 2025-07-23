import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: '/api', // This will be proxied to your server's address
  headers: {
    'Content-Type': 'application/json'
  }
});

/*
  This interceptor runs before each request.
  It checks for a token in local storage and adds it to the request header
  if it exists. This is how your server will know the user is authenticated.
*/
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// A utility function to set the auth token for future requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// ============================================= //
//  SHOP API FUNCTIONS (This is the missing part) //
// ============================================= //

// Fetch all shops with search filters (for Home page)
export const searchShops = (params) => api.get('/shops', { params });

// Fetch a single shop by its ID (for ShopDetails page)
export const getShopById = (id) => api.get(`/shops/${id}`);

// Fetch all shops for the currently logged-in merchant (for Dashboard)
export const getUserShops = () => api.get('/shops/me/myshops');

// Create a new shop (for CreateShop page)
export const createShop = (shopData) => api.post('/shops', shopData);

// Update an existing shop (for EditShop page)
export const updateShop = (id, shopData) => api.put(`/shops/${id}`, shopData);

// Delete a shop (for Dashboard)
export const deleteShop = (id) => api.delete(`/shops/${id}`);


// We export the main 'api' instance as well, as it's used in AuthContext
export { api };