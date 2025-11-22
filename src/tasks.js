export class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskListElement = document.getElementById('task-list');
        this.taskInput = document.getElementById('task-input');
        this.addTaskBtn = document.getElementById('add-task-btn');

        this.loadTasks();
        this.initEventListeners();
        this.renderTasks();
    }

    initEventListeners() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (text) {
            const task = {
                id: Date.now(),
                text: text,
                completed: false
            };
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            this.taskInput.value = '';
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('pomodoro-tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('pomodoro-tasks');
        if (saved) {
            this.tasks = JSON.parse(saved);
        }
    }

    renderTasks() {
        this.taskListElement.innerHTML = '';
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const checkbox = document.createElement('div');
            checkbox.className = 'task-checkbox';
            checkbox.addEventListener('click', () => this.toggleTask(task.id));
            if (task.completed) {
                checkbox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            }

            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            this.taskListElement.appendChild(li);
        });
    }
}
