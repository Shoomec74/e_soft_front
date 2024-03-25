import { combineReducers, configureStore, createAction } from '@reduxjs/toolkit';
import authorizationReducer from './reducers/authorization.slice';
import usersSlice from './reducers/user.slice'
import tasksSlice from './reducers/tasks.slice'

const rootReducer = combineReducers({
  auth: authorizationReducer,
  users: usersSlice,
  tasks: tasksSlice,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
