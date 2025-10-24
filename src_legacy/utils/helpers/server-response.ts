interface ServerResponse {
  status: number;
  message: string;
}

export const getServerResponseMessage = (status: number): ServerResponse => {
  const responses: { [key: number]: string } = {
    400: "Bad request. Please check your input and try again.",
    401: "Unauthorized. Please log in and try again.",
    403: "Forbidden. You don't have permission to perform this action.",
    404: "Resource not found. Please check your request and try again.",
    408: "Request timeout. Please try again.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Internal server error. Please try again later.",
    502: "Bad gateway. Please try again later.",
    503: "Service unavailable. Please try again later.",
    504: "Gateway timeout. Please try again later.",
  };

  return {
    status,
    message: responses[status] || "An unexpected error occurred. Please try again later.",
  };
};
