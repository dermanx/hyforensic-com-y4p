import { CHAT_CONFIG, CHAT_MESSAGES } from './constants';

export function validatePrompt(prompt: string): string | null {
  if (!prompt?.trim()) {
    return CHAT_MESSAGES.VALIDATION.EMPTY_PROMPT;
  }
  
  if (prompt.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
    return CHAT_MESSAGES.VALIDATION.LONG_MESSAGE(CHAT_CONFIG.MAX_MESSAGE_LENGTH);
  }
  
  return null;
}