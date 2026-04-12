/**
 * Input validation and sanitization utilities
 */

/**
 * Validate task description
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateTaskDescription(description: string): ValidationResult {
  // Trim whitespace
  const trimmed = description.trim();

  // Check minimum length
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'Task description cannot be empty',
    };
  }

  // Check maximum length (prevent abuse)
  if (trimmed.length > 5000) {
    return {
      isValid: false,
      error: 'Task description is too long (max 5000 characters)',
    };
  }

  // Check for minimum meaningful length
  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: 'Task description is too short (min 3 characters)',
    };
  }

  return { isValid: true };
}

/**
 * Sanitize input to prevent injection attacks
 * Escapes HTML special characters
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate email (if needed)
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
}

/**
 * Validate URL
 */
export function validateURL(url: string): ValidationResult {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL',
    };
  }
}

/**
 * Get character count with visual feedback
 */
export function getCharacterFeedback(input: string, max: number = 5000): {
  count: number;
  remaining: number;
  percentage: number;
  warning: boolean;
} {
  const count = input.length;
  const remaining = max - count;
  const percentage = (count / max) * 100;
  const warning = percentage > 80;

  return { count, remaining, percentage, warning };
}

/**
 * Validate form before submission
 */
export function validateTaskForm(description: string): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const descriptionValidation = validateTaskDescription(description);
  if (!descriptionValidation.isValid && descriptionValidation.error) {
    errors.description = descriptionValidation.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
