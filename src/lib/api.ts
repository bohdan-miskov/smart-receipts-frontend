import axios from 'axios';
import type { ReceiptsResponse, UploadResponse } from './types';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = import.meta.env.PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.debug('No auth session found', error);
  }

  return config;
});

export const receiptService = {
  getAll: async () => {
    const { data } = await apiClient.get<ReceiptsResponse>('/receipts');
    return data;
  },

  getUploadUrl: async () => {
    const { data } = await apiClient.post<UploadResponse>('/upload-url');
    return data;
  },

  uploadToS3: async (url: string, file: File) => {
    await axios.put(url, file, {
      headers: { 'Content-Type': file.type },
    });
  },
};
