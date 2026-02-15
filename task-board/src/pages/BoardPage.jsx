import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { LogOut, Plus, Search, Filter, RotateCcw, Calendar, History, Circle, Loader, CheckCircle2 } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import '../styles/BoardPage.css';

const BoardPage = () => {
    const { user, logout } = useAuth();
    const { tasks, moveTask, resetBoard, activityLog, addTask, updateTask } = useTasks();

    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortByDate, setSortByDate] = useState(false);
    const [showActivityLog, setShowActivityLog] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        moveTask(draggableId, destination.droppableId);
    };

    const columns = ['todo', 'doing', 'done'];

    const filteredTasks = useMemo(() => {
        let result = tasks;

        // Search
        if (searchQuery) {
            result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Filter
        if (priorityFilter !== 'all') {
            result = result.filter(t => t.priority === priorityFilter);
        }

        // Sort
        if (sortByDate) {
            result = [...result].sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        }

        return result;
    }, [tasks, searchQuery, priorityFilter, sortByDate]);

    const getColumnTasks = (columnId) => filteredTasks.filter(t => t.status === columnId);

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset the board? All tasks will be deleted.')) {
            resetBoard();
        }
    };

    const handleNewTask = () => {
        setCurrentTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (taskData) => {
        if (currentTask) {
            updateTask(currentTask.id, taskData);
        } else {
            addTask(taskData);
        }
    };

    return (
        <div className="board-container">
            <header className="board-header glass-panel">
                <div className="header-left">
                    <h1 className="app-title">TaskBoard</h1>
                </div>
                <div className="header-right">
                    <span className="user-welcome">Hello, {user?.name}</span>
                    <button className="icon-btn" onClick={() => setShowActivityLog(!showActivityLog)} title="Activity Log">
                        <History size={20} />
                    </button>
                    <button className="icon-btn danger-hover" onClick={logout} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <div className="controls-bar glass-panel">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filters-wrapper">
                    <div className="select-wrapper">
                        <Filter size={16} className="select-icon" />
                        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                            <option value="all">All Priorities</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <button
                        className={`filter-btn ${sortByDate ? 'active' : ''}`}
                        onClick={() => setSortByDate(!sortByDate)}
                        title="Sort by Due Date"
                    >
                        <Calendar size={18} />
                    </button>

                    <button className="btn-secondary" onClick={handleReset}>
                        <RotateCcw size={16} /> Reset
                    </button>

                    <button className="btn-primary-sm" onClick={handleNewTask}>
                        <Plus size={16} /> New Task
                    </button>
                </div>
            </div>

            <main className="board-main">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="board-columns">
                        {columns.map(columnId => (
                            <Droppable key={columnId} droppableId={columnId}>
                                {(provided, snapshot) => {
                                    const isTodo = columnId === 'todo';
                                    const isDoing = columnId === 'doing';
                                    const isDone = columnId === 'done';

                                    return (
                                        <div
                                            className={`board-column ${columnId} glass-panel ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            <h2 className="column-title">
                                                {isTodo && <Circle size={20} className="column-icon" />}
                                                {isDoing && <Loader size={20} className="column-icon spin" />}
                                                {isDone && <CheckCircle2 size={20} className="column-icon" />}
                                                {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                                                <span className="task-count">{getColumnTasks(columnId).length}</span>
                                            </h2>
                                            <div className="task-list">
                                                {getColumnTasks(columnId).map((task, index) => (
                                                    <TaskCard key={task.id} task={task} index={index} onEdit={handleEditTask} />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </div>
                                    );
                                }}
                            </Droppable>
                        ))}
                    </div>
                </DragDropContext>

                {showActivityLog && (
                    <div className="activity-sidebar glass-panel">
                        <div className="sidebar-header">
                            <h3>Activity Log</h3>
                            <button onClick={() => setShowActivityLog(false)}>×</button>
                        </div>
                        <ul className="activity-list">
                            {activityLog.length === 0 ? (
                                <li className="empty-log">No activity yet.</li>
                            ) : (
                                activityLog.map(log => (
                                    <li key={log.id} className="log-item">
                                        <div className="log-action">{log.action}</div>
                                        <div className="log-details">{log.details}</div>
                                        <div className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                taskToEdit={currentTask}
            />
        </div>
    );
};

export default BoardPage;
