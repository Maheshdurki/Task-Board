import { format, isPast, isToday } from 'date-fns';

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const validateTask = (task) => {
    const errors = {};
    if (!task.title || task.title.trim() === '') {
        errors.title = 'Title is required';
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, 'MMM d, yyyy');
};
