// utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://food-delivery-node-h1lq.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
