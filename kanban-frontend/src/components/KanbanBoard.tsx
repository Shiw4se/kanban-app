import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useKanban } from '../hooks/useKanban';
import './KanbanBoard.css';

const COLUMNS = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
];

export const KanbanBoard = () => {
    const { boardData, actions, modal } = useKanban();

    return (
        <div className="kanban-container">
            <div className="top-bar">
                <input
                    className="board-input"
                    placeholder="Enter board ID..."
                    value={boardData.boardInput}
                    onChange={(e) => boardData.setBoardInput(e.target.value)}
                />
                <button className="btn btn-primary" onClick={actions.handleLoadBoard}>Load</button>
                <button className="btn btn-success" onClick={actions.handleCreateBoard}>New Board</button>
            </div>

            <h1 className="board-title">{boardData.title || 'Loading...'}</h1>

            <DragDropContext onDragEnd={actions.onDragEnd}>
                <div className="columns-wrapper">
                    {COLUMNS.map(col => (
                        <Droppable key={col.id} droppableId={col.id}>
                            {(provided) => (
                                <div
                                    className="column"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <h2 className="column-header">{col.title}</h2>

                                    {boardData.tasks
                                        .filter(t => t.status === col.id)
                                        .map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                        onClick={() => modal.openEdit(task)}
                                                    >
                                                        <div className="task-title">{task.title}</div>
                                                        {task.description && <div className="task-desc">{task.description}</div>}
                                                        <div className="edit-icon">✎</div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}

                                    <button className="add-task-btn" onClick={() => modal.openCreate(col.id)}>+</button>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            {modal.isOpen && (
                <div className="modal-overlay" onClick={modal.close}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            {modal.mode === 'create' ? 'Create Task' : 'Edit Task'}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                autoFocus
                                className="form-input"
                                value={modal.title}
                                onChange={e => modal.setTitle(e.target.value)}
                                placeholder="What needs to be done?"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={modal.desc}
                                onChange={e => modal.setDesc(e.target.value)}
                                placeholder="Add more details..."
                            />
                        </div>

                        <div className="modal-buttons">
                            {modal.mode === 'edit' && (
                                <button className="btn btn-danger" onClick={modal.remove}>Delete</button>
                            )}
                            <button className="btn btn-secondary" onClick={modal.close}>Cancel</button>
                            <button className="btn btn-primary" onClick={modal.save}>
                                {modal.mode === 'create' ? 'Create' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};