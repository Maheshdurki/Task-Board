import { describe, it, expect } from 'vitest';
import { validateEmail, validateTask, formatDateForDisplay } from './helpers';

describe('Helper Functions', () => {

    describe('validateEmail', () => {
        it('should return true for valid emails', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('intern@demo.com')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('test@')).toBe(false);
            expect(validateEmail('')).toBe(false);
        });
    });

    describe('validateTask', () => {
        it('should be valid when title is present', () => {
            const task = { title: 'New Task', description: 'desc' };
            const result = validateTask(task);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual({});
        });

        it('should be invalid when title is missing', () => {
            const task = { title: '', description: 'desc' };
            const result = validateTask(task);
            expect(result.isValid).toBe(false);
            expect(result.errors.title).toBeDefined();
        });
    });

    describe('formatDateForDisplay', () => {
        it('should format date correctly', () => {
            // Mocking a fixed date might be tricky with locals, but 'MMM d, yyyy' is standard enough
            const date = '2023-10-25T10:00:00Z';
            // Note: verify timezones don't break this too much for simple string check
            // Or just check format structure
            const formatted = formatDateForDisplay(date);
            expect(formatted).toBe('Oct 25, 2023');
        });

        it('should return empty string for null date', () => {
            expect(formatDateForDisplay(null)).toBe('');
        });
    });

});
