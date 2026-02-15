import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { useTasks } from '../context/TaskContext';
import { Calendar, Trash2, Edit, AlertCircle, Clock } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import '../styles/TaskCard.css';

const PriorityBadge = ({ priority }) => {
    const colors = {
        high: 'bg-red-500',
        medium: 'bg-yellow-500',
        low: 'bg-green-500'
    };

    return (
        <span className={`priority-badge ${priority}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
};

const TaskCard = ({ task, index, onEdit }) => {
    const { deleteTask } = useTasks();

    const formattedDate = task.dueDate ? format(new Date(task.dueDate), 'MMM d') : '';
    const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent drag start if clicking buttons
        if (window.confirm(`Delete task "${task.title}"?`)) {
            deleteTask(task.id);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(task);
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={`task-card glass-panel ${snapshot.isDragging ? 'dragging' : ''}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        // Custom styles if needed
                    }}
                >
                    <div className="task-header">
                        <PriorityBadge priority={task.priority} />
                        <div className="task-actions">
                            <button className="icon-btn-sm" onClick={handleEdit} title="Edit">
                                <Edit size={14} />
                            </button>
                            <button className="icon-btn-sm danger" onClick={handleDelete} title="Delete">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    <h3 className="task-title">{task.title}</h3>

                    {task.description && <p className="task-description">{task.description}</p>}

                    <div className="task-footer">
                        {task.dueDate && (
                            <div className={`task-date ${isOverdue ? 'overdue' : ''}`}>
                                <Clock size={14} />
                                <span>{formattedDate}</span>
                            </div>
                        )}
                        <div className="task-avatar">
                            {/* Placeholder for assignee avatar if needed, otherwise just ID or created details */}
                            <span className="task-id">#{task.id.slice(0, 4)}</span>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
