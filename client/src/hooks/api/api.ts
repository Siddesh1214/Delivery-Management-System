import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Define a generic API call function
async function apiCall<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' ,
  data: Record<string, any> | null = null,
  config: AxiosRequestConfig = {}
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios({
      url,
      method,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    console.error('API Call Error:', error.message || error);
    throw error;
  }
}

export default apiCall;
