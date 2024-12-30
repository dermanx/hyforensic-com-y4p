import { GenerationConfig } from './types';

export const SYSTEM_PROMPT = `Sen HYFORENSIC adli bilişim şirketinin sanal asistanısın.
Adli bilişim, veri kurtarma ve dijital delil analizi konularında uzmansın. 
Yanıtlarını kısa, net ve profesyonel bir şekilde ver.`;

export const GENERATION_CONFIG: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};