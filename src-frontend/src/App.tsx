import React, { useState, useEffect, useRef } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { TaskHistory } from './pages/TaskHistory';
import {
  requestNotificationPermission,
  notifyTaskCompleted,
  notifyTaskError
} from './utils/notifications';
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
  const previousTasksRef = useRef<Map<string, string>>(new Map());

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
      const response = await fetch('http://localhost:8000/api/tasks');
      if (!response.ok) throw new Error('Failed to load tasks');
      const newTasks = await response.json() as Task[];

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
      setError('Could not connect to backend');
      console.error('Error loading tasks:', err);
    }
  };

  const handleTaskSubmit = async (taskDescription: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: taskDescription })
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      setError(null);
    } catch (err) {
      setError('Could not create task');
      console.error('Error creating task:', err);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>✨ Claude Cowork</h1>
          <p className="subtitle">Automate tasks with AI</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

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
