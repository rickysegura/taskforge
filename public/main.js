document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
  
    // Load tasks from localStorage, or initialize empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    // Render the task list
    function renderTasks() {
      taskList.innerHTML = "";
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "flex items-center gap-2 animate-slideIn";
  
        // Checkbox for completion
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "h-5 w-5 text-teal-600 rounded";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(index));
  
        // Task text
        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = task.completed
          ? "flex-1 line-through text-gray-400 transition-opacity duration-300"
          : "flex-1 text-gray-800";
  
        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "text-red-500 hover:text-red-700 text-sm";
        deleteBtn.addEventListener("click", () => deleteTask(index));
  
        // Assemble the list item
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    }
  
    // Add a new task
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText === "") return;
      tasks.push({ text: taskText, completed: false });
      taskInput.value = "";
      saveAndRender();
    }
  
    // Toggle task completion
    function toggleTask(index) {
      tasks[index].completed = !tasks[index].completed;
      saveAndRender();
    }
  
    // Delete a task
    function deleteTask(index) {
      tasks.splice(index, 1);
      saveAndRender();
    }
  
    // Save to localStorage and re-render
    function saveAndRender() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    }
  
    // Event listeners
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addTask();
    });
  
    // Initial render on page load
    renderTasks();
  });