import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import useForm from '../../../hooks/useForm/useForm';
import { PriorityTask } from '../../../utils/types/auth';
import { useState } from 'react';

const TaskCreateFormFields = () => {
  const initialValuesForm = {
    title: '',
    description: '',
    assignee: '',
  };

  const { values, handleChange, setValues } = useForm(initialValuesForm);

  const [priorityTask, setPriorityTask] = useState('');

  const handleChangeSelect = (event: SelectChangeEvent) => {
    setPriorityTask(event.target.value as string);
  };

  const { title, description } = values;

  const generateMenuItemsFromEnum = (enums: { [key: string]: string }) => {
    return Object.values(enums).map((enumValue) => (
      <MenuItem key={enumValue} value={enumValue}>
        {enumValue}
      </MenuItem>
    ));
  };

  return (
    <>
      <TextField
        required
        margin="dense"
        id="title"
        name="title"
        label="Title task"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={title}
        autoComplete="off"
      />
      <TextField
        required
        margin="dense"
        id="description"
        name="description"
        label="Description task"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={description}
        autoComplete="off"
      />
      <InputLabel id="priority">Priority</InputLabel>
      <Select
        required
        labelId="priority"
        id="priority_select"
        value={priorityTask}
        fullWidth
        label="Priority"
        name="priority"
        onChange={handleChangeSelect}
      >
        {generateMenuItemsFromEnum(PriorityTask)}
      </Select>
    </>
  );
};

export default TaskCreateFormFields;
