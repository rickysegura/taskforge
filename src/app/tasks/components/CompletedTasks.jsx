import TaskItem from "./TaskItem";

export default function CompletedTasks({
  tasks,
  priorityColors,
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
  const completedTasks = tasks.filter((task) => task.completed);

  if (completedTasks.length === 0) return null;

  return (
    <div className="mt-6">
      <h2
        className={`text-lg sm:text-xl font-semibold mb-2 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Completed Tasks
      </h2>
      <ul className="space-y-6">
        {completedTasks.map((task) => (
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
