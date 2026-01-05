/*
  # Create phone numbers table

  1. New Tables
    - `phone_numbers`
      - `id` (uuid, primary key) - Unique identifier for each phone number
      - `phone_number` (text, unique) - The phone number in international format
      - `name` (text) - Optional name for the contact
      - `created_at` (timestamptz) - Timestamp when the number was added
  
  2. Security
    - Enable RLS on `phone_numbers` table
    - Add policy for public access (since this is a simple admin tool)
    
  3. Notes
    - Phone numbers are stored in international format (e.g., +1234567890)
    - Each phone number can only be added once (unique constraint)
*/

CREATE TABLE IF NOT EXISTS phone_numbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to phone numbers"
  ON phone_numbers
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert of phone numbers"
  ON phone_numbers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete of phone numbers"
  ON phone_numbers
  FOR DELETE
  USING (true);

CREATE POLICY "Allow public update of phone numbers"
  ON phone_numbers
  FOR UPDATE
  USING (true)
  WITH CHECK (true);