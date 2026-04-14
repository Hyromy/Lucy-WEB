import axios, { type AxiosRequestConfig } from "axios"

export class ApiError extends Error {
  readonly source = "api"
  readonly originalError: unknown

  constructor(message: string, originalError?: unknown) {
    super(message)
    this.name = "ApiError"
    this.originalError = originalError
  }
}

const client = axios.create({
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  headers: {
    "Content-Type": "application/json",
  },
})

client.interceptors.response.use(
  (response) => response.data,
  (error: unknown) => {
    const fallbackMessage = "An unknown error occurred while making the API request."

    if (axios.isAxiosError<{ message?: string }>(error)) {
      const message = error.response?.data?.message || fallbackMessage
      return Promise.reject(new ApiError(message, error))
    }

    if (error instanceof Error) {
      return Promise.reject(new ApiError(error.message, error))
    }

    return Promise.reject(new ApiError(fallbackMessage, error))
  }
)

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    client.get<T>(url, config) as unknown as Promise<T>,

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    client.post<T>(url, data, config) as unknown as Promise<T>,
  
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    client.put<T>(url, data, config) as unknown as Promise<T>,
  
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    client.patch<T>(url, data, config) as unknown as Promise<T>,
  
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    client.delete<T>(url, config) as unknown as Promise<T>,
}
