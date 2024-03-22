import { Route, Routes, useNavigate } from 'react-router-dom';
import styles from './App.module.less';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { FC, useEffect } from 'react';
import { AbilityContext } from '../../ability/AbilityContext';
import { defineRulesFor } from '../../ability/Ability';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import Login from '../../pages/login/Login';
import RoleGuard from '../RoleGuard/RoleGuard';
import { deleteCookie, getCookie } from '../../api/auth/auth';
import {
  userInfo,
  updateToken,
} from '../../services/reducers/authorization.slice';
import { Page404 } from '../../pages/page404/Page404';
import AdminPanel from '../../pages/adminPanel/adminPanel';
import Crm from '../../pages/crm/crm';

const App: FC = () => {
  //-- Использование стилей для компонента App --//
  const { app } = styles;

  //-- Инициализация состояний для хранения информации о прогрессе загрузки, статусе загрузки, принятых и отклоненных файлах --//
  const { user, isJwtExpired } = useAppSelector((state) => ({
    user: state.auth.user,
    isJwtExpired: state.auth.isJwtExpired,
  }));

  const token = getCookie('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const dispatch = useAppDispatch();

  const userRole = user?.role; // Это должно приходить, например, из данных пользователя

  const ability = defineRulesFor(userRole);

  useEffect(() => {
    if (token && !user) {
      dispatch(userInfo());
    }
    if (isJwtExpired && refreshToken) {
      deleteCookie('token');
      dispatch(updateToken(refreshToken));
    }
  }, [user, isJwtExpired]);

  return (
    <div className={app}>
      <AbilityContext.Provider value={ability}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Page404 />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
            <Route path="/crm" element={<Crm />} />
          </Route>
        </Routes>
      </AbilityContext.Provider>
    </div>
  );
};

export default App;
