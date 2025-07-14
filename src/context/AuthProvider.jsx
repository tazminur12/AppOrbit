import React, { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import app from '../firebase/firebase.config';
import { AuthContext } from './AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Helper to check if JWT is expired
function isJwtExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;
    // exp is in seconds, Date.now() is ms
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // 🔐 Get JWT token from backend and store it
  const getAndStoreToken = async (currentUser) => {
    try {
      // Get JWT token from backend using user email
      const response = await axiosSecure.post('/jwt', { email: currentUser.email });
      const token = response.data.token;
      localStorage.setItem('access-token', token);
      return token;
    } catch (error) {
      console.error('❌ Failed to get JWT token:', error);
      // If JWT token fetch fails, still store Firebase token as fallback
      try {
        const firebaseToken = await currentUser.getIdToken();
        localStorage.setItem('access-token', firebaseToken);
        return firebaseToken;
      } catch (firebaseError) {
        console.error('❌ Failed to get Firebase token as fallback:', firebaseError);
      }
    }
  };

  // 🔰 Register with Email/Password
  const register = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await getAndStoreToken(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Login with Email/Password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await getAndStoreToken(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Google Login
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await getAndStoreToken(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // 🔓 Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem('access-token');
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const existingToken = localStorage.getItem('access-token');
        // Only get/store token if not present or expired
        if (!existingToken || isJwtExpired(existingToken)) {
          await getAndStoreToken(currentUser);
        }
      } else {
        localStorage.removeItem('access-token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 📦 Sync user to MongoDB
  useEffect(() => {
    if (user?.email) {
      const userData = {
        name: user.displayName || 'No Name',
        email: user.email,
        photoURL: user.photoURL || null,
        role: 'user',
        membership: null, // Add membership field to match backend schema
      };

      axiosSecure.post('/users', userData)
        .then(res => {
          if (res?.data?.message === 'User already exists') {
            console.log('ℹ️ User already exists in DB');
          } else {
            console.log('✅ User saved to MongoDB');
          }
        })
        .catch(err => {
          console.error('❌ Error syncing user to MongoDB:', err);
        });
    }
  }, [user, axiosSecure]);

  const authInfo = {
    user,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
