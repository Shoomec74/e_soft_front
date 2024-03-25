import { TCreateTaskData, TCreateTaskResponse, TUpdateTaskData } from '../../utils/types/types';
import { getReq, patchReq, postReq } from '../apiMethods';

//-- Функция для отправки запроса регистрации пользователя --//
async function createTaskApi(taskData: TCreateTaskData) {
  //-- Отправляет данные пользователя на API для регистрации
  return postReq<TCreateTaskResponse>({ uri: 'api/tasks', data: taskData, auth: true });
}

//-- Функция для отправки запроса регистрации пользователя --//
async function updateTaskApi(taskData: TUpdateTaskData, taskId: string) {
  //-- Отправляет данные пользователя на API для регистрации
  return patchReq<TCreateTaskResponse>({ uri: 'api/tasks', data: taskData, auth: true, id: taskId });
}

//-- Функция для отправки запроса регистрации пользователя --//
async function getAllTasksApi() {
  //-- Отправляет данные пользователя на API для регистрации
  return getReq<TCreateTaskResponse[]>({ uri: 'api/tasks', auth: true });
}

//-- Экспортирует функции API для их использования в других частях приложения --//
export { createTaskApi, getAllTasksApi, updateTaskApi };
