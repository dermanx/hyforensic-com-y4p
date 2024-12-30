/*
  # Create environment variables table

  1. New Tables
    - `env_variables`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `env_variables` table
    - Add policy for authenticated users to read env variables
*/

CREATE TABLE IF NOT EXISTS env_variables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE env_variables ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to read env variables
CREATE POLICY "Allow authenticated users to read env variables"
  ON env_variables
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert the Gemini API key
INSERT INTO env_variables (key, value)
VALUES ('VITE_GEMINI_API_KEY', 'AIzaSyDRDlUJrpzZeBJauF9JveG9K_B-Co0HR2Q')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = now();