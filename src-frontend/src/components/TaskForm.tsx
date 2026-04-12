import React, { useState } from 'react';
import { validateTaskDescription, getCharacterFeedback } from '../utils/validation';

interface TaskFormProps {
  onSubmit: (description: string) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const feedback = getCharacterFeedback(description);
  const isValid = description.trim().length >= 3;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescription(value);

    // Clear error when user starts typing
    if (error && value.length > 0) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validation = validateTaskDescription(description);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(description.trim());
      setDescription('');
    } catch (err) {
      // Error is handled in App.tsx
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>Create a new task</h3>
      <div className="form-group">
        <label htmlFor="task-input">What would you like Claude to do?</label>
        <textarea
          id="task-input"
          value={description}
          onChange={handleChange}
          placeholder="Write a poem about coding, analyze data, generate ideas..."
          disabled={submitting}
          maxLength={5000}
          aria-describedby="char-count"
        />
        <div className="form-meta">
          <div
            id="char-count"
            className={`char-count ${feedback.warning ? 'warning' : ''}`}
          >
            {feedback.count} / 5000 characters
          </div>
        </div>
      </div>

      {error && <div className="form-error">⚠️ {error}</div>}

      <button type="submit" disabled={submitting || !isValid}>
        {submitting ? '⏳ Creating...' : '✨ Send Task'}
      </button>
    </form>
  );
}
