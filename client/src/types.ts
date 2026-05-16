export type Role = 'employee' | 'admin';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: Role;
  designation: string;
  location: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardQuestion {
  id: string;
  question: string;
  category: string;
  options: string[];
}

export interface AnswerRecord {
  questionId: string;
  question: string;
  answer: string;
  score: number;
}

export interface DailyResponseSummary {
  _id: string;
  businessDateKey: string;
  mood: string;
  moodScore: number;
  averageScore: number;
  stressScore: number;
  engagementScore: number;
  productivityScore: number;
  submittedAt: string;
  answers: AnswerRecord[];
  confidentialNote?: string;
  anonymousNote: boolean;
}

export interface EmployeeDashboardData {
  employee: User;
  todayStatus: {
    businessDateKey: string;
    canSubmit: boolean;
    submittedAt: string | null;
    nextResetAt: string;
  };
  todayResponse: DailyResponseSummary | null;
  questions: DashboardQuestion[];
  history: DailyResponseSummary[];
  summary: {
    averageScore: number;
    stressScore: number;
    tip: string;
  };
  notification: {
    title: string;
    description: string;
  };
}

export interface SubmitPayload {
  mood: 'excited' | 'happy' | 'neutral' | 'tired' | 'stressed';
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
  confidentialNote?: string;
  anonymousNote: boolean;
}

export interface AdminDashboardData {
  overview: {
    totalEmployees: number;
    submissionsToday: number;
    submissionRate: number;
    sentimentScore: number;
    stressMeter: number;
    engagementScore: number;
  };
  departmentStats: Array<{
    department: string;
    count: number;
    averageScore: number;
    stressScore: number;
    engagementScore: number;
  }>;
  moodTrend: Array<{
    date: string;
    mood: number;
    stress: number;
    engagement: number;
  }>;
  burnoutHeatmap: Array<{
    team: string;
    burnoutRisk: number;
    morale: number;
  }>;
  productivityVsStress: Array<{
    team: string;
    employeeId: string;
    stress: number;
    productivity: number;
  }>;
  confidentialReports: Array<{
    id: string;
    employeeId: string;
    anonymous: boolean;
    text: string;
    aiCategory: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    priority: 'low' | 'medium' | 'high';
    businessDateKey: string;
    createdAt: string;
  }>;
  aiInsights: string[];
  employeeDirectory: Array<{
    id: string;
    employeeId: string;
    name: string;
    email: string;
    department: string;
    designation: string;
    location: string;
    latestAverageScore: number;
    latestStressScore: number;
    lastSubmittedAt: string | null;
  }>;
  allResponses: Array<{
    id: string;
    employeeId: string;
    name: string;
    department: string;
    businessDateKey: string;
    submittedAt: string;
    mood: string;
    moodScore: number;
    averageScore: number;
    stressScore: number;
    engagementScore: number;
    productivityScore: number;
    answers: AnswerRecord[];
    confidentialNote?: string;
    anonymousNote: boolean;
    aiCategory?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
    priority?: 'low' | 'medium' | 'high';
  }>;
}
