// Categories configuration
const CATEGORIES = [
  { id: 'uncategorized', label: 'Uncategorized', color: 'gray' },
  { id: 'work', label: 'Work', color: 'blue' },
  { id: 'personal', label: 'Personal', color: 'green' },
  { id: 'shopping', label: 'Shopping', color: 'purple' },
  { id: 'health', label: 'Health', color: 'red' }
];

// Global tasks array
let tasks = [];

// Global filter state
let currentFilter = 'all';

// DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const categorySelect = document.getElementById('category-select');
const dateInput = document.getElementById('date-input');

/**
 * Load tasks from LocalStorage on page load
 */
function loadTasks() {
  try {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];

    // Migrate old tasks to include new fields
    tasks = tasks.map(task => ({
      ...task,
      category: task.category || 'uncategorized',
      dueDate: task.dueDate || null,
      createdAt: task.createdAt || Date.now()
    }));

    if (tasks.length > 0) {
      saveTasks();
    }

    // Restore filter state from localStorage
    const storedFilter = localStorage.getItem('currentFilter');
    if (storedFilter) {
      currentFilter = storedFilter;
    }
  } catch (e) {
    console.error('Failed to load tasks from LocalStorage:', e);
    tasks = [];
  }
  renderTasks();
  updateFilterButtons();
}

/**
 * Save current tasks array to LocalStorage
 */
function saveTasks() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to LocalStorage:', e);
    alert('Unable to save tasks. Your storage may be full.');
  }
}

/**
 * Add a new task
 * @param {string} text - Task description
 * @param {string} category - Task category
 * @param {string} dueDate - Due date in YYYY-MM-DD format
 */
function addTask(text, category = 'uncategorized', dueDate = null) {
  // Trim whitespace and check if text is not empty
  const trimmedText = text.trim();
  if (!trimmedText) {
    return;
  }

  // Create new task object with unique ID
  const newTask = {
    id: Date.now() + Math.random(),
    text: trimmedText,
    completed: false,
    category: category || 'uncategorized',
    dueDate: dueDate || null,
    createdAt: Date.now()
  };

  // Add to tasks array
  tasks.push(newTask);

  // Save and re-render
  saveTasks();
  renderTasks();

  // Clear input fields
  taskInput.value = '';
  categorySelect.value = 'uncategorized';
  dateInput.value = '';
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
 * Get category object by ID
 * @param {string} categoryId - Category ID
 * @returns {object} Category object
 */
function getCategoryById(categoryId) {
  return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[0];
}

/**
 * Get date status for visual indicators
 * @param {string} dueDate - Due date in YYYY-MM-DD format
 * @param {boolean} completed - Task completion status
 * @returns {string} Status: 'none', 'overdue', 'today', or 'future'
 */
function getDateStatus(dueDate, completed) {
  if (!dueDate || completed) return 'none';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse date as local timezone by splitting the string
  const [year, month, day] = dueDate.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  due.setHours(0, 0, 0, 0);

  if (due < today) return 'overdue';
  if (due.getTime() === today.getTime()) return 'today';
  return 'future';
}

/**
 * Format date for display
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateStr) {
  if (!dateStr) return '';

  // Parse date as local timezone by splitting the string
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);

  if (dateOnly.getTime() === today.getTime()) {
    return 'Today';
  }

  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Get filtered tasks based on current filter
 * @returns {Array} Filtered tasks
 */
function getFilteredTasks() {
  if (currentFilter === 'all') {
    return tasks;
  }
  return tasks.filter(task => task.category === currentFilter);
}

/**
 * Set the current category filter
 * @param {string} categoryId - Category ID to filter by
 */
function setFilter(categoryId) {
  currentFilter = categoryId;
  try {
    localStorage.setItem('currentFilter', categoryId);
  } catch (e) {
    console.error('Failed to save filter state:', e);
  }
  renderTasks();
  updateFilterButtons();
}

/**
 * Update filter button visual states
 */
function updateFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    const category = btn.dataset.category;
    if (category === currentFilter) {
      btn.classList.remove('bg-gray-200', 'text-gray-700');
      btn.classList.add('bg-blue-500', 'text-white');
    } else {
      btn.classList.remove('bg-blue-500', 'text-white');
      btn.classList.add('bg-gray-200', 'text-gray-700');
    }
  });
}

/**
 * Sort tasks by completion status and due date
 * @param {Array} tasksToSort - Tasks array to sort
 * @returns {Array} Sorted tasks
 */
function sortTasksByDate(tasksToSort) {
  return [...tasksToSort].sort((a, b) => {
    // Incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then by due date (earliest first)
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    // Parse dates as local timezone for consistent comparison
    const [yearA, monthA, dayA] = a.dueDate.split('-').map(Number);
    const [yearB, monthB, dayB] = b.dueDate.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);

    return dateA - dateB;
  });
}

/**
 * Render all tasks to the DOM
 */
function renderTasks() {
  // Clear task list
  taskList.innerHTML = '';

  const filteredTasks = getFilteredTasks();
  const sortedTasks = sortTasksByDate(filteredTasks);

  // Show/hide empty state
  if (sortedTasks.length === 0) {
    emptyState.classList.remove('hidden');
    emptyState.textContent = currentFilter === 'all'
      ? 'No tasks yet. Add one above!'
      : `No tasks in ${getCategoryById(currentFilter).label} category.`;
    return;
  }
  emptyState.classList.add('hidden');

  // Render each task
  sortedTasks.forEach(task => {
    // Create task item container
    const li = document.createElement('li');

    // Add date status border
    const dateStatus = getDateStatus(task.dueDate, task.completed);
    let borderClass = '';
    if (dateStatus === 'overdue') {
      borderClass = 'border-l-4 border-red-500';
    } else if (dateStatus === 'today') {
      borderClass = 'border-l-4 border-yellow-500';
    }

    li.className = `task-item flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 ${borderClass}`;

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

    // Create category badge
    const category = getCategoryById(task.category);
    const categoryBadge = document.createElement('span');
    categoryBadge.className = `text-xs px-2 py-1 rounded bg-${category.color}-100 text-${category.color}-700`;
    categoryBadge.textContent = category.label;

    // Create date display
    const dateContainer = document.createElement('span');
    if (task.dueDate) {
      const dateText = formatDate(task.dueDate);
      let dateClass = 'text-xs text-gray-500';
      if (dateStatus === 'overdue') {
        dateClass = 'text-xs text-red-600 font-semibold';
      } else if (dateStatus === 'today') {
        dateClass = 'text-xs text-yellow-600 font-semibold';
      }
      dateContainer.className = dateClass;
      dateContainer.textContent = `📅 ${dateText}`;
    }

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn text-red-500 hover:text-red-700 font-bold px-2';
    deleteBtn.textContent = '✕';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Append elements to task item
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(categoryBadge);
    if (task.dueDate) {
      li.appendChild(dateContainer);
    }
    li.appendChild(deleteBtn);

    // Append task item to list
    taskList.appendChild(li);
  });
}

/**
 * Handle add task button click
 */
function handleAddTask() {
  const text = taskInput.value;
  const category = categorySelect.value;
  const dueDate = dateInput.value;
  addTask(text, category, dueDate);
}

/**
 * Handle Enter key press in input field
 * @param {KeyboardEvent} event
 */
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    handleAddTask();
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Load tasks from LocalStorage
  loadTasks();

  // Attach event listeners
  addTaskBtn.addEventListener('click', handleAddTask);
  taskInput.addEventListener('keypress', handleKeyPress);

  // Attach filter button listeners
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.category);
    });
  });
});
