import axios from 'axios';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3010/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    // Ensure Content-Type is set for POST requests
    if (!config.headers['Content-Type'] && config.method === 'post') {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.href.includes('/login')) {
      window.location.pathname = '/maintenance/500';
    }
    if (error.response?.status === 302 || error.response?.status === 301) {
      // Handle redirects - usually means auth is required
      if (!window.location.href.includes('/login')) {
        window.location.pathname = '/login';
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);
export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};
