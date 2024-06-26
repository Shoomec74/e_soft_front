import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import {
  signinApi,
  logoutApi,
  userInfoApi,
  updateTokenApi,
} from '../../api/auth/auth';
import { setCookie, deleteCookie } from '../../api/auth/auth';
import {
  TUserSigninData,
  TSigninResponse,
  TUserRegisterResponse,
  ICustomErrorResponse,
} from '../../utils/types/types';
import { clearErrorsState } from './commonActions';

type TAuthorizationState = {
  isLoading: boolean;
  isLogin: boolean;
  isRegistered: boolean;
  user: TSigninResponse | null;
  allUsers: TUserRegisterResponse[] | null;
  errorAuth: string | null;
  isJwtExpired: boolean;
};

const initialState: TAuthorizationState = {
  isLoading: false,
  isRegistered: false,
  isLogin: false,
  user: null,
  allUsers: null,
  errorAuth: null,
  isJwtExpired: false,
};

//-- Асинхронное thunk-действие входа в приложение --//
export const signIn = createAsyncThunk(
  '/api/login',
  async (userData: TUserSigninData, { rejectWithValue }) => {
    try {
      const response = await signinApi(userData);
      setCookie('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
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

//-- Асинхронное thunk-действие выхода из приложения --//
export const signOut = createAsyncThunk(
  '/api/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('token');
      return;
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
export const userInfo = createAsyncThunk(
  '/api/users/me',
  async (_, { rejectWithValue }) => {
    try {
      return await userInfoApi();
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

//-- Асинхронное thunk-действие регистраии в приложении --//
export const updateToken = createAsyncThunk(
  '/api/refresh',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await updateTokenApi(refreshToken);
      setCookie('token', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
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

const authorizationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.isRegistered = false;
      state.isLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder

      //-- Обработка состояний во время входа в приложение --//
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.errorAuth = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as TSigninResponse;
        state.isLogin = true;
        state.errorAuth = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.errorAuth = action.payload as string;
      })

      //-- Обработка состояний выхода из приложения --//
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.isLogin = false;
        state.user = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.errorAuth = action.payload as string;
      })

      //-- Обработка состояний получения информации о пользователе --//
      .addCase(userInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as TSigninResponse;
        state.isLogin = true;
        state.errorAuth = null;
        state.isJwtExpired = false;
      })
      .addCase(userInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.errorAuth = action.payload as string;
        state.isJwtExpired = true;
      })

      //-- Обработка состояний обновления токена --//
      .addCase(updateToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorAuth = null;
        state.isJwtExpired = false;
      })
      .addCase(updateToken.rejected, (state, action) => {
        state.isLoading = false;
        state.errorAuth = action.payload as string;
        state.isJwtExpired = true;
      })
      .addCase(clearErrorsState, (state) => {
        state.errorAuth = null;
      });
  },
});

export const { clearAuthError } = authorizationSlice.actions;

export default authorizationSlice.reducer;
