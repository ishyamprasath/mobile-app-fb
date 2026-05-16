import axios from 'axios';
import { AdminDashboardData, AuthResponse, EmployeeDashboardData, SubmitPayload, User } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tvs_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('tvs_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function login(identifier: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { identifier, password });
  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  designation: string;
  department: string;
}) {
  const fullPayload = {
    ...payload,
    employeeId: 'TVS' + Date.now().toString().slice(-6),
    location: 'Chennai',
  };
  const { data } = await api.post<AuthResponse>('/auth/register', fullPayload);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}

export async function fetchEmployeeDashboard() {
  const { data } = await api.get<EmployeeDashboardData>('/employee/dashboard');
  return data;
}

export async function submitFeedback(payload: SubmitPayload) {
  const { data } = await api.post('/employee/submit', payload);
  return data;
}

export async function fetchAdminDashboard() {
  const { data } = await api.get<AdminDashboardData>('/admin/dashboard');
  return data;
}

export async function resetAllData() {
  const { data } = await api.post('/admin/reset');
  return data;
}

export default api;
