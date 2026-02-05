import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error('API_URL is not defined in .env file!');
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    order: number;
}


interface CreateTaskPayload {
    title: string;
    description: string;
    status: string;
    boardId: string;
    order: number;
}

interface UpdateTaskPayload {
    id: string;
    title?: string;
    description?: string;
    status?: string;
    order?: number;
}

interface BoardState {
    id: string | null;
    title: string;
    tasks: Task[];
    loading: boolean;
    error: string | null;
}

const initialState: BoardState = {
    id: null,
    title: '',
    tasks: [],
    loading: false,
    error: null,
};


const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }
    return (error as Error).message || 'Unknown error';
};

export const fetchBoard = createAsyncThunk(
    'board/fetch',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/boards/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const createTask = createAsyncThunk(
    'task/create',
    async (data: CreateTaskPayload, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/tasks`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateTask = createAsyncThunk(
    'task/update',
    async ({ id, ...data }: UpdateTaskPayload, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/tasks/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const deleteTask = createAsyncThunk(
    'task/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        moveTask: (state, action: PayloadAction<{ id: string, status: string, order: number }>) => {
            const task = state.tasks.find(t => t.id === action.payload.id);
            if (task) {
                task.status = action.payload.status as Task['status'];
                task.order = action.payload.order;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBoard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBoard.fulfilled, (state, action) => {
                state.loading = false;
                state.id = action.payload.id;
                state.title = action.payload.title;
                state.tasks = action.payload.tasks;
            })
            .addCase(fetchBoard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || 'Board not found';
                state.title = 'Board not found';
                state.tasks = [];
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