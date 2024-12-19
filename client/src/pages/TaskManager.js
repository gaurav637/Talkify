import React, { useState } from 'react';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");

    const addTask = () => {
        if (taskInput.trim()) {
            setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
            setTaskInput("");
        }
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
        <div className="p-4 bg-gray-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Add a new task"
                    className="p-2 rounded bg-gray-800 text-white w-full"
                />
                <button
                    onClick={addTask}
                    className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Add Task
                </button>
            </div>
            <ul className="space-y-2">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <span
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`flex-1 cursor-pointer ${task.completed ? 'line-through text-gray-500' : ''}`}
                        >
                            {task.text}
                        </span>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;
