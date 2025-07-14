import { Navigate, useLocation } from 'react-router-dom';
import useUserRole from '../hooks/useUserRole';

const AdminRoute = ({ children }) => {
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (roleLoading) return <div className="text-center mt-20">Loading...</div>;

  if (role === 'admin') return children;

  return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default AdminRoute;
