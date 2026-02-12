import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { signIn as serviceSignIn } from '../services/auth';
import { UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      const metadataRole = session?.user.user_metadata?.role as UserRole | undefined;
      const storedRole = localStorage.getItem('userRole') as UserRole | null;
      setRole(metadataRole ?? storedRole);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (!session) {
          setRole(null);
          localStorage.removeItem('userRole');
        } else {
          const metadataRole = session.user.user_metadata?.role as UserRole | undefined;
          if (metadataRole) {
            setRole(metadataRole);
            localStorage.setItem('userRole', metadataRole);
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
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOut }}>
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
