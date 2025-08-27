export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  message: string;
  timestamp: Date;
  id?: string;
}

export interface ChatResponse {
  answer: string;
  status: number;
}
