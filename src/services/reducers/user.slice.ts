import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  ICustomErrorResponse,
  TSigninResponse,
  TUserRegisterData,
  TUserRegisterResponse,
} from '../../utils/types/types';
import { getAllUsersApi, registerUserApi } from '../../api/users/users';
import { clearErrorsState } from './commonActions';

type TUsersState = {
  isLoading: boolean;
  isRegistered: boolean;
  user: TSigninResponse | null;
  allUsers: TUserRegisterResponse[] | null;
  error: string | null;
};

const initialState: TUsersState = {
  isLoading: false,
  isRegistered: false,
  user: null,
  allUsers: null,
  error: null,
};

//-- Асинхронное thunk-действие регистраии в приложении --//
export const registerUser = createAsyncThunk(
  '/api/registerUser',
  async (userData: TUserRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      return response;
    } catch (error) {
      const customError = error as ICustomErrorResponse;
      return rejectWithValue(Array.isArray(customError.error.message) ? `${customError.status} - ${customError.statusText}` : customError.error.message);
    }
  },
);

//-- Асинхронное thunk-действие получения всех пользователей --//
export const getAllUsers = createAsyncThunk(
  '/api/users',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsersApi();
      return response;
    } catch (error) {
      const customError = error as ICustomErrorResponse;
      return rejectWithValue(Array.isArray(customError.error.message) ? `${customError.status} - ${customError.statusText}` : customError.error.message);
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetRegistrationState(state) {
      state.isRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //-- Обработка состояний во время регистрации --//
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isRegistered = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRegistered = true;
        state.allUsers = [
          ...(state.allUsers || []),
          action.payload as TUserRegisterResponse,
        ];
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isRegistered = false;
        state.error = action.payload as string;
      })

      //-- Обработка состояний во время получения всех пользователей --//
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload;
        state.error = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(clearErrorsState, (state) => {
        state.error = null;
      });
  },
});

export const { resetRegistrationState } = usersSlice.actions;

export default usersSlice.reducer;
