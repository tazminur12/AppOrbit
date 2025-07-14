// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // ✅ named import

const useAuth = () => useContext(AuthContext);

export default useAuth;
