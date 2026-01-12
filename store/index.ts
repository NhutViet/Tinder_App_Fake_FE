import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import swipeReducer from './slices/swipeSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    swipe: swipeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
