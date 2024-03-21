import { FC, FormEvent, useState } from 'react';
import styles from './login.module.less';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { getCookie } from '../../auth/auth';
import { Navigate, useLocation } from 'react-router-dom';
import useForm from '../../hooks/useForm/useForm';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import {
  clearError,
  signIn,
} from '../../services/reducers/authorization.slice';
import Button from '@mui/material/Button';
import { Alert, Snackbar } from '@mui/material';

const Login: FC = () => {
  const { loginPage, titlePage } = styles;

  const { isLoading, isLogin, error } = useAppSelector((state) => ({
    isLoading: state.auth.isLoading,
    isLogin: state.auth.isLogin,
    error: state.auth.error,
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

  const [open, setOpen] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(clearError());
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
          label="Login"
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
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          autoComplete="current-password"
          disabled={isLoading}
        />
        <Button
          variant="contained"
          type="submit"
          disabled={!!errors.login || isLoading}
        >
          Войти
        </Button>

        <Snackbar
          open={!!error || isLogin}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={!isLogin ? 'error' : 'success'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {!isLogin ? `${error}` : 'Успешно залогинились'}
          </Alert>
        </Snackbar>
      </div>
    </Box>
  );
};

export default Login;
