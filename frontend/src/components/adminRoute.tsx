import { Navigate, Outlet } from 'react-router-dom';
import { authStore } from '../store/authStore';


export const AdminRoute = () => {
  const { User } = authStore();

  
  if (!User?.token) return <Navigate to="/Home"  />;


  // El role viene del enum de Prisma en mayuscula; 'Admin' nunca iba a coincidir.
  if (User && User.user.role !== 'ADMIN') {
    return <Navigate to="/Home" />;
  }

  
  return <Outlet />;
};
