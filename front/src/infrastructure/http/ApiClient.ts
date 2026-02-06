import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const apiError = error.response.data as ApiResponse<never>;
          throw new Error(apiError.error || apiError.message || 'Error en la petición');
        } else if (error.request) {
          throw new Error('No se pudo conectar con el servidor');
        } else {
          throw new Error('Error al procesar la petición');
        }
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error en la respuesta');
    }
    return response.data.data as T;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Error en la respuesta');
    }
    return response.data.data as T;
  }
}
