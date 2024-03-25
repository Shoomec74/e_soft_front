import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createTaskApi,
  getAllTasksApi,
  updateTaskApi,
} from '../../api/task/taskApi';
import {
  ICustomErrorResponse,
  TCreateTaskData,
  TCreateTaskResponse,
  TUpdateTaskData,
} from '../../utils/types/types';
import { clearErrorsState } from './commonActions';

type TTasksState = {
  isLoading: boolean;
  allTasks: TCreateTaskResponse[];
  errorTask: string | null;
  isCreated: boolean;
  isUpdated: boolean;
};

const initialState: TTasksState = {
  isLoading: false,
  allTasks: [],
  errorTask: null,
  isCreated: false,
  isUpdated: false,
};

//-- Асинхронное thunk-действие входа в приложение --//
export const createTask = createAsyncThunk(
  '/api/createTask',
  async (taskdata: TCreateTaskData, { rejectWithValue }) => {
    try {
      return await createTaskApi(taskdata);
    } catch (error) {
      const customError = error as ICustomErrorResponse;
      return rejectWithValue(
        Array.isArray(customError.error.message)
          ? `${customError.status} - ${customError.statusText}`
          : customError.error.message,
      );
    }
  },
);

interface IActionType {
  taskdata: TUpdateTaskData;
  taskid: string;
}

//-- Асинхронное thunk-действие выхода из приложения --//
export const updateTask = createAsyncThunk(
  '/api/updateTask',
  async ({ taskdata, taskid }: IActionType, { rejectWithValue }) => {
    try {
      return await updateTaskApi(taskdata, taskid);
    } catch (error) {
      const customError = error as ICustomErrorResponse;
      return rejectWithValue(
        Array.isArray(customError.error.message)
          ? `${customError.status} - ${customError.statusText}`
          : customError.error.message,
      );
    }
  },
);

//-- Асинхронное thunk-действие входа в приложение --//
export const getAllTasks = createAsyncThunk(
  '/api/allTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllTasksApi();
    } catch (error) {
      const customError = error as ICustomErrorResponse;
      return rejectWithValue(
        Array.isArray(customError.error.message)
          ? `${customError.status} - ${customError.statusText}`
          : customError.error.message,
      );
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetTaskState(state) {
      state.isCreated = false;
      state.isUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //-- Обработка состояний во время создания задания --//
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.errorTask = null;
        state.isCreated = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTasks = [...(state.allTasks || []), action.payload];
        state.errorTask = null;
        state.isCreated = true;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.errorTask = action.payload as string;
        state.isCreated = false;
      })

      //-- Обработка состояний во время получения всех заданий --//
      .addCase(getAllTasks.pending, (state) => {
        state.isLoading = true;
        state.errorTask = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allTasks = action.payload;
        state.errorTask = null;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.errorTask = action.payload as string;
      })

      //-- Обработка состояний во время обновления задания --//
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
        state.errorTask = null;
        state.isUpdated = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // Ищем индекс обновленной задачи в массиве
          const index = state.allTasks.findIndex(
            (task) => task.id === action.payload.id,
          );
          // Если задача найдена, обновляем её данные
          if (index !== -1) {
            state.allTasks[index] = action.payload;
          }
        }
        state.errorTask = null;
        state.isUpdated = true;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.errorTask = action.payload as string;
      })
      .addCase(clearErrorsState, (state) => {
        state.errorTask = null;
        state.isUpdated = false;
      });
  },
});

export const { resetTaskState } = tasksSlice.actions;

export default tasksSlice.reducer;
