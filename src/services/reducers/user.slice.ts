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
  isUserRegistered: boolean;
  isUserUpdated: boolean;
  user: TSigninResponse | null;
  allUsers: TUserRegisterResponse[] | null;
  errorUsers: string | null;
};

const initialState: TUsersState = {
  isLoading: false,
  isUserRegistered: false,
  isUserUpdated: false,
  user: null,
  allUsers: null,
  errorUsers: null,
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
    resetUserState(state) {
      state.isUserRegistered = false;
      state.isUserUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //-- Обработка состояний во время регистрации --//
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.errorUsers = null;
        state.isUserRegistered = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserRegistered = true;
        state.allUsers = [
          ...(state.allUsers || []),
          action.payload as TUserRegisterResponse,
        ];
        state.errorUsers = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isUserRegistered = false;
        state.errorUsers = action.payload as string;
      })

      //-- Обработка состояний во время получения всех пользователей --//
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.errorUsers = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload;
        state.errorUsers = null;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.errorUsers = action.payload as string;
      })
      .addCase(clearErrorsState, (state) => {
        state.errorUsers = null;
      });
  },
});

export const { resetUserState } = usersSlice.actions;

export default usersSlice.reducer;
