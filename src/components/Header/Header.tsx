import { Button, Toolbar } from '@mui/material';
import { FC, useState } from 'react';
import styles from './Header.module.less';
import FormDialog from '../FormDialog/FormDialog';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import {
  registerUser,
  resetUserState,
} from '../../services/reducers/user.slice';
import { signOut } from '../../services/reducers/authorization.slice';
import { TUserRegisterResponse, TypeForm } from '../../utils/types/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAbility } from '@casl/react';
import { AbilityContext, Can } from '../../ability/AbilityContext';
import RegisterUserFormFields from '../FormDialog/FormFields/RegisterUserFormFields';
import TaskCreateFormFields from '../FormDialog/FormFields/TaskCreateFormFields';
import { createTask, resetTaskState } from '../../services/reducers/tasks.slice';
import Notifications from '../Notifications/Notifications';

const Header: FC = () => {
  const { header_bar } = styles;
  const btnStyle = { margin: '20px' };

  const ability = useAbility(AbilityContext);

  const dispath = useAppDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const {
    isLoading,
    isUserRegistered,
    errorUsers,
    allUsers,
    user,
    isUserUpdated,
    errorTask,
    isCreated,
    isUpdated
  } = useAppSelector((state) => ({
    user: state.auth.user,
    isLoading: state.users.isLoading,
    isUserRegistered: state.users.isUserRegistered,
    isUserUpdated: state.users.isUserUpdated,
    errorUsers: state.users.errorUsers,
    allUsers: state.users.allUsers,
    errorTask: state.tasks.errorTask,
    isCreated: state.tasks.isCreated,
    isUpdated: state.tasks.isUpdated,
  }));

  const [open, setOpen] = useState(false);
  const [subordinates, setSubordinates] = useState<TUserRegisterResponse[]>([]);
  const [formType, setFormType] = useState<TypeForm>(TypeForm.DEFAULT);

  const handleOpenDialog = (type: TypeForm) => {
    setFormType(type); // Устанавливаем тип формы
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFormType(TypeForm.DEFAULT); // Очищаем тип формы при закрытии
  };

  const handleNavLink = () => {
    const newPath = location.pathname === '/crm' ? '/admin' : '/crm';
    navigate(newPath); // Программно перенавигируйте пользователя
  };

  const handleSubmitRegisterDialog = (formData: any) => {
    const usersSubordinateId = subordinates.map((user) => user.id);
    dispath(registerUser({ ...formData, subordinateIds: usersSubordinateId }));
  };

  const handleSubmitCreateTaskDialog = (formData: any) => {
    dispath(createTask({ ...formData }));
  };

  const handleLogoutButton = () => {
    dispath(signOut());
  };

  return (
    <Toolbar className={header_bar}>
      <Can I="access" a="admin" ability={ability}>
        {(allowed) =>
          location.pathname !== '/crm' && (
            <Button
              style={btnStyle}
              variant="contained"
              type="button"
              onClick={() => handleOpenDialog(TypeForm.REGISTER_USER)}
            >
              Зарегистрировать пользователя
            </Button>
          )
        }
      </Can>
      {location.pathname === '/crm' && (
        <Button
          style={btnStyle}
          variant="contained"
          type="button"
          onClick={() => handleOpenDialog(TypeForm.CREATE_TASK)}
        >
          Новая задача
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
      <Can I="access" a="admin" ability={ability}>
        {(allowed) => (
          <Button
            style={btnStyle}
            variant="contained"
            type="button"
            onClick={handleNavLink}
          >
            {location.pathname === '/crm' ? 'Админпанель' : 'CRM'}
          </Button>
        )}
      </Can>
      <FormDialog
        open={open}
        onClose={handleCloseDialog}
        handleSubmitDialog={
          formType === TypeForm.REGISTER_USER
            ? handleSubmitRegisterDialog
            : handleSubmitCreateTaskDialog
        }
        typeForm={formType}
      >
        {formType === TypeForm.REGISTER_USER && (
          <RegisterUserFormFields
            allUsers={allUsers}
            setSubordinates={setSubordinates}
          />
        )}
        {formType === TypeForm.CREATE_TASK && (
          <TaskCreateFormFields
            allSubordinates={user && user.subordinates ? user.subordinates : []}
          />
        )}
      </FormDialog>
      <Notifications
        componentError={errorUsers}
        flag={isUserRegistered}
        successString="Пользователь успешно зарегистрирован"
        clearState={resetUserState}
      />
      <Notifications
        componentError={errorUsers}
        flag={isUserUpdated}
        successString="Пользователь успешно обновлен"
        clearState={resetUserState}
      />
      <Notifications
        componentError={errorTask}
        flag={isCreated}
        successString="Задача успешно создана"
        clearState={resetTaskState}
      />
      <Notifications
        componentError={errorTask}
        flag={isUpdated}
        successString="Задача успешно обновлена"
        clearState={resetTaskState}
      />
    </Toolbar>
  );
};

export default Header;
