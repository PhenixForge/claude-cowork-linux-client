import React, { useState, useEffect } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { TaskHistory } from './pages/TaskHistory';
import './App.css';

type View = 'dashboard' | 'history';

export function App() {
  const [view, setView] = useState<View>('dashboard');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      const data = await response.json();
      setTasks(data);
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
