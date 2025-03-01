import TaskItem from "./TaskItem";

export default function TaskCategory({
  category,
  tasks,
  priorityColors,
  categoryColors,
  isDarkMode,
  toggleTask,
  deleteTask,
  startEditing,
  editingTaskId,
  editText,
  setEditText,
  editPriority,
  setEditPriority,
  editCategory,
  setEditCategory,
  saveEdit,
  cancelEdit,
  priorityOptions,
  categoryOptions,
}) {
  if (tasks.length === 0) return null;

  return (
    <div>
      <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${categoryColors[category]}`}>
        {category}
      </h2>
      <ul className="space-y-6">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            priorityColors={priorityColors}
            isDarkMode={isDarkMode}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            startEditing={startEditing}
            editingTaskId={editingTaskId}
            editText={editText}
            setEditText={setEditText}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
            editCategory={editCategory}
            setEditCategory={setEditCategory}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            priorityOptions={priorityOptions}
            categoryOptions={categoryOptions}
          />
        ))}
      </ul>
    </div>
  );
}
