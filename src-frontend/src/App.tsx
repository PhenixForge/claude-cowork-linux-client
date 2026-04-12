import React, { useState, useEffect } from 'react';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { TaskHistory } from './pages/TaskHistory';
import './App.css';

type View = 'dashboard' | 'history';

export function App() {
  const [view, setView] = useState<View>('dashboard');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial fetch
    fetchTasks();

    // Auto-refresh every 2 seconds when on dashboard
    const interval = setInterval(() => {
      if (view === 'dashboard') {
        fetchTasks();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [view]);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleTaskSubmit = async (taskDescription: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: taskDescription })
      });
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Claude Cowork</h1>
        <nav className="nav">
          <button
            className={view === 'dashboard' ? 'active' : ''}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={view === 'history' ? 'active' : ''}
            onClick={() => setView('history')}
          >
            History
          </button>
        </nav>
      </header>

      <main className="main">
        {view === 'dashboard' && (
          <>
            <TaskForm onSubmit={handleTaskSubmit} />
            <TaskList tasks={tasks} loading={loading} onRefresh={fetchTasks} />
          </>
        )}
        {view === 'history' && (
          <TaskHistory tasks={tasks} />
        )}
      </main>
    </div>
  );
}
