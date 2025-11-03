import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://my-pet-api.onrender.com",
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    
    // Debug: log tất cả localStorage keys
    console.log('[axiosInstance] All localStorage keys:', Object.keys(localStorage));
    console.log('[axiosInstance] Token value:', token ? token.substring(0, 30) + '...' : 'NULL');
    console.log('[axiosInstance] Token exists:', !!token);
    console.log('[axiosInstance] Request URL:', config.url);
    console.log('[axiosInstance] Request method:', config.method?.toUpperCase());
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[axiosInstance] ✅ Authorization header set');
    } else {
      console.error('[axiosInstance] ❌ No token found in localStorage!');
      console.error('[axiosInstance] Available keys:', Object.keys(localStorage));
      
      // Check if user data exists
      const userData = localStorage.getItem("user");
      if (userData) {
        console.error('[axiosInstance] ⚠️ User data found but no token!');
        console.error('[axiosInstance] User:', JSON.parse(userData));
      }
    }
    return config;
  },
  (error) => {
    console.error('[axiosInstance] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor để handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response, return as is
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.error('[axiosInstance] 🔴 401 Unauthorized received');
      console.error('[axiosInstance] Response:', error.response?.data);
      
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        console.log('[axiosInstance] 🔄 Attempting to refresh token...');
        originalRequest._retry = true;
        
        try {
          // Try to refresh token
          const response = await axios.post(
            'https://my-pet-api.onrender.com/api/auth/refresh-token',
            { refreshToken }
          );
          
          const { accessToken } = response.data;
          
          if (accessToken) {
            console.log('[axiosInstance] ✅ Token refreshed successfully');
            localStorage.setItem("token", accessToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('[axiosInstance] ❌ Token refresh failed:', refreshError);
          console.error('[axiosInstance] Clearing localStorage and redirecting to login...');
          
          // Clear all auth data
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          
          // Redirect to login
          window.location.href = "/login";
        }
      } else {
        console.error('[axiosInstance] ❌ No refresh token available');
        console.error('[axiosInstance] User needs to login again');
        
        // Clear stale data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect to login
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
