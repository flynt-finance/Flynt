"use client";

import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getToken } from "@/lib/auth-cookie";
import type {
  ApiResponse,
  CustomFetchConfig,
  CustomFetchQueryOptions,
  CustomFetchMutationOptions,
} from "./types";

const getBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_API_URL ?? "";

/** API error shape: success false + error with message, optional code and details */
interface ApiErrorResponse {
  success?: boolean;
  error?: {
    message?: string;
    code?: string;
    details?: string[];
  };
}

interface ErrorWithResponse {
  response?: {
    data?: ApiErrorResponse & { errors?: unknown; message?: unknown };
    message?: string;
  };
  message?: string;
}

export interface ProcessedError {
  title: string;
  message: string;
}

const processNonStrings = (obj: unknown): string => {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return String(obj ?? "");
  }
  const record = obj as Record<string, unknown>;
  return Object.entries(record)
    .map(([key, value]) => {
      let val = `${key}: `;
      if (Array.isArray(value)) {
        val += value.join(", ");
      } else {
        val += String(value ?? "");
      }
      return val;
    })
    .join("\n");
};

const cleanMessage = (s: string): string =>
  s.startsWith("Error: ") ? s.substring(7) : s;

export function processError(err: unknown): ProcessedError {
  const e = err as ErrorWithResponse;
  const data = e?.response?.data as (ApiErrorResponse & { errors?: unknown; message?: unknown }) | undefined;

  if (data?.error && typeof data.error === "object") {
    const errorObj = data.error;
    const title = errorObj.message ?? "Validation failed";
    const details = errorObj.details;
    const message =
      Array.isArray(details) && details.length > 0
        ? details.join(". ")
        : title;
    return { title: cleanMessage(title), message: cleanMessage(message) };
  }

  let message: string;
  if (typeof err === "string") {
    message = err;
  } else if (data?.errors !== undefined) {
    const errors = data.errors;
    if (
      errors !== null &&
      typeof errors === "object" &&
      !Array.isArray(errors)
    ) {
      message = processNonStrings(errors);
    } else {
      message = String(errors ?? "Validation errors occurred");
    }
  } else if (data?.message !== undefined) {
    const dataMessage = data.message;
    if (
      dataMessage !== null &&
      typeof dataMessage === "object" &&
      !Array.isArray(dataMessage)
    ) {
      message = processNonStrings(dataMessage);
    } else {
      message = String(dataMessage ?? "An unexpected error occurred");
    }
  } else if (e?.response?.message) {
    message = e.response.message;
  } else if (err instanceof Error && err.message) {
    message = err.message;
  } else {
    message = "An unexpected error occurred";
  }

  message = cleanMessage(message);
  return { title: "Error", message };
}

export function showErrorToast(
  err: unknown,
  fallback: { title: string; message: string }
): void {
  const { title, message } = processError(err);
  toast.error(title || fallback.title, {
    description: message || fallback.message,
  });
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  timeout: 300000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          showErrorToast(error, {
            title: "Unauthorized",
            message: "Please sign in again.",
          });
          break;
        case 403:
          showErrorToast(error, { title: "Access Denied", message: "You do not have permission." });
          break;
        case 404:
          showErrorToast(error, { title: "Not Found", message: "The requested resource was not found." });
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          showErrorToast(error, {
            title: "Server Error",
            message: "Please try again later.",
          });
          break;
        default:
          showErrorToast(error, { title: "Error", message: "Something went wrong." });
          break;
      }
    } else if (error.request) {
      toast.error("Network Error", { description: "Please check your connection and try again." });
    }
    return Promise.reject(error);
  }
);

export async function customFetch<T = unknown>(
  url: string,
  options: CustomFetchConfig = {}
): Promise<T> {
  const config: CustomFetchConfig = {
    ...options,
    headers: { ...options.headers },
  };
  const method = (config.method ?? "get").toLowerCase();
  switch (method) {
    case "get":
      return (await axiosInstance.get<T>(url, config)).data;
    case "post":
      return (await axiosInstance.post<T>(url, config.body, config)).data;
    case "patch":
      return (await axiosInstance.patch<T>(url, config.body, config)).data;
    case "put":
      return (await axiosInstance.put<T>(url, config.body, config)).data;
    case "delete":
      return (await axiosInstance.delete<T>(url, config)).data;
    default:
      return (await axiosInstance.request<T>({ ...config, url })).data;
  }
}

export function useCustomFetchQuery<T = unknown>(
  url: string | (() => string),
  options: CustomFetchQueryOptions = {}
) {
  const baseUrl = getBaseUrl();
  const queryKey =
    typeof options.queryKey === "function"
      ? options.queryKey()
      : options.queryKey ?? (typeof url === "function" ? [] : [url]);
  const enabled =
    typeof options.enabled === "function"
      ? options.enabled()
      : options.enabled ?? true;

  return useQuery({
    queryKey,
    queryFn: async (): Promise<ApiResponse<T>> => {
      const currentUrl = typeof url === "function" ? url() : url;
      try {
        const fullUrl = `${baseUrl}${currentUrl}`;
        const config = { ...options.config, headers: options.config?.headers };
        const response = await axiosInstance.get<ApiResponse<T>>(fullUrl, config);
        return response.data;
      } catch (err) {
        showErrorToast(err, { title: "Error", message: "Error fetching data." });
        return {
          status: false,
          message: "Error fetching data",
          data: undefined,
        };
      }
    },
    enabled,
    staleTime: options.staleTime ?? 1000 * 60,
    gcTime: options.gcTime ?? 1000 * 60,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
  });
}

export function useCustomFetchMutation<T = unknown>(
  url: string | (() => string),
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options: CustomFetchMutationOptions<T> = {}
) {
  const baseUrl = getBaseUrl();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body?: unknown): Promise<ApiResponse<T>> => {
      const currentUrl = typeof url === "function" ? url() : url;
      const fullUrl = `${baseUrl}${currentUrl}`;
      const config = { ...options.config, headers: options.config?.headers };
      let response;
      switch (method) {
        case "POST":
          response = await axiosInstance.post<ApiResponse<T>>(fullUrl, body, config);
          break;
        case "PUT":
          response = await axiosInstance.put<ApiResponse<T>>(fullUrl, body, config);
          break;
        case "PATCH":
          response = await axiosInstance.patch<ApiResponse<T>>(fullUrl, body, config);
          break;
        case "DELETE":
          response = await axiosInstance.delete<ApiResponse<T>>(fullUrl, {
            ...config,
            ...(body !== undefined && body !== null ? { data: body } : {}),
          });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });

  const mutateAsync = (body?: unknown): Promise<ApiResponse<T>> =>
    new Promise((resolve, reject) => {
      mutation.mutate(body, {
        onSuccess: resolve,
        onError: reject,
      });
    });

  return {
    ...mutation,
    mutateAsync,
    mutateSync: mutation.mutate,
  };
}

export function createQueryKey(
  baseKey: string,
  params?: Record<string, unknown>
): (string | Record<string, unknown>)[] {
  if (!params) return [baseKey];
  return [baseKey, params];
}
