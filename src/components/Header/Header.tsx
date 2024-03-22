import { Alert, Button, Snackbar, Toolbar } from '@mui/material';
import { FC, useState } from 'react';
import styles from './Header.module.less';
import FormDialog from '../FormDialog/FormDialog';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import {
  clearErrorUsers,
  register,
  resetRegistrationState,
} from '../../services/reducers/user.slice';
import { signOut } from '../../services/reducers/authorization.slice';
import { TUserRegisterResponse } from '../../utils/types/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAbility } from '@casl/react';
import { Action } from '../../ability/Ability';
import { AbilityContext } from '../../ability/AbilityContext';
import RegisterUserFormFields from '../FormDialog/FormFields/RegisterUserFormFields';
import TaskCreateFormFields from '../FormDialog/FormFields/TaskCreateFormFields';

const Header: FC = () => {
  const { header_bar } = styles;
  const btnStyle = { margin: '20px' };

  const ability = useAbility(AbilityContext);

  const dispath = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { isLoading, isRegistered, error, allUsers } = useAppSelector(
    (state) => ({
      isLoading: state.users.isLoading,
      isRegistered: state.users.isRegistered,
      error: state.users.error,
      allUsers: state.users.allUsers,
    }),
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    dispath(clearErrorUsers());
    dispath(resetRegistrationState());
  };

  const [open, setOpen] = useState(false);
  const [subordinates, setSubordinates] = useState<TUserRegisterResponse[]>([]);
  const [formType, setFormType] = useState<string>('');

  const handleOpenDialog = (type: string) => {
    setFormType(type); // Устанавливаем тип формы
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormType(''); // Очищаем тип формы при закрытии
  };

  const handleNavLink = () => {
    const newPath = location.pathname === '/crm' ? '/admin' : '/crm';
    navigate(newPath); // Программно перенавигируйте пользователя
  };

  const handleSubmitDialog = (formData: any) => {
    const usersSubordinateId = subordinates.map((user) => user.id);
    dispath(register({ ...formData, subordinateIds: usersSubordinateId }));
  };

  const handleLogoutButton = () => {
    dispath(signOut());
  };

  return (
    <Toolbar className={header_bar}>
      {ability.can(Action.Access, 'admin') && location.pathname !== '/crm' && (
        <Button
          style={btnStyle}
          variant="contained"
          type="button"
          onClick={() => handleOpenDialog('registerUser')}
        >
          Зарегистрировать пользователя
        </Button>
      )}
      {location.pathname === '/crm' && (
        <Button
          style={btnStyle}
          variant="contained"
          type="button"
          onClick={() => handleOpenDialog('addTask')}
        >
          Добавить задачу
        </Button>
      )}
      <Button
        style={btnStyle}
        variant="contained"
        type="button"
        onClick={handleLogoutButton}
      >
        Выйти
      </Button>
      {ability.can(Action.Access, 'admin') && (
        <Button
          style={btnStyle}
          variant="contained"
          type="button"
          onClick={handleNavLink}
        >
          {location.pathname === '/crm' ? 'Админпанель' : 'CRM'}
        </Button>
      )}
      <Snackbar
        open={!!error || isRegistered}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={!isRegistered ? 'error' : 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {!isRegistered ? `${error}` : 'Пользователь успешно зарегистрирован'}
        </Alert>
      </Snackbar>
      <FormDialog
        open={open}
        onClose={handleCloseDialog}
        handleSubmitDialog={handleSubmitDialog}
      >
        {formType === 'registerUser' && (
          <RegisterUserFormFields
            allUsers={allUsers}
            setSubordinates={setSubordinates}
          />
        )}
        {formType === 'addTask' && <TaskCreateFormFields />}
      </FormDialog>
    </Toolbar>
  );
};

export default Header;
