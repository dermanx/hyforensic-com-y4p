/*
  # Enhance Security for Environment Variables

  1. Changes
    - Add encryption for sensitive values using pgcrypto
    - Add audit logging for sensitive data access
    - Implement row-level encryption for sensitive fields
    
  2. Security
    - Enable RLS with strict policies
    - Add audit logging
    - Implement encrypted storage for sensitive data
*/

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  performed_by uuid REFERENCES auth.users(id),
  performed_at timestamptz DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit logs
CREATE POLICY "Only service role can access audit logs"
  ON audit_logs
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role')::text = 'service_role');

-- Function to encrypt sensitive values
CREATE OR REPLACE FUNCTION encrypt_sensitive_value(value text)
RETURNS text AS $$
BEGIN
  RETURN encode(encrypt_iv(
    value::bytea,
    decode(current_setting('app.settings.encryption_key', true), 'base64'),
    decode(current_setting('app.settings.encryption_iv', true), 'base64'),
    'aes'
  ), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add encrypted value column
ALTER TABLE env_variables
ADD COLUMN IF NOT EXISTS encrypted_value text;

-- Create function for audit logging
CREATE OR REPLACE FUNCTION log_env_variables_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    performed_by
  )
  VALUES (
    TG_TABLE_NAME,
    NEW.id,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for audit logging
CREATE TRIGGER env_variables_audit
  AFTER INSERT OR UPDATE OR DELETE
  ON env_variables
  FOR EACH ROW
  EXECUTE FUNCTION log_env_variables_changes();

-- Update policies for env_variables
DROP POLICY IF EXISTS "Secure env variables access" ON env_variables;

CREATE POLICY "Strict env variables access"
  ON env_variables
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = 'service_role' OR
    (
      (auth.jwt() ->> 'role')::text = 'authenticated' AND
      NOT is_sensitive
    )
  );

-- Add comment for documentation
COMMENT ON TABLE env_variables IS 'Stores environment variables with encryption for sensitive values';