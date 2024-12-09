import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL= " http://127.0.0.1:8000";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL, // Set base URL
  timeout: 10000,    // Optional: Set a timeout for requests
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt'); // Retrieve the token from cookies
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default apiClient;
