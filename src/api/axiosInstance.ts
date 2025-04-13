import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`
, // Cambia si está desplegado en otro lado
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
