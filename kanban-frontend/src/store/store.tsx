import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './boardSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
});

// Эти типы нужны, чтобы TypeScript понимал структуру данных
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;