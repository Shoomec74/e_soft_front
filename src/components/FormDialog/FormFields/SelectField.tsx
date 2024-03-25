import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { FC } from 'react';
import { UserRole } from '../../../utils/types/types';

interface IProps {
  title: string;
  nameKeyObject: string;
  сhangeSelect: (event: SelectChangeEvent) => void;
  enumProps: { [key: string]: string };
  stateValue: string;
  requiredFlag?: boolean;
  disableFlag?: boolean;
}

const SelectField: FC<IProps> = ({
  title,
  nameKeyObject,
  сhangeSelect,
  stateValue,
  enumProps,
  requiredFlag,
  disableFlag,
}) => {
  const generateMenuItemsFromEnum = (enums: { [key: string]: string }) => {
    return Object.values(enums).map((enumValue) => {
      if (enumValue === UserRole.SUPERADMIN) {
        return null;
      }
      return (
        <MenuItem key={enumValue} value={enumValue}>
          {enumValue}
        </MenuItem>
      );
    });
  };

  return (
    <Box sx={{ mt: 2, mb: 2, minWidth: 120 }}>
      <FormControl>
        <InputLabel id={nameKeyObject}>{title}</InputLabel>
        <Select
          sx={{ minWidth: 100 }}
          required={requiredFlag}
          labelId={nameKeyObject}
          id={`${nameKeyObject}_select`}
          value={stateValue}
          autoWidth
          label={title}
          name={nameKeyObject}
          onChange={сhangeSelect}
          disabled={disableFlag}
        >
          {generateMenuItemsFromEnum(enumProps)}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectField;
