import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    order: number;
}

interface BoardState {
    boardId: string | null;
    hashedId: string | null;
    title: string;
    tasks: Task[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: BoardState = {
    boardId: null,
    hashedId: null,
    title: '',
    tasks: [],
    status: 'idle',
};

// Загрузка доски
export const fetchBoard = createAsyncThunk('board/fetchBoard', async (hashedId: string) => {
    const response = await axios.get(`http://localhost:3000/boards/${hashedId}`);
    return response.data;
});

// Создание задачи
export const createTask = createAsyncThunk('board/createTask', async (taskData: { title: string; boardId: string; status: string; order: number }) => {
    const response = await axios.post('http://localhost:3000/tasks', taskData);
    return response.data;
});

// Перемещение задачи
export const updateTaskStatus = createAsyncThunk('board/updateTask', async (payload: { id: string; status: string; order: number }) => {
    await axios.patch(`http://localhost:3000/tasks/${payload.id}`, {
        status: payload.status,
        order: payload.order,
    });
    return payload;
});

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        moveTaskOptimistic: (state, action: PayloadAction<{ id: string; status: string; order: number }>) => {
            const task = state.tasks.find((t) => t.id === action.payload.id);
            if (task) {
                task.status = action.payload.status as any;
                task.order = action.payload.order;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoard.fulfilled, (state, action) => {
                state.boardId = action.payload.id;
                state.hashedId = action.payload.hashedId;
                state.title = action.payload.title;
                state.tasks = action.payload.tasks;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            });
    },
});

export const { moveTaskOptimistic } = boardSlice.actions;
export default boardSlice.reducer;