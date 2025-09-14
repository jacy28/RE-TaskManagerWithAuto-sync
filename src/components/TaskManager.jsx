import { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useTheme } from "../context/ThemeContext";

const TaskManager = () => {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [taskInput, setTaskInput] = useState("");
  const { theme, toggleTheme } = useTheme();

  // Add Task
  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: taskInput, time: 0 }]);
    setTaskInput("");
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Edit Task
  const editTask = (id, newText) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text: newText } : task)));
  };

  // Timer for each task
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => ({ ...task, time: task.time + 1 }))
      );
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
      <div className="container mx-auto p-4">
        <button
          onClick={toggleTheme}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Toggle Theme
        </button>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-2 border rounded"
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Enter task"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Add
          </button>
        </div>

        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              <div>
                <input
                  className="bg-transparent border-b border-gray-400 dark:border-gray-300 focus:outline-none"
                  value={task.text}
                  onChange={(e) => editTask(task.id, e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Time: {task.time}s
                </p>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskManager;