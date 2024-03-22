import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authorizationReducer from './reducers/authorization.slice';
import modalsSlice from './reducers/modals.slice'
import usersSlice from './reducers/user.slice'

const rootReducer = combineReducers({
  auth: authorizationReducer,
  modals: modalsSlice,
  users: usersSlice,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
