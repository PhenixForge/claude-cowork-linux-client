import React from 'react';

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  result?: string;
}

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onRefresh: () => void;
}

export function TaskList({ tasks, loading, onRefresh }: TaskListProps) {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return '#999999';
      case 'running': return '#8B7355';
      case 'completed': return '#7A9B8E';
      case 'failed': return '#9B6B6B';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'Queued';
      case 'running': return 'Processing';
      case 'completed': return 'Done';
      case 'failed': return 'Error';
    }
  };

  const activeTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Your Tasks</h2>
      </div>

      {activeTasks.length === 0 ? (
        <p className="empty-state">✨ All caught up! Create a task to get started.</p>
      ) : (
        <div className="tasks">
          {activeTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div>
                  <h3>{task.description}</h3>
                  <p className="task-time">
                    {new Date(task.created_at).toLocaleString('en-US')}
                  </p>
                </div>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>
              {task.result && (
                <div className="task-result">
                  <strong>✓ Result</strong>
                  <p>{task.result}</p>
                </div>
              )}
              {task.error && (
                <div className="task-result" style={{ borderLeftColor: '#9B6B6B', background: '#F5EDED' }}>
                  <strong style={{ color: '#9B6B6B' }}>✕ Error</strong>
                  <p>{task.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
