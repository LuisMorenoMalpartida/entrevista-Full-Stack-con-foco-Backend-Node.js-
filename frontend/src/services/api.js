import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        ok: false,
        mensaje: 'La solicitud ha tardado demasiado. Verifica tu conexión.',
      });
    }
    return Promise.reject({
      ok: false,
      mensaje: 'Error de conexión. Verifica que el servidor esté corriendo.',
    });
  }
);

export default api;