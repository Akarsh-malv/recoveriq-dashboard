import { useState, useEffect } from 'react';
import { User, Bell, FileText, HelpCircle, LogOut, Upload, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/Button';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [programName, setProgramName] = useState('');

  useEffect(() => {
    loadPatientProfile();
  }, [user]);

  const loadPatientProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('patients')
        .select('full_name, patient_id, program:programs(name)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setPatientName(data.full_name);
        setPatientId(data.patient_id);
        const program = Array.isArray(data.program) ? data.program[0] : data.program;
        setProgramName(program?.name ?? '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-mid">Account</p>
            <h1 className="text-3xl font-semibold text-neutral-darkest">Profile</h1>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-darkest">{patientName || 'Patient'}</h2>
                <p className="text-sm text-neutral-mid">Patient ID: {patientId || '-'}</p>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  Trusted Profile
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-neutral-mid">Email</p>
                <p className="text-sm font-medium text-neutral-darkest">{user?.email}</p>
              </div>
              {programName && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="mb-1 text-xs text-neutral-mid">Enrolled Program</p>
                  <p className="text-sm font-semibold text-neutral-darkest">{programName}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-neutral-darkest">Data Management</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <Upload className="w-5 h-5 text-primary" />
                <span className="text-sm text-neutral-darkest">Connect Wearable Device</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm text-neutral-darkest">Upload Health Data</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-neutral-darkest">Preferences</h3>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-sm text-neutral-darkest">Notifications</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-neutral-darkest">Support</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-neutral-darkest">Help & Support</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm text-neutral-darkest">Privacy Policy</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-neutral-darkest">Session</h3>
              <p className="mb-4 text-sm text-neutral-mid">You are signed in securely.</p>
            </div>
            <Button variant="secondary" className="w-full" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
