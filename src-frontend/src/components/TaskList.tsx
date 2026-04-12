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
      case 'pending': return '#ffa500';
      case 'running': return '#0066ff';
      case 'completed': return '#00cc00';
      case 'failed': return '#ff0000';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'running': return 'Running';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
    }
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Active Tasks</h2>
        <button onClick={onRefresh} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Create one to get started!</p>
      ) : (
        <div className="tasks">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.description.substring(0, 50)}...</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>
              <p className="task-time">
                Created: {new Date(task.created_at).toLocaleString('en-US')}
              </p>
              {task.result && (
                <div className="task-result">
                  <strong>Result:</strong>
                  <p>{task.result.substring(0, 200)}...</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
