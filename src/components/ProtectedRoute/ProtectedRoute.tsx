import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCookie } from '../../auth/auth';

interface ProtectedRouteProps {}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const location = useLocation();
  const token = getCookie('token'); // Реализация getCookie должна быть предоставлена

  // Проверка на наличие токена
  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
