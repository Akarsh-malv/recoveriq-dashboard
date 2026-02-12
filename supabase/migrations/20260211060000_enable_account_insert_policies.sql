-- Allow newly registered users to create their own records in profile tables

CREATE POLICY "Clinicians can create own record"
  ON clinicians FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Patients can create own record"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
