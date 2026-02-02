# Plan: Simple To-Do App

**Goal:** Build a simple, functional to-do app with vanilla JavaScript, LocalStorage persistence, and Tailwind CSS styling.

**Location:** `/Users/andrejzadoroznyj/Downloads/Go_practice/Cursor + CC/To-Do App. CC/.worktrees/feature-todo-app/`

---

## Requirements

✅ **Core Features:**
- Display a list of tasks
- Each task has a checkbox and description
- Add new tasks (input field + button)
- Mark tasks as complete (checkbox)
- Delete tasks (delete button)
- Data persists across page refreshes (LocalStorage)

✅ **Technical Decisions:**
- **Stack:** Vanilla JavaScript (HTML/CSS/JS)
- **Storage:** LocalStorage (persists in browser)
- **Styling:** Tailwind CSS (CDN version, no build step)

---

## Implementation Plan

### Phase 1: Project Structure

Create three files in the worktree:

```
.worktrees/feature-todo-app/
├── index.html     # Main HTML structure
├── styles.css     # Custom CSS (minimal, mostly Tailwind)
└── app.js         # JavaScript logic
```

### Phase 2: HTML Structure (index.html)

**Components needed:**
1. **Page container** - Center content, max-width
2. **Header** - App title
3. **Input section** - Text input + "Add Task" button
4. **Task list container** - `<ul>` to hold task items
5. **Task item template** - Checkbox, description text, delete button

**Tailwind CDN:**
- Include via `<script src="https://cdn.tailwindcss.com"></script>` in `<head>`
- No build configuration needed

**Structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>To-Do App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-gray-100 min-h-screen py-8">
  <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
    <!-- App content here -->
  </div>
  <script src="app.js"></script>
</body>
</html>
```

### Phase 3: CSS (styles.css)

**Minimal custom CSS:**
- Checkbox styling (make it larger, more visible)
- Completed task styling (strikethrough text)
- Smooth transitions for delete/complete actions

**Example:**
```css
.task-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.task-completed {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-item {
  transition: opacity 0.2s ease-out;
}
```

### Phase 4: JavaScript Logic (app.js)

**Data Structure:**
```javascript
// Task object
{
  id: timestamp,           // Unique ID
  text: "Task description",
  completed: false
}

// Array stored in LocalStorage
tasks = [task1, task2, task3, ...]
```

**Core Functions:**

1. **`loadTasks()`** - Load tasks from LocalStorage on page load
   - `JSON.parse(localStorage.getItem('tasks'))` or `[]`
   - Call `renderTasks()` to display

2. **`saveTasks()`** - Save current tasks array to LocalStorage
   - `localStorage.setItem('tasks', JSON.stringify(tasks))`

3. **`addTask(text)`** - Add new task
   - Create task object with unique ID (`Date.now()`)
   - Push to tasks array
   - Call `saveTasks()` and `renderTasks()`

4. **`deleteTask(id)`** - Remove task by ID
   - Filter tasks array to exclude task with matching ID
   - Call `saveTasks()` and `renderTasks()`

5. **`toggleTask(id)`** - Toggle completed status
   - Find task by ID
   - Flip `completed` boolean
   - Call `saveTasks()` and `renderTasks()`

6. **`renderTasks()`** - Render all tasks to DOM
   - Clear task list container
   - Loop through tasks array
   - Create DOM elements for each task
   - Attach event listeners (checkbox, delete button)

**Event Listeners:**
- "Add Task" button click → `addTask(inputValue)`
- Task checkbox change → `toggleTask(taskId)`
- Delete button click → `deleteTask(taskId)`
- Enter key in input → `addTask(inputValue)`

**Initialization:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  // Attach event listeners to input/button
});
```

### Phase 5: UI Design

**Layout (Tailwind classes):**

**Header:**
- Large title: `text-3xl font-bold text-gray-800 mb-6`

**Input Section:**
- Flex container: `flex gap-2 mb-6`
- Input: `flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`
- Button: `px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600`

**Task List:**
- Container: `space-y-2`
- Task item: `flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100`
- Checkbox: `task-checkbox`
- Text: `flex-1 text-gray-700` (add `.task-completed` when done)
- Delete button: `text-red-500 hover:text-red-700 font-bold`

**Empty State:**
- Show message when no tasks: "No tasks yet. Add one above!"

---

## File Summary

### index.html (~50 lines)
- DOCTYPE, head with Tailwind CDN
- Body with centered container
- Header (title)
- Input + button
- `<ul id="task-list">` (empty, populated by JS)
- Script tag for app.js

### styles.css (~20 lines)
- Checkbox sizing
- Completed task styling
- Smooth transitions

### app.js (~150 lines)
- Global `tasks` array
- 6 core functions (load, save, add, delete, toggle, render)
- Event listeners
- DOMContentLoaded initialization

---

## Verification Steps

After implementation, test:

1. ✅ **Add Task** - Enter text, click "Add Task", task appears in list
2. ✅ **Complete Task** - Click checkbox, text gets strikethrough
3. ✅ **Delete Task** - Click delete button, task disappears
4. ✅ **Persistence** - Refresh page, tasks remain
5. ✅ **Empty Input** - Try adding empty task, should prevent/ignore
6. ✅ **Multiple Tasks** - Add 5+ tasks, all work independently
7. ✅ **LocalStorage** - Open DevTools → Application → LocalStorage → verify `tasks` key

---

## Future Enhancements (Not in MVP)

These are intentionally excluded from the simple version:
- Edit task text
- Filter (All/Active/Completed)
- Clear completed tasks
- Task priority/due dates
- Drag-and-drop reordering
- Categories/tags
- Dark mode

---

## Critical Files

**To be created:**
- `.worktrees/feature-todo-app/index.html`
- `.worktrees/feature-todo-app/styles.css`
- `.worktrees/feature-todo-app/app.js`

**No build tools or package.json needed** - this is pure HTML/CSS/JS served directly.
