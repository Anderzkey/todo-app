// Global tasks array
let tasks = [];

// DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');

/**
 * Load tasks from LocalStorage on page load
 */
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
  renderTasks();
}

/**
 * Save current tasks array to LocalStorage
 */
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Add a new task
 * @param {string} text - Task description
 */
function addTask(text) {
  // Trim whitespace and check if text is not empty
  const trimmedText = text.trim();
  if (!trimmedText) {
    return;
  }

  // Create new task object
  const newTask = {
    id: Date.now(),
    text: trimmedText,
    completed: false
  };

  // Add to tasks array
  tasks.push(newTask);

  // Save and re-render
  saveTasks();
  renderTasks();

  // Clear input field
  taskInput.value = '';
}

/**
 * Delete a task by ID
 * @param {number} id - Task ID
 */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

/**
 * Toggle task completed status
 * @param {number} id - Task ID
 */
function toggleTask(id) {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

/**
 * Render all tasks to the DOM
 */
function renderTasks() {
  // Clear task list
  taskList.innerHTML = '';

  // Show/hide empty state
  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  // Render each task
  tasks.forEach(task => {
    // Create task item container
    const li = document.createElement('li');
    li.className = 'task-item flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100';

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Create task text
    const taskText = document.createElement('span');
    taskText.className = `flex-1 text-gray-700 ${task.completed ? 'task-completed' : ''}`;
    taskText.textContent = task.text;

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn text-red-500 hover:text-red-700 font-bold px-2';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Append elements to task item
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);

    // Append task item to list
    taskList.appendChild(li);
  });
}

/**
 * Handle add task button click
 */
function handleAddTask() {
  addTask(taskInput.value);
}

/**
 * Handle Enter key press in input field
 * @param {KeyboardEvent} event
 */
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    addTask(taskInput.value);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Load tasks from LocalStorage
  loadTasks();

  // Attach event listeners
  addTaskBtn.addEventListener('click', handleAddTask);
  taskInput.addEventListener('keypress', handleKeyPress);
});
