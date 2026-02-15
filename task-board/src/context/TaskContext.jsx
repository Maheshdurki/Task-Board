import React, { createContext, useState, useEffect, useContext } from 'react';

// I'll use Date.now() for simplicity as uuid is not installed, or I can install it. 
// Actually, I'll use a simple generator or install uuid. I'll stick to a simple generator to avoid extra deps if possible, but uuid is standard.
// I'll use crypto.randomUUID() if available (modern browsers) or a fallback.

const TaskContext = createContext(null);

export const useTasks = () => useContext(TaskContext);

const INITIAL_TASKS = [
    { id: 't1', title: 'Welcome to Task Board', description: 'This is a sample task. Drag me around!', status: 'todo', priority: 'medium', dueDate: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: 't2', title: 'InProgress Task', description: 'This task is currently being worked on.', status: 'doing', priority: 'high', dueDate: new Date(Date.now() + 86400000).toISOString(), createdAt: new Date().toISOString() },
    { id: 't3', title: 'Completed Task', description: 'This task is done.', status: 'done', priority: 'low', dueDate: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date().toISOString() }
];

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('taskBoardData');
        return saved ? JSON.parse(saved) : INITIAL_TASKS;
    });

    const [activityLog, setActivityLog] = useState(() => {
        const savedLog = localStorage.getItem('taskBoardLog');
        return savedLog ? JSON.parse(savedLog) : [];
    });

    useEffect(() => {
        localStorage.setItem('taskBoardData', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('taskBoardLog', JSON.stringify(activityLog));
    }, [activityLog]);

    const logAction = (action, details) => {
        const newLog = {
            id: Date.now().toString(),
            action,
            details,
            timestamp: new Date().toISOString(),
        };
        setActivityLog(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 actions
    };

    const addTask = (taskData) => {
        const newTask = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            status: 'todo', // Default column
            ...taskData
        };
        setTasks(prev => [...prev, newTask]);
        logAction('Created Task', `Task "${newTask.title}" created`);
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
        const task = tasks.find(t => t.id === id);
        logAction('Updated Task', `Task "${task?.title || id}" updated`);
    };

    const deleteTask = (id) => {
        const task = tasks.find(t => t.id === id);
        setTasks(prev => prev.filter(t => t.id !== id));
        logAction('Deleted Task', `Task "${task?.title || id}" deleted`);
    };

    const moveTask = (id, newStatus) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        const task = tasks.find(t => t.id === id);
        // Only log if status actually changed (calling component handles this check usually, but safe here)
        if (task && task.status !== newStatus) {
            logAction('Moved Task', `Task "${task.title}" moved to ${newStatus}`);
        }
    };

    const resetBoard = () => {
        setTasks([]);
        setActivityLog([]);
        logAction('Reset Board', 'Board was reset');
    };

    return (
        <TaskContext.Provider value={{ tasks, activityLog, addTask, updateTask, deleteTask, moveTask, resetBoard }}>
            {children}
        </TaskContext.Provider>
    );
};
