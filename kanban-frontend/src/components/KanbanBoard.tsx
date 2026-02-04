import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchBoard, updateTaskStatus, moveTaskOptimistic, createTask } from '../store/boardSlice';

const COLUMNS = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
];

export const KanbanBoard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, boardId, hashedId } = useSelector((state: RootState) => state.board);


    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Не забудь проверить, что тут стоит ТВОЙ актуальный ID (который ты получил в консоли)
        const demoId = 'e7f8g9h0'; // <--- ПРОВЕРЬ ЭТОТ ID
        dispatch(fetchBoard(demoId));
    }, [dispatch]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Если включен поиск, Drag-and-Drop лучше блокировать или быть осторожным,
        // так как позиции (index) в отфильтрованном списке не совпадают с реальными.
        if (searchQuery) return;

        dispatch(moveTaskOptimistic({
            id: draggableId,
            status: destination.droppableId,
            order: destination.index
        }));

        dispatch(updateTaskStatus({
            id: draggableId,
            status: destination.droppableId,
            order: destination.index
        }));
    };

    // Функция добавления новой задачи (по умолчанию в "To Do")
    const handleAddNewCard = () => {
        const title = prompt('Enter task title:');
        if (title && boardId) {
            dispatch(createTask({
                title,
                status: 'todo', // Всегда добавляем в первую колонку
                boardId,
                order: tasks.filter(t => t.status === 'todo').length
            }));
        }
    };

    if (!boardId && !hashedId) return <div style={{padding: 20}}>Loading...</div>;

    // 2. Логика фильтрации
    // Мы фильтруем задачи, но не меняем их в Redux, только визуально
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="app-layout">
            {/* 3. Верхняя панель */}
            <div className="top-bar">
                <h3 style={{ marginRight: 'auto', color: '#172b4d' }}>Kanban Board</h3>

                <input
                    type="text"
                    placeholder="Search cards..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button className="primary-btn" onClick={handleAddNewCard}>
                    + Add New Card
                </button>
            </div>

            <div className="board-container">
                <DragDropContext onDragEnd={onDragEnd}>
                    {COLUMNS.map(column => (
                        <Droppable key={column.id} droppableId={column.id}>
                            {(provided) => (
                                <div
                                    className="column"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <div className="column-header">
                                        {column.title}
                                        <span>
                      {/* Считаем количество отфильтрованных задач */}
                                            {filteredTasks.filter(t => t.status === column.id).length}
                    </span>
                                    </div>

                                    <div className="task-list">
                                        {filteredTasks
                                            .filter(task => task.status === column.id)
                                            .sort((a, b) => a.order - b.order)
                                            .map((task, index) => (
                                                <Draggable
                                                    key={task.id}
                                                    draggableId={task.id}
                                                    index={index}
                                                    // Блокируем перетаскивание, если работает поиск (чтобы не сломать сортировку)
                                                    isDragDisabled={!!searchQuery}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            {task.title}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
};