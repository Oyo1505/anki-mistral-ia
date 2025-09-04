import { ContentChunk } from "@mistralai/mistralai/models/components";

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  message: string | ContentChunk[] | null | undefined;
  timestamp: Date;
  id?: string;
}

export interface ChatResponse {
  answer: string;
  status: number;
}
