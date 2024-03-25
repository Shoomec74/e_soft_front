import { PriorityTask, ProgressTask, UserRole } from "./types/types";

export const getPriorityLabel = (priority: PriorityTask): string => {
  switch (priority) {
    case PriorityTask.HIGH:
      return 'Высокий';
    case PriorityTask.MEDIUM:
      return 'Средний';
    case PriorityTask.LOW:
      return 'Низкий';
    default:
      return 'Неизвестный приоритет';
  }
};

export const getProgressLabel = (progress: ProgressTask): string => {
  switch (progress) {
    case ProgressTask.TODO:
      return 'К выполнению';
    case ProgressTask.IN_PROGRESS:
      return 'Выполняется';
    case ProgressTask.DONE:
      return 'Выполнена';
    case ProgressTask.CANCELLED:
      return 'Отменена';
    default:
      return 'Неизвестный статус';
  }
};

export const getProgressRole = (progress: UserRole): string => {
  switch (progress) {
    case UserRole.MANAGER:
      return 'Менеджер';
    case UserRole.SUBORDINATE:
      return 'Подчиненный';
    default:
      return 'Неизвестный статус';
  }
};

