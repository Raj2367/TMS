export interface ApiError {
  message: string;
  status?: number;
}

export function parseApiError(error: unknown): ApiError {
  // Axios error
  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as any;

    return {
      message: err.response?.data?.message || "API request failed",
      status: err.response?.status,
    };
  }

  // Standard error
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Unexpected error occurred",
  };
}
