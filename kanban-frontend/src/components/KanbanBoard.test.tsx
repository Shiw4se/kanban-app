import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { KanbanBoard } from './KanbanBoard';
import boardReducer from '../store/boardSlice';


const createTestStore = () => {
    return configureStore({
        reducer: { board: boardReducer },
        preloadedState: {
            board: {
                id: 'test-123',
                title: 'Integration Test Board',
                tasks: [],
                loading: false
            }
        }
    });
};

vi.mock('@hello-pangea/dnd', () => ({
    DragDropContext: ({ children }: any) => <div>{children}</div>,
    Droppable: ({ children }: any) => children({
        droppableProps: {},
        innerRef: () => {},
        placeholder: null
    }, {}),
    Draggable: ({ children }: any) => children({
        draggableProps: {},
        dragHandleProps: {},
        innerRef: () => {}
    }, {})
}));

vi.mock('../hooks/useKanban', () => ({
    useKanban: () => ({
        boardData: {
            title: 'Mocked Board',
            tasks: [{ id: '1', title: 'Mock Task', status: 'todo' }],
            boardInput: '123',
            setBoardInput: vi.fn()
        },
        actions: { handleCreateBoard: vi.fn(), handleLoadBoard: vi.fn(), onDragEnd: vi.fn() },
        modal: { isOpen: false }
    })
}));

describe('KanbanBoard Component', () => {
    it('renders board title from hook', () => {
        const store = createTestStore();

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <KanbanBoard />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText('Mocked Board')).toBeInTheDocument();
        expect(screen.getByText('Mock Task')).toBeInTheDocument();
    });
});