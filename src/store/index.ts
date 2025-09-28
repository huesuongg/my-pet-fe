import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authenticate/authSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import shoppingReducer from '../features/shopping/shoppingSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] ,
  
};

const rootReducer = combineReducers({
  auth: authReducer,
  shopping: shoppingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;