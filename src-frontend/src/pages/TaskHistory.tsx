import React, { useMemo } from 'react';

interface Task {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  result?: string;
}

interface TaskHistoryProps {
  tasks: Task[];
}

export function TaskHistory({ tasks }: TaskHistoryProps) {
  const completedTasks = useMemo(
    () => tasks.filter(t => t.status === 'completed'),
    [tasks]
  );

  return (
    <div className="task-history">
      <h2>Completed Tasks</h2>

      {completedTasks.length === 0 ? (
        <p className="empty-state">📭 No completed tasks yet. Start by creating a task!</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Completed</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {completedTasks.map((task) => (
              <tr key={task.id}>
                <td className="description">{task.description}</td>
                <td className="date">
                  {new Date(task.created_at).toLocaleString('en-US')}
                </td>
                <td className="result" title={task.result}>
                  {task.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
