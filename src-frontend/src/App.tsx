import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const WS_URL = 'ws://localhost:8000/ws';
const WS_RECONNECT_DELAY = 3000;

export function App() {
  const [view, setView] = useState<View>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const previousTasksRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const fetchTasks = useCallback(async () => {
    try {
      const newTasks = await apiGet<Task[]>('/tasks', { maxRetries: 2, timeout: 8000 });
      newTasks.forEach(task => previousTasksRef.current.set(task.id, task.status));
      setTasks(newTasks);
      setError(null);
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
    fetchTasks();

    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setError(null);
        fetchTasks();
      };

      ws.onmessage = (event) => {
        try {
          const task: Task = JSON.parse(event.data);
          const prevStatus = previousTasksRef.current.get(task.id);
          if (prevStatus && prevStatus !== task.status) {
            if (task.status === 'completed' && task.result) {
              notifyTaskCompleted(task.description);
            } else if (task.status === 'failed' && task.error) {
              notifyTaskError(task.description, task.error);
            }
          }
          previousTasksRef.current.set(task.id, task.status);
          setTasks(prev => {
            const idx = prev.findIndex(t => t.id === task.id);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = task;
              return updated;
            }
            return [task, ...prev];
          });
        } catch {
          // ignore malformed messages
        }
      };

      ws.onerror = () => {
        setError('Connection to backend lost. Reconnecting...');
      };

      ws.onclose = () => {
        reconnectTimer = setTimeout(connect, WS_RECONNECT_DELAY);
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [fetchTasks]);

  const handleTaskSubmit = async (taskDescription: string) => {
    try {
      const newTask = await apiPost<Task>('/tasks', { description: taskDescription }, {
        maxRetries: 1,
        timeout: 8000,
      });
      setTasks(prev => [newTask, ...prev]);
      setError(null);
    } catch (err) {
      setError(formatErrorMessage(err));
    }
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
          onClick={() => setDarkMode(!darkMode)}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          <span>{darkMode ? '☀️' : '🌙'}</span>
        </button>
      </header>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Close error">✕</button>
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
