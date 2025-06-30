import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clerk-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export interface UploadDocumentRequest {
  fileName: string;
  fileType: string;
  content: string;
}

export interface UploadDocumentResponse {
  success: boolean;
  documentId: string;
  message: string;
}

export interface ChatRequest {
  documentId: string;
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  success: boolean;
  content: string;
  timestamp: string;
}

export interface DocumentInfo {
  documentId: string;
  fileName: string;
  fileType: string;
  size: number;
  uploadedAt: string;
  status: 'uploaded' | 'processing' | 'processed' | 'error';
  s3Key: string;
  insights?: {
    summary: string;
    keyEntities: string[];
    sentiment: string;
    readingTime: string;
    documentType: string;
    language: string;
  };
}

// API Functions
export const uploadDocument = async (request: UploadDocumentRequest): Promise<UploadDocumentResponse> => {
  const response = await api.post('/upload', request);
  return response.data;
};

export const chatWithDocument = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await api.post('/chat', request);
  return response.data;
};

export const getDocumentInfo = async (documentId: string): Promise<DocumentInfo> => {
  const response = await api.get(`/documents/${documentId}`);
  return response.data.document;
};

export const getUserDocuments = async (): Promise<DocumentInfo[]> => {
  const response = await api.get('/documents');
  return response.data.documents;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  await api.delete(`/documents/${documentId}`);
};

export default api;