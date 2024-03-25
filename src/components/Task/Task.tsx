// TaskItem.tsx
import { Card, CardContent, Typography } from '@mui/material';
import moment from 'moment';
import { FC } from 'react';
import { ProgressTask, TCreateTaskResponse } from '../../utils/types/types';
import { getPriorityLabel, getProgressLabel } from '../../utils/utils';

interface TaskItemProps {
  task: TCreateTaskResponse;
}

const TaskItem: FC<TaskItemProps> = ({ task }) => {
  const isPastDue = moment().isAfter(moment(task.deadline));

  return (
    <Card variant="outlined" sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={
            isPastDue && task.status !== ProgressTask.DONE
              ? { color: 'red' }
              : {
                  color:
                    task.status !== ProgressTask.DONE
                      ? 'text.secondary'
                      : 'green',
                }
          }
        >
          {task.title}
        </Typography>
        <Typography
          sx={
            task.priority === 'low'
              ? { mb: 1.5, color: 'blue' }
              : {
                  mb: 1.5,
                  color: task.priority === 'medium' ? 'orange' : 'red',
                }
          }
        >
          {`${getPriorityLabel(task.priority)} приоритет`}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {`Дата окончания: ${moment(task.deadline).format('DD.MM.YY')}`}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {task.assignee
            ? `Ответственный: ${task.assignee.firstName} ${task.assignee.lastName} ${task.assignee.middleName}(${task.assignee.role})`
            : `Ответственный: ${task.creator.firstName} ${task.creator.lastName} ${task.creator.middleName}(${task.creator.role})`}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`Создатель: ${task.creator.firstName} ${task.creator.lastName} ${task.creator.middleName}(${task.creator.role})`}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {`Статус: ${getProgressLabel(task.status)}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
