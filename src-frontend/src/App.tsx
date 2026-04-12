import React, { useState, useEffect, useRef } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { TaskHistory } from './pages/TaskHistory';
import {
  requestNotificationPermission,
  notifyTaskCompleted,
  notifyTaskError
} from './utils/notifications';
import { apiGet, apiPost, formatErrorMessage } from './utils/api';
import './App.css';

type View = 'dashboard' | 'history';

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
  error?: string;
  created_at: string;
}

export function App() {
  const [view, setView] = useState<View>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const previousTasksRef = useRef<Map<string, string>>(new Map());

  // Apply dark mode to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    // Request notification permission on mount
    requestNotificationPermission();

    // Initial fetch
    fetchTasks();

    // Auto-refresh every 2 seconds
    const interval = setInterval(fetchTasks, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const newTasks = await apiGet<Task[]>('/tasks', {
        maxRetries: 2,
        timeout: 8000,
      });

      // Check for status changes and send notifications
      newTasks.forEach(task => {
        const previousStatus = previousTasksRef.current.get(task.id);

        if (previousStatus && previousStatus !== task.status) {
          if (task.status === 'completed' && task.result) {
            notifyTaskCompleted(task.description);
          } else if (task.status === 'failed' && task.error) {
            notifyTaskError(task.description, task.error);
          }
        }

        // Update previous status
        previousTasksRef.current.set(task.id, task.status);
      });

      setTasks(newTasks);
      setError(null);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error('Error loading tasks:', err);
    }
  };

  const handleTaskSubmit = async (taskDescription: string) => {
    try {
      const newTask = await apiPost<Task>('/tasks', { description: taskDescription }, {
        maxRetries: 1,
        timeout: 8000,
      });
      setTasks([newTask, ...tasks]);
      setError(null);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error('Error creating task:', err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>✨ Claude Cowork</h1>
          <p className="subtitle">Automate tasks with AI</p>
        </div>
        <button
          className="dark-mode-toggle"
          onClick={toggleDarkMode}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          <span>{darkMode ? '☀️' : '🌙'}</span>
        </button>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Close error">
            ✕
          </button>
        </div>
      )}

      <main className="main">
        <div className="container">
          {view === 'dashboard' && (
            <>
              <TaskForm onSubmit={handleTaskSubmit} />
              <TaskList tasks={tasks} onRefresh={fetchTasks} />
            </>
          )}
          {view === 'history' && (
            <TaskHistory tasks={tasks} />
          )}
        </div>
      </main>

      <footer className="footer">
        <nav className="footer-nav">
          <button
            className={view === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setView('dashboard')}
          >
            Active Tasks
          </button>
          <button
            className={view === 'history' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setView('history')}
          >
            Completed
          </button>
        </nav>
      </footer>
    </div>
  );
}
