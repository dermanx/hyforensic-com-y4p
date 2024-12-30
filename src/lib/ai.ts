import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatSession } from './types';
import { SYSTEM_PROMPT, GENERATION_CONFIG } from './config';
import { CHAT_MESSAGES, CHAT_CONFIG } from './constants';
import { validatePrompt } from './validators';
import { validateEnvironment, checkRateLimit } from './env';
import { encryptData, decryptData, sanitizeInput, logSecurityEvent } from './security';

const envError = validateEnvironment();
if (envError) {
  console.error('Environment Error:', envError);
}

// Get API key from environment variable
const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

// Initialize AI model only when needed
const getModel = () => {
  if (!genAI) {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI.getGenerativeModel({
    model: CHAT_CONFIG.MODEL_NAME,
    generationConfig: GENERATION_CONFIG,
  });
};

let chatSession: ChatSession | null = null;

export async function generateResponse(prompt: string): Promise<string> {
  // Log attempt
  logSecurityEvent({
    type: 'ai_request',
    action: 'generate_response',
    details: { promptLength: prompt.length }
  });

  const apiKey = getApiKey();
  if (!apiKey) {
    return CHAT_MESSAGES.MISSING_API_KEY;
  }

  // Rate limiting
  if (!checkRateLimit('anonymous')) {
    return CHAT_MESSAGES.RATE_LIMIT_EXCEEDED;
  }
  const validationError = validatePrompt(prompt);
  if (validationError) {
    return validationError;
  }
  
  try {
    if (!chatSession) {
      const model = getModel();
      chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: SYSTEM_PROMPT,
          },
          {
            role: "model",
            parts: "Anlaşıldı. HYFORENSIC adli bilişim asistanı olarak hizmet vereceğim.",
          },
        ],
      });
    }

    const safePrompt = sanitizeInput(prompt.trim().slice(0, CHAT_CONFIG.MAX_MESSAGE_LENGTH));
    
    try {
      const result = await chatSession.sendMessage(safePrompt);
      
      if (!result || !result.response) {
        throw new Error('Invalid AI response');
      }

      const text = result.response.text();
      
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('Empty or invalid response from AI');
      }
      
      return text.trim();
    } catch (error) {
      // Reset chat session on API error
      chatSession = null;
      throw error;
    }
  } catch (error) {
    console.error('AI Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      prompt,
      timestamp: new Date().toISOString()
    });

    chatSession = null;
    return CHAT_MESSAGES.DEFAULT_ERROR;
  }
}