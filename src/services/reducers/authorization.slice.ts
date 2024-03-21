import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signinApi,
  logoutApi,
  registerApi,
  userInfoApi,
  updateTokenApi,
} from '../../auth/auth';
import { setCookie, deleteCookie } from '../../auth/auth';
import {
  TUserSigninData,
  TSigninResponse,
  TUserRegisterData,
  TUserRegisterResponse,
} from '../../utils/types/auth';

type TAuthorizationState = {
  isLoading: boolean;
  isLogin: boolean;
  isRegistered: boolean;
  user: TSigninResponse | null;
  allUsers: TUserRegisterResponse[] | null;
  error: string | null;
  isJwtExpired: boolean;
};

const initialState: TAuthorizationState = {
  isLoading: false,
  isRegistered: false,
  isLogin: false,
  user: null,
  allUsers: null,
  error: null,
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
      return rejectWithValue(error);
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
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  },
);

//-- Асинхронное thunk-действие регистраии в приложении --//
export const register = createAsyncThunk(
  '/api/register',
  async (userData: TUserRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerApi(userData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
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
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
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
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  },
);

const authorizationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //-- Обработка состояний во время регистрации --//
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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
        state.error = action.payload as string;
      })

      //-- Обработка состояний во время входа в приложение --//
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as TSigninResponse;
        state.isLogin = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      })

      //-- Обработка состояний получения информации о пользователе --//
      .addCase(userInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as TSigninResponse;
        state.isLogin = true;
        state.error = null;
        state.isJwtExpired = false;
      })
      .addCase(userInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isJwtExpired = true;
      })

      //-- Обработка состояний обновления токена --//
      .addCase(updateToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.isJwtExpired = false;
      })
      .addCase(updateToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isJwtExpired = true;
      });
  },
});

export const { clearError } = authorizationSlice.actions;

export default authorizationSlice.reducer;
