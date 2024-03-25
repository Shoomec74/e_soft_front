import { Grid, SelectChangeEvent, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import TaskItem from '../Task/Task';
import FormDialog from '../FormDialog/FormDialog';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { getAllTasks, updateTask } from '../../services/reducers/tasks.slice';
import SelectField from '../FormDialog/FormFields/SelectField';
import {
  GroupTasks,
  TCreateTaskResponse,
  TypeForm,
} from '../../utils/types/types';
import TaskCreateFormFields from '../FormDialog/FormFields/TaskCreateFormFields';
import { userInfo } from '../../services/reducers/authorization.slice';
import moment from 'moment';
import { useAbility } from '@casl/react';
import { AbilityContext } from '../../ability/AbilityContext';
import { Action } from '../../ability/Ability';

interface IPropsGreedItem {
  task: TCreateTaskResponse;
}

const TaskTracker: FC = () => {
  const ability = useAbility(AbilityContext);
  const { isLoading, allTasks, error, user } = useAppSelector((state) => ({
    user: state.auth.user,
    isLoading: state.tasks.isLoading,
    allTasks: state.tasks.allTasks,
    error: state.tasks.error,
  }));

  const [filter, setFilter] = useState('');

  const getGroupedTasks = (tasks: TCreateTaskResponse[]) => {
    const today = moment().startOf('day');
    const endOfWeek = moment().endOf('week');

    const groupedTasks: Record<string, TCreateTaskResponse[]> = {
      today: [],
      thisWeek: [],
      future: [],
    };

    tasks.forEach((task: TCreateTaskResponse) => {
        // Проверка, что пользователь является создателем таска
        const taskDeadline = moment(task.deadline);
        if (taskDeadline.isSame(today, 'day') || taskDeadline.isBefore(today)) {
          groupedTasks.today.push(task);
        } else if (taskDeadline.isBefore(endOfWeek)) {
          groupedTasks.thisWeek.push(task);
        } else {
          groupedTasks.future.push(task);
        }
    });

    return groupedTasks;
  };

  // Изменение состояния для хранения группированных тасков
  const [groupedTasks, setGroupedTasks] = useState<
    Record<string, TCreateTaskResponse[]>
  >({
    today: [],
    thisWeek: [],
    future: [],
  });

  const getGroupedTasksforManager = (
    tasks: TCreateTaskResponse[],
    filter: string,
  ): Record<string, TCreateTaskResponse[]> => { // Уточняем возвращаемый тип
    if (filter === GroupTasks.SUBORDINATE) {
      const groupedBySubordinate: Record<string, TCreateTaskResponse[]> = {};

      tasks.forEach((task) => {
        const assigneeId = task.assignee?.id
          ? `Задачи ${task.assignee?.firstName} ${task.assignee?.middleName} ${task.assignee?.lastName}(${task.assignee?.role})`
          : 'other';
        if (!groupedBySubordinate[assigneeId]) {
          groupedBySubordinate[assigneeId] = [];
        }
        groupedBySubordinate[assigneeId].push(task);
      });

      return groupedBySubordinate;
    }
    return {}; // Возвращаем пустой объект, если условие не выполнено
  };

  const [groupedTasksFormanager, setGroupedTasksFormanager] = useState<
    Record<string, TCreateTaskResponse[]>
  >({});

  useEffect(() => {
    if (filter === GroupTasks.DATE) {
      const updatedGroupedTasks = getGroupedTasks(allTasks);
      setGroupedTasks(updatedGroupedTasks);
    } else if (filter === GroupTasks.SUBORDINATE) {
      const updatedGroupedTasksFormanager = getGroupedTasksforManager(allTasks, filter);
      setGroupedTasksFormanager(updatedGroupedTasksFormanager);
    }
  }, [allTasks, filter]);

  const [open, setOpen] = useState(false);
  const [selectTask, setSelectTask] = useState<TCreateTaskResponse | null>(
    null,
  );

  const handleOpenDialog = (task: TCreateTaskResponse) => {
    setSelectTask(task);
    setOpen(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  const dispatch = useAppDispatch();

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectTask(null);
  };

  const handleUpdateTaskDialog = (data: any) => {
    dispatch(updateTask({ taskdata: data, taskid: `${selectTask!.id}` }));
  };

  useEffect(() => {
    setFilter(GroupTasks.DEFAULT);
    dispatch(getAllTasks());
    dispatch(userInfo());
  }, []);

  const TaskGridItem: FC<IPropsGreedItem> = ({ task }) => (
    <Grid
      sx={{
        marginBottom: 2,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          cursor: 'pointer',
        },
      }}
      item
      xs={4}
      key={task.id}
      onClick={() => handleOpenDialog(task)}
    >
      <TaskItem task={task} />
    </Grid>
  );

  return (
    <>
      <SelectField
        title="Filter"
        nameKeyObject="filter"
        сhangeSelect={handleChange}
        stateValue={filter}
        enumProps={GroupTasks}
      />
      <Grid container spacing={0}>
        {(filter === GroupTasks.DEFAULT &&
          allTasks?.map((task: TCreateTaskResponse) => (
            <TaskGridItem key={task.id} task={task} />
          ))) ||
          null}
        {filter === GroupTasks.DATE && (
          <>
            <Typography variant="h6">На сегодня</Typography>
            <Grid container spacing={2}>
              {groupedTasks.today.map((task) => (
                <TaskGridItem key={task.id} task={task} />
              ))}
            </Grid>

            <Typography variant="h6">На неделю</Typography>
            <Grid container spacing={2}>
              {groupedTasks.thisWeek.map((task) => (
                <TaskGridItem key={task.id} task={task} />
              ))}
            </Grid>

            <Typography variant="h6">На будущее</Typography>
            <Grid container spacing={2}>
              {groupedTasks.future.map((task) => (
                <TaskGridItem key={task.id} task={task} />
              ))}
            </Grid>
          </>
        )}
        {filter === GroupTasks.SUBORDINATE &&
          Object.entries(groupedTasksFormanager).map(([assigneeId, tasks]) => (
            <>
              <Typography variant="h6">
                {assigneeId === 'other'
                  ? 'Остальное'
                  : `${assigneeId}`}
              </Typography>
              <Grid container spacing={2}>
                {tasks.map((task) => (
                  <TaskGridItem key={task.id} task={task} />
                ))}
              </Grid>
            </>
          ))}
        <FormDialog
          open={open}
          onClose={handleCloseDialog}
          handleSubmitDialog={handleUpdateTaskDialog}
          typeForm={TypeForm.UPDATE_TASK}
          disableFlag={
            ability.cannot(Action.Access, 'formField') && !!selectTask?.assignee
          }
          task={selectTask ? selectTask : null}
        >
          <TaskCreateFormFields
            allSubordinates={user?.subordinates || []}
            task={selectTask}
          />
        </FormDialog>
      </Grid>
    </>
  );
};

export default TaskTracker;
