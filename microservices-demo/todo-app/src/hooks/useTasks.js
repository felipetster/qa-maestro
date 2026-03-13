import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = () => {
      const savedTasks = storage.getTasks();
      setTasks(savedTasks);
      setIsLoading(false);
    };
    setTimeout(loadTasks, 300);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      storage.saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  const addTask = (taskData) => {
    const isDuplicate = tasks.some(
      t => t.title.toLowerCase().trim() === taskData.title.toLowerCase().trim()
    );

    if (isDuplicate) {
      return { success: false, error: 'Task already exists' };
    }

    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      status: 'active',
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    setTasks(prev => [newTask, ...prev]);
    return { success: true };
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? {
            ...task,
            status: task.status === 'completed' ? 'active' : 'completed',
            completedAt: task.status === 'completed' ? null : new Date().toISOString()
          }
        : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(task => task.status !== 'completed'));
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'active') return task.status === 'active';
      if (filter === 'completed') return task.status === 'completed';
      return true;
    })
    .filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    clearCompleted
  };
}