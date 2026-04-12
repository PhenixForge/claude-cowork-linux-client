/**
 * API Client with error handling and retry logic
 */

const API_BASE_URL = 'http://localhost:8000/api';
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 10000; // 10 seconds

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  timeout?: number;
}

class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Retry with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? MAX_RETRIES;
  const baseDelay = options.baseDelay ?? BASE_DELAY;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on 4xx errors (client errors)
      if (error instanceof APIError && error.status < 500) {
        throw error;
      }

      // Wait before retrying
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new APIError(
        response.status,
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    return response;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to server');
      }
      if (error.message.includes('AbortError')) {
        throw new Error('Request timeout: Server took too long to respond');
      }
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * GET request with retry
 */
export async function apiGet<T>(
  endpoint: string,
  options?: RetryOptions
): Promise<T> {
  return retryWithBackoff(
    async () => {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json() as Promise<T>;
    },
    options
  );
}

/**
 * POST request with retry
 */
export async function apiPost<T>(
  endpoint: string,
  body: unknown,
  options?: RetryOptions
): Promise<T> {
  return retryWithBackoff(
    async () => {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return response.json() as Promise<T>;
    },
    options
  );
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof APIError) {
    // 5xx errors are retryable
    return error.status >= 500;
  }

  if (error instanceof Error) {
    // Network and timeout errors are retryable
    return (
      error.message.includes('Network error') ||
      error.message.includes('timeout') ||
      error.message.includes('Failed to fetch')
    );
  }

  return false;
}
