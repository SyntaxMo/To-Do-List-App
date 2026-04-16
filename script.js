document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const todoContainer = document.querySelector('.todos-container');
    const emptyImage = document.querySelector('.empty-image');

    const progress = document.getElementById('progress');
    const numbers = document.getElementById('numbers');

    let hasCelebrated = false;

    const updateStats = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        numbers.textContent = `${completedTasks}/${totalTasks}`;

        const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        progress.style.width = `${progressPercent}%`;

        const allCompleted = totalTasks > 0 && completedTasks === totalTasks;

        if (allCompleted && !hasCelebrated) {
            Confetti();
            hasCelebrated = true;
        }

        if (!allCompleted) {
            hasCelebrated = false;
        }
    };

    const toggleEmptyState = () => {
        if (emptyImage) {
            emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        }

        todoContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed));
        toggleEmptyState();
        updateStats();
    };

    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();

        if (!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn" type="button">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn" type="button">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        const taskSpan = li.querySelector('span');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateStats();
            saveTaskToLocalStorage();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = taskSpan.textContent;
                li.remove();
                toggleEmptyState();
                updateStats();
                saveTaskToLocalStorage();
            }
        });

        deleteBtn.addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateStats();
            saveTaskToLocalStorage();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateStats();
        saveTaskToLocalStorage();
    };

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTasksFromLocalStorage();
});


const Confetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};