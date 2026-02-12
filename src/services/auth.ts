import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { UserRole } from '../types';

export interface AuthResult {
  user: User;
  role: UserRole;
}

async function resolveRole(user: User): Promise<UserRole> {
  const metadataRole = user.user_metadata?.role as UserRole | undefined;
  if (metadataRole) return metadataRole;

  // Fallback: check clinician or patient record
  const { data: clinician } = await supabase
    .from('clinicians')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (clinician) return 'clinician';

  const { data: patient } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (patient) return 'patient';

  throw new Error('No role found for user');
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    throw error ?? new Error('Unable to sign in');
  }
  const role = await resolveRole(data.user);
  return { user: data.user, role };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<AuthResult | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session || !data.session.user) return null;
  const role = await resolveRole(data.session.user);
  return { user: data.session.user, role };
}

export function onAuthChange(callback: (payload: AuthResult | null) => void) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      callback(null);
      return;
    }
    const role = await resolveRole(session.user);
    callback({ user: session.user, role });
  });
}
