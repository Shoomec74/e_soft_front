import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { FC, useState, useEffect } from 'react';
import useForm from '../../hooks/useForm/useForm';
import { TUserRegisterResponse, TypeForm } from '../../utils/types/types';
import FormDialog from '../FormDialog/FormDialog';
import RegisterUserFormFields from '../FormDialog/FormFields/RegisterUserFormFields';
import DeleteIcon from '@mui/icons-material/Delete';

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
    //-- TODO: добавить логику обновления пользователей --//
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
          typeForm={TypeForm.UPDATE_USER}
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

export default UserInfoCard;
