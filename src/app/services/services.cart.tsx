import axios from 'axios';

const API_URL = 'https://food-delivery-node-h1lq.onrender.com/api/cart';

export const getCart = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await axios.post(`${API_URL}/add`, { productId, quantity }, { withCredentials: true });
  return response.data;
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const response = await axios.put(`${API_URL}/update`, { productId, quantity }, { withCredentials: true });
  return response.data;
};

export const removeFromCart = async (productId: string) => {
  const response = await axios.delete(`${API_URL}/remove/${productId}`, { withCredentials: true });
  return response.data;
};
