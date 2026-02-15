                                                               Task Board Application
A functional Kanban-style Task Board application built with React, Vite, and Vanilla CSS. This project focuses on frontend engineering quality, state management, and a premium user experience.

                                                                   Features
Authentication: Static login with hardcoded credentials (intern@demo.com / intern123).
Task Management: Create, Read, Update, Delete (CRUD) tasks.
Drag & Drop: Smooth drag-and-drop interface for moving tasks between columns (Todo, Doing, Done).
Filtering & Sorting: Search tasks by title, filter by priority, and sort by due date.
Persistence: Data and authentication state persists across reloads using localStorage.
Activity Log: Tracks user actions (creation, movement, deletion).
Responsive Design: Fully responsive layout with a glassmorphism aesthetic.
                                                                    Tech Stack
Framework: React + Vite
Styling: Vanilla CSS (Global variables, Glassmorphism, CSS Transitions)
State Management: React Context API (AuthContext, TaskContext)
Drag & Drop: @hello-pangea/dnd
Icons: lucide-react
Date Handling: date-fns
Testing: Vitest
                                                                     Setup Instructions
Clone the repository (if applicable) or unzip the source code.
Navigate to the project directory:
cd task-board
                                                                   Install dependencies:
npm install
Run the development server:
npm run dev
Run tests:
npm run test
Build for production:
npm run build
                                                                            Usage
Login: Use intern@demo.com and intern123.
Create Task: Click "New Task" to open the modal.
Move Task: Drag a card to another column.
Edit/Delete: Hover over a card to see actions.
Reset: Click "Reset" to clear the board.
