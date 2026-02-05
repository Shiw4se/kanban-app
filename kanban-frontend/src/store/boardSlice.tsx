import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_URL;

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    order: number;
}

interface BoardState {
    id: string | null;
    title: string;
    tasks: Task[];
    loading: boolean;
}

const initialState: BoardState = {
    id: null,
    title: '',
    tasks: [],
    loading: false,
};

export const fetchBoard = createAsyncThunk('board/fetch', async (id: string) => {
    const response = await axios.get(`${API_URL}/boards/${id}`);
    return response.data;
});

export const createTask = createAsyncThunk('task/create', async (data: any) => {
    const response = await axios.post(`${API_URL}/tasks`, data);
    return response.data;
});

export const updateTask = createAsyncThunk('task/update', async ({ id, ...data }: any) => {
    const response = await axios.patch(`${API_URL}/tasks/${id}`, data);
    return response.data;
});

export const deleteTask = createAsyncThunk('task/delete', async (id: string) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    return id;
});

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        moveTask: (state, action: PayloadAction<{ id: string, status: string, order: number }>) => {
            const task = state.tasks.find(t => t.id === action.payload.id);
            if (task) {
                task.status = action.payload.status as any;
                task.order = action.payload.order;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoard.fulfilled, (state, action) => {
                state.id = action.payload.id;
                state.title = action.payload.title;
                state.tasks = action.payload.tasks;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.tasks[index] = action.payload;
            });
    },
});

export const { moveTask } = boardSlice.actions;
export default boardSlice.reducer;