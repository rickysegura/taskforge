export default function ProgressBar({ completedTasks, totalTasks, progressPercentage, isDarkMode }) {
    if (totalTasks === 0) return null;
  
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Progress: {completedTasks}/{totalTasks} ({progressPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div
            className={`h-4 rounded-full transition-all duration-300 ${
              isDarkMode ? "bg-teal-500" : "bg-teal-600"
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    );
}
