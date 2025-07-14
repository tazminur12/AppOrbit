import axios from "axios";

const useSecureAxios = () => {
  const instance = axios.create({
    baseURL: "https://apporbit-server-pi.vercel.app",
  });

  // Attach JWT token to headers
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token"); // ✅ correct key
      console.log("🔐 JWT token:", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle 403 errors globally
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 403) {
        console.error("❌ 403 Forbidden: JWT might be invalid or expired.");
        
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useSecureAxios;
