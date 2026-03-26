import React, { createContext, useContext, useEffect, useState } from 'react';
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from storage
  useEffect(() => {
    async function loadTasks() {
      try {
        const storedTasks = await localforage.getItem('student-planner-tasks');
        if (storedTasks) {
          setTasks(storedTasks);
        }
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  // Save to storage on update
  useEffect(() => {
    if (!loading) {
      localforage.setItem('student-planner-tasks', tasks).catch(console.error);
    }
  }, [tasks, loading]);

  const addTask = (taskData) => {
    const newTask = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...taskData, // expecting title, subject, deadline (ISO string)
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' };
      }
      return t;
    }));
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, progress };
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      getStats
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
