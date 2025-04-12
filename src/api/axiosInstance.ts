import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1'
, // Cambia si está desplegado en otro lado
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
