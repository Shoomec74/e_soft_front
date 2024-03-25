import { SelectChangeEvent, TextField } from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import useForm from '../../../hooks/useForm/useForm';
import FixedTags from '../FixedTag/FixedTag';
import { TUserRegisterResponse, UserRole } from '../../../utils/types/types';
import SelectField from './SelectField';

// Определение типа для функции setSubordinates
type SetSubordinates = Dispatch<SetStateAction<TUserRegisterResponse[]>>;

interface IProps {
  user?: TUserRegisterResponse;
  allUsers?: TUserRegisterResponse[] | null;
  setSubordinates?: SetSubordinates;
}

const RegisterUserFormFields: FC<IProps> = ({
  user,
  allUsers,
  setSubordinates,
}): React.ReactNode => {
  const initialValuesForm = {
    login: '',
    firstName: '',
    lastName: '',
    middleName: '',
    password: '',
  };

  const { values, handleChange, setValues } = useForm(initialValuesForm);

  const [roleUser, setRole] = useState<string>(user?.role || '');

  // Используем useEffect для установки начального значения login
  useEffect(() => {
    if (user) {
      // Установка значения login пользователя как начального значения формы
      setValues((values) => ({
        ...values,
        login: user.login,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
      }));
    }
  }, [user, setValues]);

  // Деструктуризация для получения текущих значений login и password
  const { login, firstName, lastName, middleName, password } = values;

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  return (
    <>
      <TextField
        required={!user}
        margin="dense"
        id="name"
        name="login"
        label="Email"
        type="email"
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={login}
        autoComplete="off"
      />
      <TextField
        required={!user}
        margin="dense"
        id="name"
        name="lastName"
        label="Фамилия"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={lastName}
        autoComplete="off"
      />
      <TextField
        required={!user}
        margin="dense"
        id="name"
        name="firstName"
        label="Имя"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={firstName}
        autoComplete="off"
      />
      <TextField
        required={!user}
        margin="dense"
        id="name"
        name="middleName"
        label="Отчество"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={middleName}
        autoComplete="off"
      />
      <TextField
        required={!user}
        margin="dense"
        id="password"
        name="password"
        label="Пароль"
        //-- Избавляемся от автозаполнения браузера --//
        type={password.length > 0 ? 'password' : 'text'}
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={password}
        autoComplete="off"
      />
      <SelectField
        title="Роль"
        nameKeyObject="role"
        сhangeSelect={handleChangeSelect}
        stateValue={roleUser}
        enumProps={UserRole}
      />
      {allUsers && roleUser === UserRole.MANAGER && (
        <FixedTags allUsers={allUsers} setSubordinates={setSubordinates} />
      )}
    </>
  );
};

export default RegisterUserFormFields;
