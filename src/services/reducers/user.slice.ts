import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerApi } from '../../api/auth/auth';
import {
  TSigninResponse,
  TUserRegisterData,
  TUserRegisterResponse,
} from '../../utils/types/auth';
import { getAllUsersApi } from '../../api/users/users';

type TAuthorizationState = {
  isLoading: boolean;
  isRegistered: boolean;
  user: TSigninResponse | null;
  allUsers: TUserRegisterResponse[] | null;
  error: string | null;
};

const initialState: TAuthorizationState = {
  isLoading: false,
  isRegistered: false,
  user: null,
  allUsers: null,
  error: null,
};

//-- Асинхронное thunk-действие регистраии в приложении --//
export const register = createAsyncThunk(
  '/api/register',
  async (userData: TUserRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
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
      return rejectWithValue(error);
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearErrorUsers(state) {
      state.error = null;
      //state.isRegistered = false;
    },
    resetRegistrationState(state) {
      state.isRegistered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //-- Обработка состояний во время регистрации --//
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isRegistered = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRegistered = true;
        state.allUsers = [
          ...(state.allUsers || []),
          action.payload as TUserRegisterResponse,
        ];
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
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
      });
  },
});

export const { clearErrorUsers, resetRegistrationState } = usersSlice.actions;

export default usersSlice.reducer;
