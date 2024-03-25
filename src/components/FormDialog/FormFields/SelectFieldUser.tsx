import React, { FC, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { TUserRegisterResponse } from '../../../utils/types/types';

interface ISelectFieldProps {
  title: string;
  nameKeyObject: string;
  сhangeSelect: (event: SelectChangeEvent) => void; // Обновлено для возврата id
  users: TUserRegisterResponse[];
  selectedUserId: string;
  disableFlag: boolean;
}

const SelectFieldUser: FC<ISelectFieldProps> = ({
  title,
  nameKeyObject,
  сhangeSelect,
  users,
  selectedUserId,
  disableFlag,
}) => {
  const generateMenuItemsFromUsers = (users: TUserRegisterResponse[]) => {
    return users.map((user) => (
      <MenuItem key={user.id} value={user.id}>
        {`${user.firstName} ${user.middleName} ${user.lastName} (${user.role})`}
      </MenuItem>
    ));
  };

  return (
    <Box sx={{ mt: 2, minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={nameKeyObject}>{title}</InputLabel>
        <Select
          labelId={nameKeyObject}
          id={`${nameKeyObject}_select`}
          value={selectedUserId}
          name={nameKeyObject}
          label={title}
          onChange={сhangeSelect}
          disabled={disableFlag}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {generateMenuItemsFromUsers(users)}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectFieldUser;
