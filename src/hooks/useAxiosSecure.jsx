import axios from "axios";

const instance = axios.create({
  baseURL: "https://apporbit-server-pi.vercel.app",
});


let interceptorsAdded = false;

const useSecureAxios = () => {
  if (!interceptorsAdded) {
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );


    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403) {
          console.error("❌ 403 Forbidden: JWT might be invalid or expired.");
       
        }
        return Promise.reject(error);
      }
    );

    interceptorsAdded = true; 
  }

  return instance;
};

export default useSecureAxios;
