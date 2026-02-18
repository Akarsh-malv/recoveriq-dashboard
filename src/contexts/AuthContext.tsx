import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { signIn as serviceSignIn } from '../services/auth';
import { UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  profile: {
    fullName: string;
    email: string;
    roleLabel: string;
  } | null;
  loading: boolean;
  signIn: (email: string, password: string, role: UserRole) => Promise<void>;
  signUp: (options: {
    email: string;
    password: string;
    role: UserRole;
    fullName: string;
    patientId?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (nextUser: User, nextRole: UserRole | null) => {
    const fallbackFullName = (nextUser.user_metadata?.full_name as string | undefined) ?? '';
    const fallbackEmail = nextUser.email ?? '';
    const fallbackRoleLabel = nextRole === 'patient' ? 'Patient' : 'Clinical Staff';

    if (!nextRole) {
      setProfile({
        fullName: fallbackFullName || 'Clinician',
        email: fallbackEmail,
        roleLabel: fallbackRoleLabel,
      });
      return;
    }

    if (nextRole === 'clinician') {
      const { data } = await supabase
        .from('clinicians')
        .select('full_name,email,role')
        .eq('user_id', nextUser.id)
        .maybeSingle();

      setProfile({
        fullName: data?.full_name ?? fallbackFullName ?? 'Clinician',
        email: data?.email ?? fallbackEmail,
        roleLabel: data?.role ? 'Clinician' : 'Clinical Staff',
      });
      return;
    }

    const { data } = await supabase
      .from('patients')
      .select('full_name')
      .eq('user_id', nextUser.id)
      .maybeSingle();

    setProfile({
      fullName: data?.full_name ?? fallbackFullName ?? 'Patient',
      email: fallbackEmail,
      roleLabel: 'Patient',
    });
  };

  const resolveRoleFromDatabase = async (nextUser: User): Promise<UserRole | null> => {
    const metadataRole = nextUser.user_metadata?.role as UserRole | undefined;
    if (metadataRole) {
      return metadataRole;
    }

    const { data: clinician } = await supabase
      .from('clinicians')
      .select('id')
      .eq('user_id', nextUser.id)
      .maybeSingle();

    if (clinician) {
      return 'clinician';
    }

    const { data: patient } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', nextUser.id)
      .maybeSingle();

    if (patient) {
      return 'patient';
    }

    return null;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const metadataRole = session.user.user_metadata?.role as UserRole | undefined;
      const storedRole = localStorage.getItem('userRole') as UserRole | null;
      const resolvedRole = metadataRole ?? storedRole ?? (await resolveRoleFromDatabase(session.user));
      setRole(resolvedRole);
      if (resolvedRole) {
        localStorage.setItem('userRole', resolvedRole);
      }
      await loadProfile(session.user, resolvedRole);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (!session) {
          setRole(null);
          setProfile(null);
          localStorage.removeItem('userRole');
        } else {
          const metadataRole = session.user.user_metadata?.role as UserRole | undefined;
          if (metadataRole) {
            setRole(metadataRole);
            localStorage.setItem('userRole', metadataRole);
            void loadProfile(session.user, metadataRole);
          } else {
            const storedRole = localStorage.getItem('userRole') as UserRole | null;
            const resolvedRole = storedRole ?? (await resolveRoleFromDatabase(session.user));
            setRole(resolvedRole);
            if (resolvedRole) {
              localStorage.setItem('userRole', resolvedRole);
            }
            void loadProfile(session.user, resolvedRole);
          }
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, _selectedRole: UserRole) => {
    const { user, role: resolvedRole } = await serviceSignIn(email, password);
    setRole(resolvedRole);
    localStorage.setItem('userRole', resolvedRole);
    setUser(user);
    await loadProfile(user, resolvedRole);
  };

  const signUp = async ({ email, password, role: selectedRole, fullName, patientId }: {
    email: string;
    password: string;
    role: UserRole;
    fullName: string;
    patientId?: string;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: selectedRole,
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    const user = data.user ?? data.session?.user;
    if (!user) {
      throw new Error('Account created, but no active session was returned. Please verify your email and sign in.');
    }

    const userId = user.id;

    if (selectedRole === 'clinician') {
      const { error: clinicianError } = await supabase.from('clinicians').insert({
        user_id: userId,
        email,
        full_name: fullName,
        role: 'clinician',
      });

      if (clinicianError) {
        throw clinicianError;
      }
    } else {
      const generatedPatientId = `PT-${(crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)).slice(0, 8).toUpperCase()}`;
      const safePatientId = (patientId && patientId.trim().length > 0) ? patientId.trim() : generatedPatientId;

      const { error: patientError } = await supabase.from('patients').insert({
        user_id: userId,
        full_name: fullName,
        patient_id: safePatientId,
        status: 'active',
      });

      if (patientError) {
        throw patientError;
      }
    }

    const metadataRole = user.user_metadata?.role as UserRole | undefined;
    const resolvedRole = metadataRole ?? selectedRole;

    setRole(resolvedRole);
    localStorage.setItem('userRole', resolvedRole);
    setUser(user);
    await loadProfile(user, resolvedRole);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setProfile(null);
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, role, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
