import boardReducer, { moveTask } from '../src/store/boardSlice';

describe('boardSlice tests', () => {
    const initialState = {
        id: 'test-board',
        title: 'Test Board',
        loading: false,
        error: null,
        tasks: [
            { id: '1', title: 'Task 1', description: '', status: 'todo' as const, order: 0 },
            { id: '2', title: 'Task 2', description: '', status: 'todo' as const, order: 1 },
        ],
    };

    it('should handle initial state', () => {
        expect(boardReducer(undefined, { type: 'unknown' })).toEqual({
            id: null,
            title: '',
            tasks: [],
            loading: false,
            error: null,
        });
    });

    it('should move task successfully (Optimistic Update)', () => {
        const action = moveTask({ id: '1', status: 'done', order: 0 });
        const newState = boardReducer(initialState, action);

        const movedTask = newState.tasks.find(t => t.id === '1');
        expect(movedTask?.status).toBe('done');
    });
});