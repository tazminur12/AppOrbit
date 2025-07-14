import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import ProductsPage from '../pages/Products/ProductsPage';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ErrorPage from '../pages/ErrorPage';
import AnimationDemo from '../pages/AnimationDemo';
import DashboardLayout from '../layouts/DashboardLayout';
import PrivateRoute from '../routes/PrivateRoute';

// User dashboard pages
import MyProfile from '../pages/Dashboard/User/MyProfile';
import AddProduct from '../pages/Dashboard/User/AddProduct';
import MyProducts from '../pages/Dashboard/User/MyProducts';
import UpdateProduct from '../pages/Dashboard/User/UpdateProduct';
// Moderator dashboard pages
import ReviewQueue from '../pages/Dashboard/Moderator/ReviewQueue';
import ReportedContents from '../pages/Dashboard/Moderator/ReportedContents';
// Admin dashboard pages
import Statistics from '../pages/Dashboard/Admin/Statistics';
import ManageUsers from '../pages/Dashboard/Admin/ManageUsers';
import ManageCoupons from '../pages/Dashboard/Admin/ManageCoupons';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, 
    errorElement: <ErrorPage />, 
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <PrivateRoute><ProductDetails></ProductDetails></PrivateRoute> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/animation-demo', element: <AnimationDemo /> }
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      // User dashboard
      { path: 'user/my-profile', element: <MyProfile /> },
      { path: 'user/add-product', element: <AddProduct /> },
      { path: 'user/my-products', element: <MyProducts /> },
      { path: 'user/update-product/:id', element: <UpdateProduct /> },
      // Moderator dashboard
      { path: 'moderator/review-queue', element: <ReviewQueue /> },
      { path: 'moderator/reported-contents', element: <ReportedContents /> },
      // Admin dashboard
      { path: 'admin/statistics', element: <Statistics /> },
      { path: 'admin/manage-users', element: <ManageUsers /> },
      { path: 'admin/manage-coupons', element: <ManageCoupons /> },
    ],
  },
]);

export default router;
