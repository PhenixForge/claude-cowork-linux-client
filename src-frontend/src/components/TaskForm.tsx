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
      <h3>Create a new task</h3>
      <div className="form-group">
        <label htmlFor="task-input">What would you like Claude to do?</label>
        <textarea
          id="task-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a poem about coding, analyze data, generate ideas..."
          disabled={submitting}
        />
      </div>
      <button type="submit" disabled={submitting || !description.trim()}>
        {submitting ? '⏳ Creating...' : '✨ Send Task'}
      </button>
    </form>
  );
}
