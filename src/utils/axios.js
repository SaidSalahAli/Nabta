import axios from 'axios';

const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});
// ==============================|| AXIOS - REQUEST INTERCEPTOR ||============================== //

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

// ==============================|| AXIOS - RESPONSE INTERCEPTOR ||============================== //

axiosServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axiosServices.post('/auth/refresh', {
            refreshToken
          });

          const { accessToken } = response.data.data;

          localStorage.setItem('serviceToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return axiosServices.request(originalRequest);
        } catch (err) {
          localStorage.removeItem('serviceToken');
          localStorage.removeItem('refreshToken');

          window.dispatchEvent(new Event('auth:logout'));

          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);
export default axiosServices;

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};
