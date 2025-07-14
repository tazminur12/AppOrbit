import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "https://apporbit-server-pi.vercel.app",
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;