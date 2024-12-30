export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface ChatSession {
  sendMessage(message: string): Promise<{
    response: {
      text(): string;
    };
  }>;
}

export interface GenerationConfig {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
}

export interface SecurityEvent {
  type: string;
  userId?: string;
  action: string;
  details?: Record<string, unknown>;
  timestamp?: string;
  environment?: string;
}

export interface RateLimit {
  count: number;
  timestamp: number;
}