// 📁 src/hooks/useUserRole.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext'; // 🔁 Ensure named import
import useAxiosSecure from './useAxiosSecure';

const useUserRole = () => {
  const { user, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    let isMounted = true; // 🛡 Prevent state updates if component unmounts

    const fetchUserRole = async () => {
      if (!loading && user?.email) {
        try {
          const res = await axiosSecure.get(`/users/role/${user.email}`);
          if (isMounted) {
            setRole(res.data.role);
            setRoleLoading(false);
          }
        } catch (error) {
          console.error('❌ Failed to fetch user role:', error);
          if (isMounted) {
            setRole(null);
            setRoleLoading(false);
          }
        }
      } else if (!user?.email && !loading) {
        // Edge case: No user logged in, stop loading
        setRole(null);
        setRoleLoading(false);
      }
    };

    fetchUserRole();

    return () => {
      isMounted = false;
    };
  }, [user, loading, axiosSecure]);

  return {
    role,
    roleLoading,
    isAdmin: role === 'admin',
    isModerator: role === 'moderator',
    isUser: role === 'user',
  };
};

export default useUserRole;
