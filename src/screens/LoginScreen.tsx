import { useState } from 'react';
import { Activity } from 'lucide-react';
import { Button } from '../components/Button';
import { UserRole } from '../types';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-7 h-7 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            {mode === 'login' ? 'Welcome to RecoverIQ' : 'Create your RecoverIQ account'}
          </h1>
          <p className="text-sm text-gray-600 text-center mb-8">
            {mode === 'login'
              ? 'Sign in to continue to your dashboard'
              : 'Set up your secure account to access your recovery insights'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                I am a
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="clinician">Clinician</option>
                <option value="patient">Patient</option>
              </select>
            </div>

            {mode === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jordan Lee"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {mode === 'signup' && role === 'patient' && (
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Patient ID (optional)
                </label>
                <input
                  id="patientId"
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="PT-2026-001"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to auto-generate a secure patient ID.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>

            {mode === 'login' && (
              <div className="text-center">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
              </div>
            )}
          </form>

          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-700 mb-2">
              {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Create account' : 'Back to sign in'}
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          RecoverIQ helps clinical teams monitor patient recovery through data-driven insights
        </p>
      </div>
    </div>
  );
}
