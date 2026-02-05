import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchBoard, moveTask, updateTask, createTask, deleteTask } from '../store/boardSlice';
import { DropResult } from '@hello-pangea/dnd';
import { nanoid } from 'nanoid';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


if (!API_URL) {
    throw new Error('API_URL is not defined in .env file!');
}

export const useKanban = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, title } = useSelector((state: RootState) => state.board);

    const [boardInput, setBoardInput] = useState(id || '');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [targetColumn, setTargetColumn] = useState('todo');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');

    useEffect(() => {
        if (id) {
            setBoardInput(id);
            dispatch(fetchBoard(id)).then((res) => {
                if (res.meta.requestStatus === 'rejected' && id === 'default') {
                    axios.post(`${API_URL}/boards`, { id: 'default', title: 'My Workspace' })
                        .then(() => {
                            dispatch(fetchBoard('default'));
                        });
                }
            });
        }
    }, [id, dispatch]);

    const handleCreateBoard = async () => {
        const newId = nanoid(10);
        try {
            await axios.post(`${API_URL}/boards`, { id: newId, title: 'New Board' });
            navigate(`/board/${newId}`);
        } catch (e) {
            alert('Error creating board');
        }
    };

    const handleLoadBoard = () => {
        navigate(`/board/${boardInput}`);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const { draggableId, destination, source } = result;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        dispatch(moveTask({ id: draggableId, status: destination.droppableId, order: destination.index }));
        dispatch(updateTask({ id: draggableId, status: destination.droppableId, order: destination.index }));
    };

    const openCreateModal = (columnId: string) => {
        setModalMode('create');
        setTargetColumn(columnId);
        setTaskTitle('');
        setTaskDesc('');
        setIsModalOpen(true);
    };

    const openEditModal = (task: any) => {
        setModalMode('edit');
        setEditingTaskId(task.id);
        setTaskTitle(task.title);
        setTaskDesc(task.description || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTaskId(null);
    };

    const handleSaveTask = () => {
        if (!taskTitle.trim() || !id) return;

        if (modalMode === 'create') {
            dispatch(createTask({
                title: taskTitle,
                description: taskDesc,
                status: targetColumn,
                boardId: id,
                order: tasks.length
            }));
        } else if (modalMode === 'edit' && editingTaskId) {
            dispatch(updateTask({
                id: editingTaskId,
                title: taskTitle,
                description: taskDesc
            }));
        }
        closeModal();
    };

    const handleDeleteTask = () => {
        if (editingTaskId) {
            dispatch(deleteTask(editingTaskId));
            closeModal();
        }
    };

    return {
        boardData: { title, tasks, boardInput, setBoardInput },
        actions: { handleCreateBoard, handleLoadBoard, onDragEnd },
        modal: {
            isOpen: isModalOpen,
            mode: modalMode,
            title: taskTitle,
            setTitle: setTaskTitle,
            desc: taskDesc,
            setDesc: setTaskDesc,
            openCreate: openCreateModal,
            openEdit: openEditModal,
            close: closeModal,
            save: handleSaveTask,
            remove: handleDeleteTask
        }
    };
};