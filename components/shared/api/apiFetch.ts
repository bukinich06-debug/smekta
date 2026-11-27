interface IApiFetchOptions extends RequestInit {
  body?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiFetch = async <T = unknown>(url: string, options?: IApiFetchOptions): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData.error) errorMessage = errorData.error;
    } catch {
      // empty
    }

    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204) return undefined as T;

  return response.json();
};
