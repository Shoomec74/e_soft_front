import { TextField, SelectChangeEvent, Stack } from '@mui/material';
import useForm from '../../../hooks/useForm/useForm';
import {
  PriorityTask,
  ProgressTask,
  TCreateTaskResponse,
  TUserRegisterResponse,
  UserRole,
} from '../../../utils/types/types';
import { FC, useEffect, useState } from 'react';
import SelectField from './SelectField';
import SelectFieldUser from './SelectFieldUser';
import { Can, useAbility } from '@casl/react';
import { AbilityContext } from '../../../ability/AbilityContext';
import { Action } from '../../../ability/Ability';

interface IProps {
  allSubordinates: TUserRegisterResponse[];
  task?: TCreateTaskResponse | null;
}

const TaskCreateFormFields: FC<IProps> = ({ allSubordinates, task }) => {
  const ability = useAbility(AbilityContext);
  const initialValuesForm = {
    title: '',
    description: '',
    assignee: '',
  };

  const { values, handleChange, setValues } = useForm(initialValuesForm);

  useEffect(() => {
    if (task) {
      // Установка значения login пользователя как начального значения формы
      setValues((values) => ({
        ...values,
        title: task.title,
        description: task.description,
        //assignee: task.assignee,
      }));
      if (allSubordinates && task.assignee) {
        const index = allSubordinates?.findIndex(
          (user) => user?.id === task?.assignee?.id,
        );

        if (index !== -1) {
          setUserId(`${allSubordinates[index].id}`);
        }
      }
    }
  }, [task, setValues]);

  const [priorityTask, setPriorityTask] = useState(task?.priority || '');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState(task?.status || '');

  const handleChangePriorityTaskSelect = (event: SelectChangeEvent) => {
    setPriorityTask(event.target.value as string);
  };

  const handleChangeStatusTaskSelect = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const handleChangeUserIdSelect = (event: SelectChangeEvent) => {
    const num = `${event.target.value as string}`;
    setUserId(num);
  };

  const { title, description } = values;

  return (
    <>
      <TextField
        required={!task}
        margin="dense"
        id="title"
        name="title"
        label="Заголовок"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={title}
        autoComplete="off"
        disabled={
          ability.cannot(Action.Access, 'formField') && !!task?.assignee
        }
      />
      <TextField
        required={!task}
        margin="dense"
        id="description"
        name="description"
        label="Описание"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
        value={description}
        autoComplete="off"
        disabled={
          ability.cannot(Action.Access, 'formField') && !!task?.assignee
        }
      />
      <SelectField
        title="Приоритет"
        nameKeyObject="priority"
        сhangeSelect={handleChangePriorityTaskSelect}
        stateValue={priorityTask}
        enumProps={PriorityTask}
        requiredFlag={!task}
        disableFlag={
          ability.cannot(Action.Access, 'formField') && !!task?.assignee
        }
      />
      {task && (
        <SelectField
          title="Статус"
          nameKeyObject="status"
          сhangeSelect={handleChangeStatusTaskSelect}
          stateValue={status}
          enumProps={ProgressTask}
          requiredFlag={!task}
        />
      )}
      <Can I="access" a="subordinate" ability={ability}>
        {(allowed) => (
          <SelectFieldUser
            title="Подчиненный"
            nameKeyObject="assigneeId"
            сhangeSelect={handleChangeUserIdSelect}
            users={allSubordinates}
            selectedUserId={userId || ''}
            disableFlag={
              ability.cannot(Action.Access, 'formField') && !!task?.assignee
            }
          />
        )}
      </Can>
    </>
  );
};

export default TaskCreateFormFields;
