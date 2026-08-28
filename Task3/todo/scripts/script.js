// ==================== TODO LIST APP LOGIC ====================
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoList = document.getElementById("todo-list");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Initial Render
renderTodos();

addTodoBtn.addEventListener("click", () => {
    const text = todoInput.value.trim();
    if (text !== "") {
        todos.push({ id: Date.now(), text, completed: false });
        saveAndRender();
        todoInput.value = "";
    }
});

// Allow adding task via 'Enter' key
todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTodoBtn.click();
    }
});

function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = "";
    
    let filteredTodos = todos.filter(todo => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<p style="text-align:center; color:#888; padding:20px;">No tasks available.</p>`;
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement("li");
        li.className = `todo-item ${todo.completed ? "completed" : ""}`;
        
        li.innerHTML = `
            <span>${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button onclick="toggleTodo(${todo.id})" style="background-color: ${todo.completed ? '#f39c12' : '#2ed573'}">
                    ${todo.completed ? 'Undo' : 'Done'}
                </button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveAndRender();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveAndRender();
}

// Filter button toggle logic
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter");
        renderTodos();
    });
});

// Security utility to prevent XSS injection via user task text
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}