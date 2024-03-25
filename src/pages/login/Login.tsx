import { FC, FormEvent, useState } from 'react';
import styles from './login.module.less';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { getCookie } from '../../api/auth/auth';
import { Navigate, useLocation } from 'react-router-dom';
import useForm from '../../hooks/useForm/useForm';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { signIn } from '../../services/reducers/authorization.slice';
import Button from '@mui/material/Button';
import Notifications from '../../components/Notifications/Notifications';

const Login: FC = () => {
  const { loginPage, titlePage } = styles;

  const { isLoading, isLogin, errorAuth } = useAppSelector((state) => ({
    isLoading: state.auth.isLoading,
    isLogin: state.auth.isLogin,
    errorAuth: state.auth.errorAuth,
  }));

  const cookie = getCookie('token');

  const dispatch = useAppDispatch();

  const location = useLocation();

  const initialValuesForm = { login: '', password: '' };

  const { values, handleChange, setValues, errors } =
    useForm(initialValuesForm);

  const { login, password } = values;

  const handlerSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(signIn({ login, password }));
    setValues(initialValuesForm);
  };

  if (cookie) {
    return <Navigate to={location.state?.from || '/crm'} />;
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handlerSubmit}
    >
      <div className={loginPage}>
        <h1 className={titlePage}>Вход в систему</h1>
        <TextField
          required
          label="Логин"
          type="email"
          name="login"
          value={login}
          onChange={handleChange}
          error={!!errors.login && login !== ''}
          helperText={login !== '' && errors.login}
          disabled={isLoading}
        />
        <TextField
          required
          label="Пароль"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          autoComplete="current-password"
          disabled={isLoading}
          helperText={password !== '' && errors.password}
          error={!!errors.password && password !== ''}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={!!errors.login || !!errors.password || isLoading}
        >
          Войти
        </Button>
        <Notifications
          componentError={errorAuth}
          flag={isLogin}
          successString="Вход в систему"
        />
      </div>
    </Box>
  );
};

export default Login;
