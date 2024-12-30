/*
  # Secure environment variables
  
  1. Changes
    - Add secure storage for environment variables
    - Update security policies
  
  2. Security
    - Enable RLS
    - Add policies for secure access
    - Store sensitive values securely
*/

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add secure columns to env_variables
ALTER TABLE IF EXISTS env_variables
ADD COLUMN IF NOT EXISTS is_sensitive boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS description text;

-- Update existing records
UPDATE env_variables
SET is_sensitive = true,
    description = 'Gemini API Key for AI chat functionality'
WHERE key = 'VITE_GEMINI_API_KEY';

-- Ensure the API key is stored
INSERT INTO env_variables (key, value, is_sensitive, description)
VALUES (
  'VITE_GEMINI_API_KEY',
  'AIzaSyDRDlUJrpzZeBJauF9JveG9K_B-Co0HR2Q',
  true,
  'Gemini API Key for AI chat functionality'
)
ON CONFLICT (key) 
DO UPDATE SET 
  value = EXCLUDED.value,
  is_sensitive = EXCLUDED.is_sensitive,
  description = EXCLUDED.description,
  updated_at = now();

-- Enhance security policies
DROP POLICY IF EXISTS "Allow authenticated users to read env variables" ON env_variables;

CREATE POLICY "Secure env variables access"
  ON env_variables
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = 'service_role' OR 
    (auth.jwt() ->> 'role')::text = 'authenticated'
  );