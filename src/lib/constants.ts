export const CHAT_MESSAGES = {
  WELCOME: "Merhaba! HYFORENSIC Adli Bilişim konusunda size nasıl yardımcı olabilirim?",
  MAINTENANCE: "Merhaba! Şu anda bakım modundayız. Lütfen daha sonra tekrar deneyin.",
  AUTH_REQUIRED: "Bu özelliği kullanmak için lütfen giriş yapın.",
  RATE_LIMIT_EXCEEDED: "Çok fazla istek gönderdiniz. Lütfen bir süre bekleyin.",
  VALIDATION: {
    EMPTY_PROMPT: "Lütfen bir mesaj yazın.",
    LONG_MESSAGE: (max: number) => `Mesaj çok uzun (maksimum ${max} karakter)`
  },
  MISSING_API_KEY: "Sistem bakımda. Lütfen daha sonra tekrar deneyin.",
  DEFAULT_ERROR: "Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin."
} as const;

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MODEL_NAME: "gemini-pro"
} as const;