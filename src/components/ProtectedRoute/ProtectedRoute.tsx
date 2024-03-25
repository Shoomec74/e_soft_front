import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../../api/auth/auth';

interface ProtectedRouteProps {}

const ProtectedRoute: FC<ProtectedRouteProps> = () => {
  const token = getCookie('token'); // Реализация getCookie должна быть предоставлена

  // Проверка на наличие токена
  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
