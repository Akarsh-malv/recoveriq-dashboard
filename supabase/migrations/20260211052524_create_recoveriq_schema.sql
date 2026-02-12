/*
  # RecoverIQ Healthcare Platform Schema

  1. New Tables
    - `clinicians`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `programs`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `color` (text)
      - `created_at` (timestamp)
    
    - `patients`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text)
      - `patient_id` (text, unique identifier)
      - `program_id` (uuid, foreign key)
      - `risk_score` (numeric)
      - `risk_tier` (text: low, medium, high)
      - `last_data_sync` (timestamp)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `metrics`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `metric_name` (text: activity, sleep, heart_rate, etc.)
      - `baseline_value` (numeric)
      - `current_value` (numeric)
      - `unit` (text)
      - `recorded_at` (timestamp)
      - `created_at` (timestamp)
    
    - `alerts`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `severity` (text: low, medium, high)
      - `message` (text)
      - `metric_name` (text)
      - `acknowledged` (boolean)
      - `created_at` (timestamp)
    
    - `notes`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `clinician_id` (uuid, foreign key)
      - `content` (text)
      - `created_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `clinician_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `status` (text: pending, completed)
      - `due_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Clinicians can access all patient data
    - Patients can only access their own data
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Programs are viewable by authenticated users"
  ON programs FOR SELECT
  TO authenticated
  USING (true);

-- Create clinicians table
CREATE TABLE IF NOT EXISTS clinicians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'clinician',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinicians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view all clinician records"
  ON clinicians FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clinicians can update own record"
  ON clinicians FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  patient_id text UNIQUE NOT NULL,
  program_id uuid REFERENCES programs(id),
  risk_score numeric DEFAULT 0,
  risk_tier text DEFAULT 'low',
  last_data_sync timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view own record"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  metric_name text NOT NULL,
  baseline_value numeric DEFAULT 0,
  current_value numeric DEFAULT 0,
  unit text DEFAULT '',
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view all metrics"
  ON metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view own metrics"
  ON metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = metrics.patient_id
      AND patients.user_id = auth.uid()
    )
  );

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  severity text DEFAULT 'low',
  message text NOT NULL,
  metric_name text DEFAULT '',
  acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view all alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );

CREATE POLICY "Patients can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM patients
      WHERE patients.id = alerts.patient_id
      AND patients.user_id = auth.uid()
    )
  );

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  clinician_id uuid REFERENCES clinicians(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view all notes"
  ON notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can create notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  clinician_id uuid REFERENCES clinicians(id),
  title text NOT NULL,
  description text DEFAULT '',
  status text DEFAULT 'pending',
  due_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clinicians can view all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );

CREATE POLICY "Clinicians can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clinicians
      WHERE clinicians.user_id = auth.uid()
    )
  );