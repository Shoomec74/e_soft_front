import React, { FC, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FormDialog from '../FormDialog/FormDialog';
import { Button, IconButton, TextField } from '@mui/material';
import useForm from '../../hooks/useForm/useForm';
import DeleteIcon from '@mui/icons-material/Delete';
import RegisterUserFormFields from '../FormDialog/FormFields/RegisterUserFormFields';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { getAllUsers } from '../../services/reducers/user.slice';
import { TUserRegisterResponse } from '../../utils/types/auth';

interface Iprops {
  user: TUserRegisterResponse;
  allUsers: TUserRegisterResponse[] | null;
}

const UserInfoCard: FC<Iprops> = ({ user, allUsers }: any) => {
  const initialValuesForm = {
    login: '',
    firstName: '',
    lastName: '',
    middleName: '',
    password: '',
  };

  const [open, setOpen] = useState(false); // Состояние для управления видимостью диалога

  const handleOpenDialog = () => {
    setOpen(true); // Функция для открытия диалога
  };

  const handleCloseDialog = () => {
    setOpen(false); // Функция для закрытия диалога
  };

  const handleSubmitDialog = (formData: any) => {
    // const usersSubordinateId = subordinates.map((user) => user.id);
    // dispath(register({ ...formData, subordinateIds: usersSubordinateId }));
  };

  const { values, handleChange, setValues } = useForm(initialValuesForm);

  // Используем useEffect для установки начального значения login
  useEffect(() => {
    // Установка значения login пользователя как начального значения формы
    setValues((values) => ({
      ...values,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
    }));
  }, [user, setValues]);

  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {user.login}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {user.firstName} {user.middleName} {user.lastName}
        </Typography>
        <Button variant="outlined" onClick={handleOpenDialog}>
          Обновить
        </Button>
        <FormDialog
          open={open}
          onClose={handleCloseDialog}
          handleSubmitDialog={handleSubmitDialog}
        >
          <RegisterUserFormFields user={user} allUsers={allUsers} />
        </FormDialog>
        <IconButton aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

const UserDivisionComponent: FC = () => {
  const { isLoading, allUsers, error } = useAppSelector((state) => ({
    isLoading: state.users.isLoading,
    allUsers: state.users.allUsers,
    error: state.users.error,
  }));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  const leaders = allUsers?.filter((user) => user.role === 'manager');
  const subordinates = allUsers?.filter((user) => user.role === 'subordinate');

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6" gutterBottom>
          Руководители
        </Typography>
        {leaders?.map((user: TUserRegisterResponse) => (
          <UserInfoCard key={user.id} user={user} allUsers={allUsers} />
        )) || null}
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" gutterBottom>
          Подчиненные
        </Typography>
        {subordinates?.map((user) => (
          <UserInfoCard key={user.id} user={user} allUsers={allUsers} />
        )) || null}
      </Grid>
    </Grid>
  );
};

export default UserDivisionComponent;
