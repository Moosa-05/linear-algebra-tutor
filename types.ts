export enum TeachingStyle {
  StepByStep = 'step-by-step',
  Concise = 'concise',
  ExamStyle = 'exam style',
  Intuition = 'intuition'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: string; // Base64 data string
  timestamp: number;
  isError?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  style: TeachingStyle;
}