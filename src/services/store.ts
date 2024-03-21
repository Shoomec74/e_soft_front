import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authorizationReducer from './reducers/authorization.slice';
import modalsSlice from './reducers/modals.slice'

const rootReducer = combineReducers({
  auth: authorizationReducer,
  modals: modalsSlice,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
