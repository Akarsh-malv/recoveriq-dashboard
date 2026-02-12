/*
  # Seed Sample Data for RecoverIQ

  1. Sample Data
    - Creates 2 programs (Cardiac Recovery, Post-Surgical)
    - Creates 5 sample patients with varying risk levels
    - Creates baseline and current metrics for each patient
    - Creates sample alerts for high-risk patients
    - Creates sample clinical notes

  This migration provides realistic test data for the RecoverIQ platform.
  Data includes various risk tiers and metric patterns to demonstrate the platform's capabilities.
*/

-- Insert sample programs
INSERT INTO programs (id, name, description, color)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Cardiac Recovery', 'Post-cardiac event recovery program', '#3B82F6'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Post-Surgical Recovery', 'General post-operative recovery monitoring', '#10B981')
ON CONFLICT (id) DO NOTHING;

-- Insert sample patients
INSERT INTO patients (id, full_name, patient_id, program_id, risk_score, risk_tier, last_data_sync, status)
VALUES 
  (
    '650e8400-e29b-41d4-a716-446655440001',
    'Sarah Johnson',
    'PT-2024-001',
    '550e8400-e29b-41d4-a716-446655440001',
    78,
    'high',
    NOW() - INTERVAL '2 hours',
    'active'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440002',
    'Michael Chen',
    'PT-2024-002',
    '550e8400-e29b-41d4-a716-446655440001',
    45,
    'medium',
    NOW() - INTERVAL '4 hours',
    'active'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440003',
    'Emily Rodriguez',
    'PT-2024-003',
    '550e8400-e29b-41d4-a716-446655440002',
    22,
    'low',
    NOW() - INTERVAL '1 hour',
    'active'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440004',
    'James Patterson',
    'PT-2024-004',
    '550e8400-e29b-41d4-a716-446655440002',
    65,
    'high',
    NOW() - INTERVAL '6 hours',
    'active'
  ),
  (
    '650e8400-e29b-41d4-a716-446655440005',
    'Lisa Martinez',
    'PT-2024-005',
    '550e8400-e29b-41d4-a716-446655440001',
    38,
    'medium',
    NOW() - INTERVAL '3 hours',
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample metrics for Sarah Johnson (high risk - declining metrics)
INSERT INTO metrics (patient_id, metric_name, baseline_value, current_value, unit, recorded_at)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 'activity_minutes', 180, 115, 'min', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440001', 'sleep_hours', 7.5, 5.2, 'hrs', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440001', 'heart_rate', 72, 88, 'bpm', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440001', 'steps', 8500, 3200, 'steps', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440001', 'hrv', 45, 32, 'ms', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insert sample metrics for Michael Chen (medium risk)
INSERT INTO metrics (patient_id, metric_name, baseline_value, current_value, unit, recorded_at)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440002', 'activity_minutes', 150, 135, 'min', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440002', 'sleep_hours', 7.0, 6.5, 'hrs', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440002', 'heart_rate', 68, 74, 'bpm', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440002', 'steps', 7000, 6200, 'steps', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insert sample metrics for Emily Rodriguez (low risk - stable)
INSERT INTO metrics (patient_id, metric_name, baseline_value, current_value, unit, recorded_at)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440003', 'activity_minutes', 120, 125, 'min', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440003', 'sleep_hours', 8.0, 8.2, 'hrs', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440003', 'heart_rate', 65, 64, 'bpm', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440003', 'steps', 6500, 6800, 'steps', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insert sample metrics for James Patterson (high risk)
INSERT INTO metrics (patient_id, metric_name, baseline_value, current_value, unit, recorded_at)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440004', 'activity_minutes', 160, 95, 'min', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440004', 'sleep_hours', 7.0, 4.8, 'hrs', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440004', 'heart_rate', 70, 92, 'bpm', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440004', 'steps', 8000, 2500, 'steps', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insert sample metrics for Lisa Martinez (medium risk)
INSERT INTO metrics (patient_id, metric_name, baseline_value, current_value, unit, recorded_at)
VALUES 
  ('650e8400-e29b-41d4-a716-446655440005', 'activity_minutes', 140, 120, 'min', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440005', 'sleep_hours', 7.5, 6.8, 'hrs', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440005', 'heart_rate', 66, 72, 'bpm', NOW() - INTERVAL '1 day'),
  ('650e8400-e29b-41d4-a716-446655440005', 'steps', 7500, 5800, 'steps', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Insert sample alerts
INSERT INTO alerts (patient_id, severity, message, metric_name, acknowledged)
VALUES 
  (
    '650e8400-e29b-41d4-a716-446655440001',
    'high',
    'Activity level has dropped 36% below baseline over the past 3 days',
    'activity_minutes',
    false
  ),
  (
    '650e8400-e29b-41d4-a716-446655440001',
    'high',
    'Sleep duration significantly reduced - averaging 5.2 hours vs 7.5 hour baseline',
    'sleep_hours',
    false
  ),
  (
    '650e8400-e29b-41d4-a716-446655440004',
    'high',
    'Multiple declining metrics detected - activity and sleep below thresholds',
    'activity_minutes',
    false
  ),
  (
    '650e8400-e29b-41d4-a716-446655440002',
    'medium',
    'Gradual decline in activity levels - monitor for further changes',
    'activity_minutes',
    false
  ),
  (
    '650e8400-e29b-41d4-a716-446655440005',
    'medium',
    'Sleep quality trending downward - consider check-in',
    'sleep_hours',
    true
  )
ON CONFLICT DO NOTHING;