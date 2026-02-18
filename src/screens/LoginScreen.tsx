import { useState } from 'react';
import { Button } from '../components/Button';
import { UserRole } from '../types';
import { RecoverIQLogo } from '../components/common/RecoverIQLogo';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: UserRole) => Promise<void>;
  onSignup: (options: {
    email: string;
    password: string;
    role: UserRole;
    fullName: string;
    patientId?: string;
  }) => Promise<void>;
}

type AuthMode = 'login' | 'signup';

export function LoginScreen({ onLogin, onSignup }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('clinician');
  const [fullName, setFullName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email, password, role);
      } else {
        await onSignup({
          email,
          password,
          role,
          fullName,
          patientId: role === 'patient' ? patientId : undefined,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm md:min-h-[calc(100vh-3rem)] md:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-primary p-10 text-white md:flex md:flex-col md:justify-between">
          <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute right-10 bottom-20 h-40 w-40 rounded-full bg-primary-dark/30" />
          <div className="relative">
            <div className="inline-flex rounded-xl bg-white/15 p-1.5">
              <RecoverIQLogo size="lg" />
            </div>
            <h2 className="mt-6 text-4xl font-semibold leading-tight">Welcome Back</h2>
            <p className="mt-3 max-w-sm text-sm text-white/85">
              Secure access for clinicians and patients to monitor recovery and care progress.
            </p>
          </div>
          <div className="relative space-y-2 text-sm text-white/80">
            <p>Protected health workflows</p>
            <p>Role-based access</p>
            <p>Recovery trend visibility</p>
          </div>
        </aside>

        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-primary-light p-1.5">
                <RecoverIQLogo size="lg" />
              </div>
              <h1 className="text-3xl font-semibold text-neutral-darkest">
                {mode === 'login' ? 'Hello Again' : 'Create Account'}
              </h1>
              <p className="mt-2 text-sm text-neutral-mid">
                {mode === 'login'
                  ? 'Sign in to continue to RecoverIQ'
                  : 'Set up your secure account to access your recovery insights'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="role" className="mb-1.5 block text-sm font-medium text-neutral-darkest">
                  I am a
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="clinician">Clinician</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-neutral-darkest">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Jordan Lee"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-darkest">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-darkest">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter your password"
                />
              </div>

              {mode === 'signup' && role === 'patient' && (
                <div>
                  <label htmlFor="patientId" className="mb-1.5 block text-sm font-medium text-neutral-darkest">
                    Patient ID (optional)
                  </label>
                  <input
                    id="patientId"
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="PT-2026-001"
                  />
                  <p className="mt-1 text-xs text-neutral-mid">Leave blank to auto-generate a secure patient ID.</p>
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-danger/30 bg-danger/10 p-3">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full border border-primary bg-primary text-white hover:bg-primary-dark"
                disabled={loading}
              >
                {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : mode === 'login' ? 'Sign in' : 'Create account'}
              </Button>

              {mode === 'login' && (
                <div className="text-center">
                  <a href="#" className="text-sm text-primary hover:text-primary-dark">
                    Forgot password?
                  </a>
                </div>
              )}
            </form>

            <div className="mt-6 rounded-xl border border-gray-200 bg-primary-light p-4 text-center">
              <p className="mb-2 text-sm text-neutral-darkest">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <Button
                type="button"
                variant="secondary"
                className="w-full rounded-xl border-gray-300"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
              >
                {mode === 'login' ? 'Create account' : 'Back to sign in'}
              </Button>
            </div>

            <p className="mt-6 text-center text-xs text-neutral-mid">
              RecoverIQ helps clinical teams monitor patient recovery through data-driven insights
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
