import React, { useState } from 'react';

interface TaskFormProps {
  onSubmit: (description: string) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    await onSubmit(description);
    setDescription('');
    setSubmitting(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="task-input">New Task</label>
        <textarea
          id="task-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you want Claude to do..."
          rows={4}
          disabled={submitting}
        />
      </div>
      <button type="submit" disabled={submitting || !description.trim()}>
        {submitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
